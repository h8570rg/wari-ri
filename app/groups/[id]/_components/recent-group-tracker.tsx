"use client";

import { useEffect } from "react";
import { addRecentGroup } from "@/lib/local-storage";

export function RecentGroupTracker({
	groupId,
	groupName,
}: {
	groupId: string;
	groupName: string;
}) {
	useEffect(() => {
		// グループページを閲覧した時にlocal storageに情報を保存
		addRecentGroup(groupId, groupName);
	}, [groupId, groupName]);

	// このコンポーネントは見た目に影響しない
	return null;
}
