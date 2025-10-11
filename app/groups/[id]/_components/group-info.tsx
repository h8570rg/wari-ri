import {
	ActionIcon,
	Badge,
	Box,
	Flex,
	Group,
	Text,
	Title,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import type { Route } from "next";
import NextLink from "next/link";
import type { GroupDocument } from "@/lib/data/group";

export async function GroupInfo({ group }: { group: GroupDocument }) {
	return (
		<Box>
			<Flex align="center" gap="xs">
				<Title order={2} size="h2">
					{group.name}
				</Title>
				<ActionIcon
					component={NextLink}
					href={`/groups/${group.id}/edit` as Route}
					variant="subtle"
					color="secondary"
					size="sm"
				>
					<IconPencil />
				</ActionIcon>
			</Flex>
			<Group mt="xs" gap="6">
				{group.users.map((user) => (
					<Badge variant="light" color="secondary" key={user.id}>
						{user.name}
					</Badge>
				))}
			</Group>
			{group.aggregation?.totalExpenses && (
				<Text mt="sm" size="xs" c="dimmed">
					総支出額: ¥{group.aggregation?.totalExpenses?.toLocaleString()}
				</Text>
			)}
		</Box>
	);
}
