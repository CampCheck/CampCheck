import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

import { db } from "./firebase";

const tripsRef = collection(db, "trips");

function mapDoc(docSnap) {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

export function subscribeTrips(callback, onError) {
  const q = query(tripsRef, orderBy("arrival"));

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

export async function getTrip(id) {
  const docSnap = await getDoc(doc(db, "trips", id));

  if (!docSnap.exists()) {
    return null;
  }

  return mapDoc(docSnap);
}

export async function addTrip(trip) {
  return addDoc(tripsRef, {
    ...trip,
    created: trip.created || new Date().toISOString(),
  });
}

export async function updateTrip(id, trip) {
  await updateDoc(doc(db, "trips", id), trip);
}

export async function deleteTrip(id) {
  await deleteDoc(doc(db, "trips", id));
}
