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

  const existingItems = snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));

  const defaultIds = new Set(
    defaultItems.map((text) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    )
  );

  const batch = writeBatch(db);

  // Remove old default items that are no longer in the new checklist.
  // Custom items are kept.
  existingItems.forEach((item) => {
    if (item.custom !== true && !defaultIds.has(item.id)) {
      batch.delete(checklistDoc(groupId, type, item.id));
    }
  });

  // Add new default items and update the order of existing ones.
  defaultItems.forEach((text, index) => {
    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const existingItem = existingItems.find(
      (item) => item.id === id
    );

    if (existingItem) {
      batch.update(
        checklistDoc(groupId, type, id),
        {
          order: index,
        }
      );
    } else {
      batch.set(
        checklistDoc(groupId, type, id),
        {
          text,
          checked: false,
          order: index,
          custom: false,
        }
      );
    }
  });

  await batch.commit();
}
export async function resetChecklist(
  groupId,
  type
) {
  const snapshot = await getDocs(
    checklistRef(groupId, type)
  );

  const batch = writeBatch(db);

  snapshot.docs.forEach((docSnap) => {
    const item = docSnap.data();

    if (item.checked === true) {
      batch.update(
        checklistDoc(
          groupId,
          type,
          docSnap.id
        ),
        {
          checked: false,
        }
      );
    }
  });

  await batch.commit();
}