import {
  collection,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  limit,
  onSnapshot,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase/firebase";

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

export async function createCampingGroup(
  user,
  name,
  campingStyle
) {
  let inviteCode = generateInviteCode();

  while (
    (
      await getDocs(
        query(
          collection(db, "campingGroups"),
          where("inviteCode", "==", inviteCode),
          limit(1)
        )
      )
    ).size
  ) {
    inviteCode = generateInviteCode();
  }

  const groupRef = await addDoc(
    collection(db, "campingGroups"),
    {
      name,
      campingStyle,
      owner: user.uid,
      inviteCode,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
    }
  );

  await setDoc(
    doc(
      db,
      "campingGroups",
      groupRef.id,
      "members",
      user.uid
    ),
    {
      role: "owner",
      joinedAt: serverTimestamp(),
      displayName: "Owner",
    }
  );

  await setDoc(
    doc(db, "users", user.uid),
    {
      currentGroupId: groupRef.id,
      joinedAt: serverTimestamp(),
    }
  );

  return groupRef.id;
}

export async function joinCampingGroup(
  user,
  code
) {
  const inviteCode = code
    .trim()
    .toUpperCase();

  const matches = await getDocs(
    query(
      collection(db, "campingGroups"),
      where("inviteCode", "==", inviteCode),
      limit(1)
    )
  );

  if (matches.empty) {
    throw new Error("INVALID_INVITE_CODE");
  }

  const group = matches.docs[0];

  await setDoc(
    doc(
      db,
      "campingGroups",
      group.id,
      "members",
      user.uid
    ),
    {
      role: "member",
      joinedAt: serverTimestamp(),
      displayName: "Member",
    },
    { merge: true }
  );

  await setDoc(
    doc(db, "users", user.uid),
    {
      currentGroupId: group.id,
      joinedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return group.id;
}

export function subscribeCampingGroup(
  groupId,
  callback,
  onError
) {
  return onSnapshot(
    doc(db, "campingGroups", groupId),
    (snapshot) => {
      callback(
        snapshot.exists()
          ? {
              id: snapshot.id,
              ...snapshot.data(),
            }
          : null
      );
    },
    onError
  );
}

export function subscribeGroupMembers(
  groupId,
  callback,
  onError
) {
  return onSnapshot(
    collection(
      db,
      "campingGroups",
      groupId,
      "members"
    ),
    (snapshot) => {
      callback(
        snapshot.docs.map((member) => ({
          uid: member.id,
          ...member.data(),
        }))
      );
    },
    onError
  );
}

export async function updateCampingStyle(
  groupId,
  campingStyle
) {
  await updateDoc(
    doc(db, "campingGroups", groupId),
    {
      campingStyle,
    }
  );
}

export async function regenerateInviteCode(
  groupId
) {
  let inviteCode = generateInviteCode();

  while (
    (
      await getDocs(
        query(
          collection(db, "campingGroups"),
          where("inviteCode", "==", inviteCode),
          limit(1)
        )
      )
    ).size
  ) {
    inviteCode = generateInviteCode();
  }

  await updateDoc(
    doc(db, "campingGroups", groupId),
    {
      inviteCode,
    }
  );

  return inviteCode;
}

export async function removeGroupMember(
  groupId,
  memberId
) {
  await deleteDoc(
    doc(
      db,
      "campingGroups",
      groupId,
      "members",
      memberId
    )
  );
}

export async function updateMemberName(
  groupId,
  userId,
  displayName
) {
  await updateDoc(
    doc(
      db,
      "campingGroups",
      groupId,
      "members",
      userId
    ),
    {
      displayName: displayName.trim(),
    }
  );
}

export async function transferGroupOwnership(
  groupId,
  newOwnerId
) {
  const groupRef = doc(
    db,
    "campingGroups",
    groupId
  );

  const membersRef = collection(
    db,
    "campingGroups",
    groupId,
    "members"
  );

  const groupSnapshot = await getDocs(
    query(membersRef, limit(100))
  );

  const batchUpdates =
    groupSnapshot.docs.map((member) => ({
      id: member.id,
      role: member.data().role,
    }));

  await updateDoc(groupRef, {
    owner: newOwnerId,
  });

  for (const member of batchUpdates) {
    await updateDoc(
      doc(
        db,
        "campingGroups",
        groupId,
        "members",
        member.id
      ),
      {
        role:
          member.id === newOwnerId
            ? "owner"
            : member.role === "owner"
            ? "member"
            : member.role,
      }
    );
  }
}

export async function leaveCampingGroup(
  groupId,
  userId
) {
  await deleteDoc(
    doc(
      db,
      "campingGroups",
      groupId,
      "members",
      userId
    )
  );

  await setDoc(
    doc(db, "users", userId),
    {
      currentGroupId: null,
    },
    { merge: true }
  );
}