import { Alert, Button, Container, Stack } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import type { Route } from "next";
import NextLink from "next/link";
import { PageHeader } from "@/components/page-header";
import { getActivities } from "@/lib/data/activity";
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
	const [group, activities] = await Promise.all([
		getGroup(id),
		getActivities(id),
	]);

	return (
		<Container>
			<PageHeader title="グループ詳細" backLinkHref="/" showNavbar={false} />
			<RecentGroupTracker groupId={id} groupName={group.name} />
			<GroupInfo group={group} />
			<Button
				component={NextLink}
				href={`/groups/${id}/expenses/new` as Route}
				size="lg"
				fullWidth
				mt="xl"
			>
				建て替えを追加
			</Button>
			<Stack gap="lg" mt="lg">
				{activities.length > 0 ? (
					<>
						<ActivityHistory groupId={id} />
						<SettlementSummary groupId={id} group={group} />
					</>
				) : (
					<Alert
						title="「建て替えを追加」ボタンから、建て替え記録を追加しましょう"
						icon={<IconInfoCircle size="1rem" />}
					/>
				)}
			</Stack>
		</Container>
	);
}
