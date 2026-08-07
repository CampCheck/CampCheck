import { initializeApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCCoigSICKBZRxzlF2kS2-MAAmHawFOnY",
  authDomain: "campcheck-39b64.firebaseapp.com",
  projectId: "campcheck-39b64",
  storageBucket: "campcheck-39b64.firebasestorage.app",
  messagingSenderId: "747666616982",
  appId: "1:747666616982:web:f7c8c3557485bae36d88b7",
};

export const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
});
