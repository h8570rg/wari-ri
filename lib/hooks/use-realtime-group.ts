"use client";

import { useEffect, useState } from "react";
import { subscribeToDocument } from "../firestore";
import { GroupDocument } from "../data";

export function useRealtimeGroup(groupId: string) {
  const [group, setGroup] = useState<GroupDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!groupId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToDocument<GroupDocument>(
      "groups",
      groupId,
      (data) => {
        if (data) {
          setGroup(data);
          setError(null);
        } else {
          setGroup(null);
          setError(new Error("Group not found"));
        }
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [groupId]);

  return { group, loading, error };
}
