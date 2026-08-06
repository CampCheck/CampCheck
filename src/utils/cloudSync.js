import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const STORAGE_KEYS = [
  "departureChecklist",
  "arrivalChecklist",
  "leavingChecklist",
  "arrivalHomeChecklist",
  "shoppingItems",
  "trips",
];

export async function backupToCloud(userId) {
  const data = {};

  STORAGE_KEYS.forEach((key) => {
    const value = localStorage.getItem(key);

    if (value !== null) {
      data[key] = JSON.parse(value);
    }
  });

  await setDoc(doc(db, "users", userId), data);

  return true;
}

export async function restoreFromCloud(userId) {
  const snapshot = await getDoc(doc(db, "users", userId));

  if (!snapshot.exists()) {
    throw new Error("No backup found.");
  }

  const data = snapshot.data();

  STORAGE_KEYS.forEach((key) => {
    if (data[key] !== undefined) {
      localStorage.setItem(key, JSON.stringify(data[key]));
    }
  });

  return true;
}