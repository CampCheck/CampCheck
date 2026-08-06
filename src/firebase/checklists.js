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

function checklistRef(type) {
  return collection(db, "checklists", type, "items");
}

function mapDoc(docSnap) {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

export function subscribeChecklist(type, callback, onError) {
  const q = query(checklistRef(type), orderBy("order"));

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

export async function addChecklistItem(type, item) {
  return addDoc(checklistRef(type), item);
}

export async function updateChecklistItem(type, id, data) {
  return updateDoc(
    doc(db, "checklists", type, "items", id),
    data
  );
}

export async function deleteChecklistItem(type, id) {
  return deleteDoc(
    doc(db, "checklists", type, "items", id)
  );
}

export async function updateChecklistOrder(type, items) {
  const batch = writeBatch(db);

  items.forEach((item, index) => {
    batch.update(
      doc(db, "checklists", type, "items", item.id),
      {
        order: index,
      }
    );
  });

  await batch.commit();
}

export async function initialiseChecklist(type, defaultItems) {
  const snapshot = await getDocs(checklistRef(type));

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
      doc(db, "checklists", type, "items", id),
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