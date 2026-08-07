import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { app } from "../firebase/firebase";

export const auth = getAuth(app);

export async function signIn() {
  if (!auth.currentUser) {
    await signInAnonymously(auth);
  }
}

export { onAuthStateChanged };