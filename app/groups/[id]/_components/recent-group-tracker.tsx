"use client";

import { useEffect } from "react";
import { addRecentGroupId } from "@/lib/local-storage";

export function RecentGroupTracker({ groupId }: { groupId: string }) {
  useEffect(() => {
    // グループページを閲覧した時にlocal storageにIDを保存
    addRecentGroupId(groupId);
  }, [groupId]);

  // このコンポーネントは見た目に影響しない
  return null;
}
