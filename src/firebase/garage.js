import { db } from "./firebase";
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

function garageRef(groupId) {
  return collection(
    db,
    "campingGroups",
    groupId,
    "garage"
  );
}

function vehicleDoc(groupId, vehicleId) {
  return doc(
    db,
    "campingGroups",
    groupId,
    "garage",
    vehicleId
  );
}

function mapDoc(docSnap) {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

export function subscribeGarage(groupId, callback, onError) {
  const q = query(
    garageRef(groupId),
    orderBy("created")
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

export async function addVehicle(groupId, vehicle) {
  return addDoc(garageRef(groupId), {
    manufacturer: "",
    model: "",
    year: "",
    notes: "",
    image: "",
    registration: "",
    ...vehicle,
  });
}

export async function updateVehicle(groupId, id, data) {
  return updateDoc(
    vehicleDoc(groupId, id),
    data
  );
}

export async function deleteVehicle(groupId, id) {
  return deleteDoc(
    vehicleDoc(groupId, id)
  );
}

export async function getVehicle(groupId, id) {
  const snapshot = await getDoc(vehicleDoc(groupId, id));
  return snapshot.exists() ? mapDoc(snapshot) : null;
}
