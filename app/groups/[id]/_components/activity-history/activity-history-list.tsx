"use client";

import { ActionIcon, Button, Divider, Flex, Stack, Text } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import type { Route } from "next";
import NextLink from "next/link";
import { Fragment, useState } from "react";
import type { ActivityDocument } from "@/lib/data/activity";
import type { GroupDocument } from "@/lib/data/group";
import { getAllActivities } from "./actions";
import { AvatarGroup } from "./avatar-group";
import { SettlementDeleteButton } from "./settlement-delete-button";

type Props = {
	initialActivities: ActivityDocument[];
	totalCount: number;
	group: GroupDocument;
};

export function ActivityHistoryList({
	initialActivities,
	totalCount,
	group,
}: Props) {
	const [activities, setActivities] =
		useState<ActivityDocument[]>(initialActivities);
	const [loading, setLoading] = useState(false);

	const hasMore = totalCount > activities.length;
	const remainingCount = totalCount - activities.length;

	const handleLoadMore = async () => {
		setLoading(true);
		try {
			const allActivities = await getAllActivities(group.id);
			setActivities(allActivities);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Stack gap="md">
			{activities.map((activity) => (
				<Fragment key={activity.id}>
					<ActivityHistoryItem activity={activity} group={group} />
					<Divider />
				</Fragment>
			))}
			{hasMore && (
				<Button
					size="md"
					mx="auto"
					variant="light"
					color="secondary"
					onClick={handleLoadMore}
					loading={loading}
					disabled={loading}
				>
					更に{remainingCount}件を表示する
				</Button>
			)}
		</Stack>
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
