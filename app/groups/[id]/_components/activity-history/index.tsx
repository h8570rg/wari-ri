import { Box, Title } from "@mantine/core";
import { getActivities, getActivitiesCount } from "@/lib/data/activity";
import { getGroup } from "@/lib/data/group";
import { ActivityHistoryList } from "./activity-history-list";

type Props = {
	groupId: string;
};

const INITIAL_LIMIT = 10;

export async function ActivityHistory({ groupId }: Props) {
	const [initialActivities, totalCount, group] = await Promise.all([
		getActivities(groupId, INITIAL_LIMIT),
		getActivitiesCount(groupId),
		getGroup(groupId),
	]);

	return (
		<Box component="section">
			<Title order={2} size="sm" mb="md" fw="normal">
				履歴
			</Title>
			<ActivityHistoryList
				initialActivities={initialActivities}
				totalCount={totalCount}
				group={group}
			/>
		</Box>
	);
}
