import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const MAX_BATCH_WRITES = 450;
const LEGACY_CHECKLIST_TYPES = [
  "departureChecklist",
  "arrivalChecklist",
  "leavingChecklist",
  "arrivalHomeChecklist",
];

async function copyCollection(source, destination) {
  const sourceSnapshot = await getDocs(source);
  let copied = 0;
  let batch = writeBatch(db);
  let writes = 0;

  for (const sourceDocument of sourceSnapshot.docs) {
    const destinationDocument = doc(destination, sourceDocument.id);
    const destinationSnapshot = await getDoc(destinationDocument);

    if (destinationSnapshot.exists()) continue;

    batch.set(destinationDocument, sourceDocument.data());
    copied += 1;
    writes += 1;

    if (writes === MAX_BATCH_WRITES) {
      await batch.commit();
      batch = writeBatch(db);
      writes = 0;
    }
  }

  if (writes > 0) await batch.commit();
  return copied;
}

async function copyLegacyChecklists(groupId) {
  const legacyChecklists = await getDocs(collection(db, "checklists"));
  let copied = 0;
  const checklistTypes = new Set([
    ...LEGACY_CHECKLIST_TYPES,
    ...legacyChecklists.docs.map((checklist) => checklist.id),
  ]);

  for (const checklistId of checklistTypes) {
    const legacyChecklist = doc(db, "checklists", checklistId);
    const targetChecklist = doc(
      db,
      "campingGroups",
      groupId,
      "checklists",
      checklistId
    );

    const [legacyChecklistSnapshot, targetChecklistSnapshot] = await Promise.all([
      getDoc(legacyChecklist),
      getDoc(targetChecklist),
    ]);
    if (legacyChecklistSnapshot.exists() && !targetChecklistSnapshot.exists()) {
      await setDoc(targetChecklist, legacyChecklistSnapshot.data());
      copied += 1;
    }

    copied += await copyCollection(
      collection(legacyChecklist, "items"),
      collection(targetChecklist, "items")
    );
  }

  return copied;
}

/**
 * Copies legacy top-level data once. Existing group documents always win, so
 * this operation is safe to retry after an interrupted migration.
 */
export async function migrateLegacyData(userId, groupId) {
  const userReference = doc(db, "users", userId);
  const userSnapshot = await getDoc(userReference);

  if (userSnapshot.data()?.dataMigrated === true) {
    return { alreadyMigrated: true, copied: 0 };
  }

  const groupPath = ["campingGroups", groupId];
  const [garageCopied, tripsCopied, shoppingCopied, checklistsCopied] = await Promise.all([
    copyCollection(collection(db, "garage"), collection(db, ...groupPath, "garage")),
    copyCollection(collection(db, "trips"), collection(db, ...groupPath, "trips")),
    copyCollection(collection(db, "shopping"), collection(db, ...groupPath, "shopping")),
    copyLegacyChecklists(groupId),
  ]);

  await setDoc(userReference, { dataMigrated: true }, { merge: true });

  return {
    alreadyMigrated: false,
    copied: garageCopied + tripsCopied + shoppingCopied + checklistsCopied,
  };
}
