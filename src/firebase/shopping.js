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

import { db } from "./firebase";

function shoppingRef(groupId) {
  return collection(
    db,
    "campingGroups",
    groupId,
    "shopping"
  );
}

function shoppingDoc(groupId, id) {
  return doc(
    db,
    "campingGroups",
    groupId,
    "shopping",
    id
  );
}

function mapDoc(docSnap) {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

export function subscribeShopping(groupId, callback, onError) {
  const q = query(
    shoppingRef(groupId),
    orderBy("text")
  );

  return onSnapshot(
    q,
    (snapshot) => callback(snapshot.docs.map(mapDoc)),
    (error) => {
      console.error(error);
      onError?.(error);
    }
  );
}

export async function addShoppingItem(groupId, item) {
  return addDoc(shoppingRef(groupId), item);
}

export async function updateShoppingItem(groupId, id, updates) {
  return updateDoc(
    shoppingDoc(groupId, id),
    updates
  );
}

export async function deleteShoppingItem(groupId, id) {
  return deleteDoc(
    shoppingDoc(groupId, id)
  );
}

export async function untickAllShopping(groupId) {
  const snapshot = await getDocs(
    shoppingRef(groupId)
  );

  const batch = writeBatch(db);

  snapshot.forEach((docSnap) => {
    batch.update(docSnap.ref, {
      checked: false,
    });
  });

  await batch.commit();
}