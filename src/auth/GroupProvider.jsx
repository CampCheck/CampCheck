import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "./AuthProvider";
import { startPresence } from "../services/presenceService";
import { DEFAULT_CAMPING_STYLE } from "../campingStyles";

const GroupContext = createContext(null);

export function GroupProvider({ children }) {
  const { user } = useAuth();

  const [groupId, setGroupId] = useState(null);
  const [campingStyle, setCampingStyle] = useState(DEFAULT_CAMPING_STYLE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGroupId(null);
      setCampingStyle(DEFAULT_CAMPING_STYLE);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    return onSnapshot(doc(db, "users", user.uid), (snap) => {
      setGroupId(snap.data()?.currentGroupId ?? null);
      setLoading(false);
    }, (error) => {
      console.error("Unable to load camping group", error);
      setGroupId(null);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!user || !groupId) return undefined;

    const unsubscribe = onSnapshot(doc(db, "campingGroups", groupId), (snapshot) => {
      setCampingStyle(snapshot.data()?.campingStyle || DEFAULT_CAMPING_STYLE);
    }, console.error);
    const stopPresence = startPresence(groupId, user.uid);

    return () => {
      unsubscribe();
      stopPresence();
    };
  }, [groupId, user]);

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <GroupContext.Provider value={{ groupId, campingStyle }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  return useContext(GroupContext);
}
