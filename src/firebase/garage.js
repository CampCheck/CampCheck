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
} from "firebase/firestore";

function garageRef() {
  return collection(db, "garage");
}

function mapDoc(docSnap) {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

export function subscribeGarage(callback, onError) {
  const q = query(garageRef(), orderBy("created"));

  return onSnapshot(
    q,
    (snapshot) => callback(snapshot.docs.map(mapDoc)),
    (error) => {
      console.error(error);
      onError?.(error);
    }
  );
}

export async function addVehicle(vehicle) {
  return addDoc(garageRef(), {
    manufacturer: "",
    model: "",
    year: "",
    notes: "",
    image: "",
    registration: "",
    ...vehicle,
  });
}

export async function updateVehicle(id, data) {
  return updateDoc(doc(db, "garage", id), data);
}

export async function deleteVehicle(id) {
  return deleteDoc(doc(db, "garage", id));
}