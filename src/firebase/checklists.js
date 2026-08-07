import { db } from "./firebase";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
  getDocs,
} from "firebase/firestore";

function checklistRef(groupId, type) {
  return collection(db, "campingGroups", groupId, "checklists", type, "items");
}

function checklistDoc(groupId, type, id) {
  return doc(db, "campingGroups", groupId, "checklists", type, "items", id);
}

function mapDoc(docSnap) {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

export function subscribeChecklist(groupId, type, callback, onError) {
  const q = query(checklistRef(groupId, type), orderBy("order"));

  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map(mapDoc));
    },
    (error) => {
      console.error(error);
      onError?.(error);
    }
  );
}

export async function addChecklistItem(groupId, type, item) {
  return addDoc(checklistRef(groupId, type), item);
}

export async function updateChecklistItem(groupId, type, id, data) {
  return updateDoc(checklistDoc(groupId, type, id), data);
}

export async function deleteChecklistItem(groupId, type, id) {
  return deleteDoc(checklistDoc(groupId, type, id));
}

export async function updateChecklistOrder(groupId, type, items) {
  const batch = writeBatch(db);

  items.forEach((item, index) => {
    batch.update(
      checklistDoc(groupId, type, item.id),
      {
        order: index,
      }
    );
  });

  await batch.commit();
}

export async function initialiseChecklist(groupId, type, defaultItems) {
  const snapshot = await getDocs(checklistRef(groupId, type));

  const existingIds = new Set(
    snapshot.docs.map((doc) => doc.id)
  );

  if (existingIds.size === defaultItems.length) {
    return;
  }

  const batch = writeBatch(db);

  defaultItems.forEach((text, index) => {
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "");

    if (existingIds.has(id)) return;

    batch.set(
      checklistDoc(groupId, type, id),
      {
        text,
        checked: false,
        order: index,
        custom: false,
      }
    );
  });

  await batch.commit();
}
