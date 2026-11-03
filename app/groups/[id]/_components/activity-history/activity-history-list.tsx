"use client";

import { ActionIcon, Button, Divider, Flex, Stack, Text } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import type { Route } from "next";
import { Fragment } from "react";
import { NextLink } from "@/components/next-link";
import { UserBadge } from "@/components/user-badge";
import type { ActivityDocument } from "@/lib/data/activity";
import type { GroupDocument } from "@/lib/data/group";
import { formatSignedAmount } from "@/lib/utils/amount";
import { getMemberColor } from "@/lib/utils/member-color";
import { SettlementDeleteButton } from "./settlement-delete-button";

type Props = {
	activities: ActivityDocument[];
	totalCount: number;
	expanded: boolean;
	onLoadMore: () => void;
	group: GroupDocument;
};

export function ActivityHistoryList({
	activities,
	totalCount,
	expanded,
	onLoadMore,
	group,
}: Props) {
	const remainingCount = totalCount - activities.length;
	const hasMore = !expanded && remainingCount > 0;

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
					onClick={onLoadMore}
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
	function getUser(userId: string) {
		const index = group.users.findIndex((user) => user.id === userId);
		if (index === -1) {
			return { name: "不明", color: "gray" };
		}
		return { name: group.users[index].name, color: getMemberColor(index) };
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
							{activity.type === "settlement" ? "精算" : activity.description}
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
						{activity.type === "result" && (
							<ActionIcon
								component={NextLink}
								href={
									`/groups/${group.id}/results/${activity.id}/edit` as Route
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
					{activity.type !== "result" && (
						<Text fw="500">¥{activity.amount.toLocaleString()}</Text>
					)}
				</Flex>
				{activity.type === "expense" && (
					<Flex align="center" gap="4" wrap="wrap">
						<UserBadge {...getUser(activity.payerId)} />
						<Text size="sm" c="dimmed">
							が
						</Text>
						{activity.participantIds.map((id) => (
							<UserBadge key={id} {...getUser(id)} />
						))}
						<Text size="sm" c="dimmed">
							の分を建て替え
						</Text>
					</Flex>
				)}
				{activity.type === "settlement" && (
					<Flex align="center" gap="4" wrap="wrap">
						<UserBadge {...getUser(activity.fromUserId)} />
						<Text size="sm" c="dimmed">
							が
						</Text>
						<UserBadge {...getUser(activity.toUserId)} />
						<Text size="sm" c="dimmed">
							に支払い
						</Text>
					</Flex>
				)}
				{activity.type === "result" && (
					<Flex align="center" columnGap="sm" rowGap="4" wrap="wrap">
						{activity.entries
							.toSorted((a, b) => b.amount - a.amount)
							.map((entry) => (
								<Flex key={entry.userId} align="center" gap="4">
									<UserBadge {...getUser(entry.userId)} />
									<Text size="sm" fw="500">
										{formatSignedAmount(entry.amount)}
									</Text>
								</Flex>
							))}
					</Flex>
				)}
			</Stack>
		</Flex>
	);
}
