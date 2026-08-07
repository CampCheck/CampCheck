import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "./AuthProvider";

const GroupContext = createContext(null);

export function GroupProvider({ children }) {
  const { user } = useAuth();

  const [groupId, setGroupId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setGroupId(null);
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

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  return (
    <GroupContext.Provider value={{ groupId }}>
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  return useContext(GroupContext);
}
