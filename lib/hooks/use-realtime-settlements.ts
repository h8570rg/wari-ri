"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";
import { createConverter } from "../firestore";

// Settlement型の定義（data.tsから移植）
type SettlementDocument = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: "settlement";
  fromUserId: string;
  toUserId: string;
  amount: number;
};

type Settlement = {
  id: string;
  createdAt: Date;
  fromUserId: string;
  toUserId: string;
  amount: number;
};

export function useRealtimeSettlements(groupId: string) {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const converter = createConverter<SettlementDocument>();
    const activitiesRef = collection(
      db,
      "groups",
      groupId,
      "activities",
    ).withConverter(converter);
    const settlementQuery = query(activitiesRef);

    const unsubscribe = onSnapshot(settlementQuery, (snapshot) => {
      try {
        const settlementData = snapshot.docs
          .map((doc) => doc.data())
          .filter((activity) => activity.type === "settlement")
          .map((activity) => ({
            id: activity.id,
            createdAt: activity.createdAt,
            fromUserId: activity.fromUserId,
            toUserId: activity.toUserId,
            amount: activity.amount,
          }));

        setSettlements(settlementData);
        setError(null);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [groupId]);

  return { settlements, loading, error };
}
