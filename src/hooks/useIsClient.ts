// useFirestore.js
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";

const useIsClient = (): any => {
  const [firestore, setFirestore] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && db) {
      setFirestore(db);
    }
  }, []);

  return firestore;
};

export default useIsClient;
