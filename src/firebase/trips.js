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

function tripsRef(groupId) {
  return collection(
    db,
    "campingGroups",
    groupId,
    "trips"
  );
}

function tripDoc(groupId, tripId) {
  return doc(
    db,
    "campingGroups",
    groupId,
    "trips",
    tripId
  );
}

function mapDoc(docSnap) {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

export function subscribeTrips(groupId, callback, onError) {
  const q = query(
    tripsRef(groupId),
    orderBy("arrival")
  );

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

export async function getTrip(groupId, id) {
  const docSnap = await getDoc(
    tripDoc(groupId, id)
  );

  if (!docSnap.exists()) {
    return null;
  }

  return mapDoc(docSnap);
}

export async function addTrip(groupId, trip) {
  return addDoc(tripsRef(groupId), {
    ...trip,
    created: trip.created || new Date().toISOString(),
  });
}

export async function updateTrip(groupId, id, trip) {
  await updateDoc(
    tripDoc(groupId, id),
    trip
  );
}

export async function deleteTrip(groupId, id) {
  await deleteDoc(
    tripDoc(groupId, id)
  );
}