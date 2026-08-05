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

const shoppingRef = collection(db, "shopping");

function mapDoc(docSnap) {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

export function subscribeShopping(callback, onError) {
  const q = query(shoppingRef, orderBy("text"));

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

export async function addShoppingItem(item) {
  return addDoc(shoppingRef, item);
}

export async function updateShoppingItem(id, updates) {
  return updateDoc(doc(db, "shopping", id), updates);
}

export async function deleteShoppingItem(id) {
  return deleteDoc(doc(db, "shopping", id));
}

export async function untickAllShopping() {
  const snapshot = await getDocs(shoppingRef);

  const batch = writeBatch(db);

  snapshot.forEach((docSnap) => {
    batch.update(docSnap.ref, {
      checked: false,
    });
  });

  await batch.commit();
}