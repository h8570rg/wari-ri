import {
	ActionIcon,
	Avatar,
	Card,
	Flex,
	Group,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconEdit, IconUsers } from "@tabler/icons-react";
import type { Route } from "next";
import Link from "next/link";
import type { GroupDocument } from "@/lib/data/group";

export async function GroupInfo({ group }: { group: GroupDocument }) {
	return (
		<Card shadow="sm" padding="lg" radius="md" withBorder>
			<Stack gap="md">
				<Group justify="center" gap="md">
					<Title order={1} size="h2">
						{group.name}
					</Title>
					<ActionIcon
						component={Link}
						href={`/groups/${group.id}/edit` as Route}
						variant="subtle"
						size="lg"
						color="gray"
					>
						<IconEdit size={20} />
					</ActionIcon>
				</Group>
				<Group gap="xs" justify="center">
					<IconUsers size={20} color="var(--mantine-color-dimmed)" />
					<Text size="sm" c="dimmed">
						メンバー {group.users.length}人
					</Text>
				</Group>
				<Flex gap="sm" wrap="wrap" justify="center">
					{group.users.map((user) => (
						<Group key={user.id} gap="xs">
							<Avatar size="sm" color="blue" radius="xl">
								{user.name.charAt(0)}
							</Avatar>
							<Text size="sm">{user.name}</Text>
						</Group>
					))}
				</Flex>
			</Stack>
		</Card>
	);
}
