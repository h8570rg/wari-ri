"use client";

import { Alert, Box, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import {
	ACTIVITY_LIVE_LIMIT,
	type ActivityDocument,
	subscribeActivities,
} from "@/lib/data/activity";
import type { GroupDocument } from "@/lib/data/group";
import { ActivityHistoryList } from "./activity-history-list";

type Props = {
	groupId: string;
	initialActivities: ActivityDocument[];
	initialActivitiesCount: number;
	group: GroupDocument;
};

export function ActivityHistory({
	groupId,
	initialActivities,
	initialActivitiesCount,
	group,
}: Props) {
	const [activities, setActivities] = useState(initialActivities);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		return subscribeActivities(
			groupId,
			setActivities,
			expanded ? undefined : ACTIVITY_LIVE_LIMIT,
		);
	}, [groupId, expanded]);

	if (activities.length === 0) {
		return (
			<Alert
				title="「建て替え記録を追加」ボタンから、建て替え記録を追加しましょう"
				icon={<IconInfoCircle size="1rem" />}
			/>
		);
	}

	return (
		<Box component="section">
			<Title order={2} size="sm" mb="md" fw="normal">
				履歴
			</Title>
			<ActivityHistoryList
				activities={activities}
				totalCount={initialActivitiesCount}
				expanded={expanded}
				onLoadMore={() => setExpanded(true)}
				group={group}
			/>
		</Box>
	);
}
