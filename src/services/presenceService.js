import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

function updatePresence(groupId, userId, online) {
  return setDoc(doc(db, "campingGroups", groupId, "members", userId), {
    online,
    lastSeen: serverTimestamp(),
  }, { merge: true });
}

export function startPresence(groupId, userId) {
  const markOnline = () => updatePresence(groupId, userId, true).catch(console.error);
  const markOffline = () => updatePresence(groupId, userId, false).catch(() => {});
  const onVisibilityChange = () => (document.visibilityState === "visible" ? markOnline() : markOffline());

  markOnline();
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("beforeunload", markOffline);

  return () => {
    markOffline();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("beforeunload", markOffline);
  };
}
