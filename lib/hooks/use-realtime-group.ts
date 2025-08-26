"use client";

import { useEffect, useState } from "react";
import { type GroupDocument, subscribeToGroup } from "../data/group";

export function useRealtimeGroup(groupId: string, initialGroup: GroupDocument) {
	const [group, setGroup] = useState<GroupDocument>(initialGroup);

	useEffect(() => {
		const unsubscribe = subscribeToGroup(groupId, (data) => {
			setGroup(data);
		});
		return unsubscribe;
	}, [groupId]);

	return { group };
}
