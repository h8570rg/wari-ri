import { ActionIcon, Box, Flex, Group, Title } from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import type { Route } from "next";
import { NextLink } from "@/components/next-link";
import { UserBadge } from "@/components/user-badge";
import type { GroupDocument } from "@/lib/data/group";
import { getMemberColor } from "@/lib/utils/member-color";

export function GroupInfo({ group }: { group: GroupDocument }) {
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
				{group.users.map((user, index) => (
					<UserBadge
						key={user.id}
						name={user.name}
						color={getMemberColor(index)}
					/>
				))}
			</Group>
		</Box>
	);
}
