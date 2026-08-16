import { deleteUser } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  writeBatch,
} from "firebase/firestore";

import { auth } from "../auth/auth";
import { db } from "../firebase/firebase";

const MAX_BATCH_WRITES = 450;

async function deleteCollection(collectionRef) {
  const snapshot = await getDocs(collectionRef);

  if (snapshot.empty) return;

  let batch = writeBatch(db);
  let writes = 0;

  for (const document of snapshot.docs) {
    batch.delete(document.ref);
    writes++;

    if (writes === MAX_BATCH_WRITES) {
      await batch.commit();
      batch = writeBatch(db);
      writes = 0;
    }
  }

  if (writes > 0) {
    await batch.commit();
  }
}

async function deleteGroupData(groupId) {
  // Delete garage
  await deleteCollection(
    collection(
      db,
      "campingGroups",
      groupId,
      "garage"
    )
  );

  // Delete trips
  await deleteCollection(
    collection(
      db,
      "campingGroups",
      groupId,
      "trips"
    )
  );

  // Delete shopping
  await deleteCollection(
    collection(
      db,
      "campingGroups",
      groupId,
      "shopping"
    )
  );

  // Delete checklist items first
  const checklistsRef = collection(
    db,
    "campingGroups",
    groupId,
    "checklists"
  );

  const checklistsSnapshot = await getDocs(
    checklistsRef
  );

  for (const checklist of checklistsSnapshot.docs) {
    await deleteCollection(
      collection(
        db,
        "campingGroups",
        groupId,
        "checklists",
        checklist.id,
        "items"
      )
    );
  }

  // Delete checklist documents
  await deleteCollection(checklistsRef);

  // Delete group members
  await deleteCollection(
    collection(
      db,
      "campingGroups",
      groupId,
      "members"
    )
  );

  // Finally delete the group itself
  const groupRef = doc(
    db,
    "campingGroups",
    groupId
  );

  const batch = writeBatch(db);
  batch.delete(groupRef);

  await batch.commit();
}

export async function deleteCampCheckAccount(
  user,
  groupId
) {
  if (!user) {
    throw new Error("NO_USER");
  }

  const uid = user.uid;

  /*
   * Handle camping group membership.
   */
  if (groupId) {
    const groupRef = doc(
      db,
      "campingGroups",
      groupId
    );

    const memberRef = doc(
      db,
      "campingGroups",
      groupId,
      "members",
      uid
    );

    const [groupSnapshot, membersSnapshot] =
      await Promise.all([
        getDoc(groupRef),
        getDocs(
          collection(
            db,
            "campingGroups",
            groupId,
            "members"
          )
        ),
      ]);

    if (groupSnapshot.exists()) {
      const groupData = groupSnapshot.data();

      const members = membersSnapshot.docs.map(
        (member) => ({
          uid: member.id,
          ...member.data(),
        })
      );

      const isOwner =
        groupData.owner === uid;

      const remainingMembers =
        members.filter(
          (member) => member.uid !== uid
        );

      /*
       * OWNER + NO OTHER MEMBERS
       *
       * Delete the entire empty group.
       */
      if (
        isOwner &&
        remainingMembers.length === 0
      ) {
        await deleteGroupData(groupId);
      }

      /*
       * OWNER + OTHER MEMBERS
       *
       * Transfer ownership to the first
       * remaining member.
       */
      else if (isOwner) {
        const newOwner =
          remainingMembers[0];

        const batch = writeBatch(db);

        batch.update(groupRef, {
          owner: newOwner.uid,
        });

        batch.update(
          doc(
            db,
            "campingGroups",
            groupId,
            "members",
            newOwner.uid
          ),
          {
            role: "owner",
          }
        );

        batch.delete(memberRef);

        await batch.commit();
      }

      /*
       * NORMAL MEMBER
       *
       * Only remove their membership.
       */
      else {
        const batch = writeBatch(db);

        batch.delete(memberRef);

        await batch.commit();
      }
    }
  }

  /*
   * Delete the user's personal document.
   */
  const userRef = doc(
    db,
    "users",
    uid
  );

  const userBatch = writeBatch(db);

  userBatch.delete(userRef);

  await userBatch.commit();

  /*
   * Finally delete the Firebase
   * Authentication account.
   */
  if (auth.currentUser) {
    await deleteUser(
      auth.currentUser
    );
  }
}