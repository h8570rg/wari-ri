import {
	ActionIcon,
	Box,
	Divider,
	Flex,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import type { Route } from "next";
import NextLink from "next/link";
import { Fragment } from "react";
import { type ActivityDocument, getActivities } from "@/lib/data/activity";
import { type GroupDocument, getGroup } from "@/lib/data/group";
import { AvatarGroup } from "./avatar-group";
import { SettlementDeleteButton } from "./settlement-delete-button";

type Props = {
	groupId: string;
};

export async function ActivityHistory({ groupId }: Props) {
	const [activities, group] = await Promise.all([
		getActivities(groupId),
		getGroup(groupId),
	]);

	return (
		<Box component="section">
			<Title order={2} size="sm" mb="md" fw="normal">
				履歴
			</Title>
			<Stack gap="md">
				{activities.map((activity) => (
					<Fragment key={activity.id}>
						<ActivityHistoryItem activity={activity} group={group} />
						<Divider />
					</Fragment>
				))}
			</Stack>
		</Box>
	);
}

function ActivityHistoryItem({
	activity,
	group,
}: {
	activity: ActivityDocument;
	group: GroupDocument;
}) {
	function getUserName(userId: string) {
		return group.users.find((user) => user.id === userId)?.name || "不明";
	}

	const isCurrentYear =
		new Date(activity.createdAt).getFullYear() === new Date().getFullYear();

	return (
		<Flex justify="space-between">
			<Stack gap="4" w="100%">
				<Text size="xs" c="dimmed">
					{Intl.DateTimeFormat("ja-JP", {
						year: isCurrentYear ? undefined : "numeric",
						month: "numeric",
						day: "numeric",
					}).format(activity.createdAt)}
				</Text>
				<Flex align="center" justify="space-between" gap="sm">
					<Flex align="center" gap="4">
						<Text fw="500" size="lg">
							{activity.type === "expense" ? activity.description : "精算"}
						</Text>
						{activity.type === "expense" && (
							<ActionIcon
								component={NextLink}
								href={
									`/groups/${group.id}/expenses/${activity.id}/edit` as Route
								}
								variant="subtle"
								color="secondary"
								size="xs"
							>
								<IconPencil />
							</ActionIcon>
						)}
						{activity.type === "settlement" && (
							<SettlementDeleteButton
								groupId={group.id}
								settlementId={activity.id}
							/>
						)}
					</Flex>
					<Text fw="500">¥{activity.amount.toLocaleString()}</Text>
				</Flex>
				{activity.type === "expense" && (
					<Flex align="center" gap="1">
						<AvatarGroup
							participants={[
								{
									id: activity.payerId,
									name: getUserName(activity.payerId),
								},
							]}
						/>
						<Text size="sm" c="dimmed">
							が
						</Text>
						<AvatarGroup
							participants={activity.participantIds.map((id) => ({
								id,
								name: getUserName(id),
							}))}
						/>
						<Text size="sm" c="dimmed">
							の分を建て替え
						</Text>
					</Flex>
				)}
				{activity.type === "settlement" && (
					<Flex align="center" gap="1">
						<AvatarGroup
							participants={[
								{
									id: activity.fromUserId,
									name: getUserName(activity.fromUserId),
								},
							]}
						/>
						<Text size="sm" c="dimmed">
							が
						</Text>
						<AvatarGroup
							participants={[
								{
									id: activity.toUserId,
									name: getUserName(activity.toUserId),
								},
							]}
						/>
						<Text size="sm" c="dimmed">
							に支払い
						</Text>
					</Flex>
				)}
			</Stack>
		</Flex>
	);
}
