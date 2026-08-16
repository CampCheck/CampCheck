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

import { db } from "./firebase";

function tasksRef(groupId) {
  return collection(
    db,
    "campingGroups",
    groupId,
    "tasks"
  );
}

function taskRef(groupId, id) {
  return doc(
    db,
    "campingGroups",
    groupId,
    "tasks",
    id
  );
}

function mapTask(docSnap) {
  return {
    id: docSnap.id,
    ...docSnap.data(),
  };
}

export function subscribeTasks(
  groupId,
  callback,
  onError
) {
  const q = query(
    tasksRef(groupId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map(mapTask));
    },
    (error) => {
      console.error(error);
      onError?.(error);
    }
  );
}

export function addTask(groupId, task) {
  return addDoc(tasksRef(groupId), {
    ...task,
    completed: false,
    createdAt: Date.now(),
  });
}

export function updateTask(
  groupId,
  id,
  data
) {
  return updateDoc(
    taskRef(groupId, id),
    data
  );
}

export function deleteTask(groupId, id) {
  return deleteDoc(
    taskRef(groupId, id)
  );
}