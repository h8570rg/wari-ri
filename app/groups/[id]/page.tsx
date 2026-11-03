import { Button, Container, Group, Stack } from "@mantine/core";
import type { Route } from "next";
import { NextLink } from "@/components/next-link";
import { PageHeader } from "@/components/page-header";
import {
	ACTIVITY_LIVE_LIMIT,
	getActivities,
	getActivitiesCount,
} from "@/lib/data/activity";
import { getGroup } from "@/lib/data/group";
import { ActivityHistory } from "./_components/activity-history";
import { GroupInfo } from "./_components/group-info";
import { RecentGroupTracker } from "./_components/recent-group-tracker";
import { SettlementSummary } from "./_components/settlement-summary";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function GroupPage({ params }: Props) {
	const { id } = await params;
	const [group, activities, activitiesCount] = await Promise.all([
		getGroup(id),
		getActivities(id, ACTIVITY_LIVE_LIMIT),
		getActivitiesCount(id),
	]);

	return (
		<Container>
			<PageHeader title="グループ詳細" backLinkHref="/" showNavbar={false} />
			<RecentGroupTracker groupId={id} groupName={group.name} />
			<GroupInfo group={group} />
			<Group mt="lg" gap="xs">
				<Button
					flex={1}
					component={NextLink}
					href={`/groups/${id}/expenses/new` as Route}
					size="lg"
					pl="lg"
					pr="lg"
				>
					建て替え記録
				</Button>
				<Button
					flex={1}
					component={NextLink}
					href={`/groups/${id}/results/new` as Route}
					color="blue"
					pl="lg"
					pr="lg"
				>
					勝ち負け記録
				</Button>
			</Group>
			<Stack gap="60px" mt="xl">
				<ActivityHistory
					groupId={id}
					initialActivities={activities}
					initialActivitiesCount={activitiesCount}
					group={group}
				/>
				<SettlementSummary groupId={id} initialGroup={group} />
			</Stack>
		</Container>
	);
}
