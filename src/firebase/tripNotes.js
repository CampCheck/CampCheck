import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function updateTripNotes(
  groupId,
  tripId,
  notes
) {
  if (!groupId || !tripId) {
    throw new Error("Missing group ID or trip ID.");
  }

  const tripRef = doc(
    db,
    "campingGroups",
    groupId,
    "trips",
    tripId
  );

  await updateDoc(tripRef, {
    notes: notes || "",
  });
}

export async function deleteTripNotes(
  groupId,
  tripId
) {
  if (!groupId || !tripId) {
    throw new Error("Missing group ID or trip ID.");
  }

  const tripRef = doc(
    db,
    "campingGroups",
    groupId,
    "trips",
    tripId
  );

  await updateDoc(tripRef, {
    notes: "",
  });
}