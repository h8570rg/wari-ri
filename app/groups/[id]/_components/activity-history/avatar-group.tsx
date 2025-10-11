"use client";

import { Avatar } from "@mantine/core";

export function AvatarGroup({
	participants,
}: {
	participants: {
		id: string;
		name: string;
	}[];
}) {
	return (
		<Avatar.Group spacing="xs">
			{participants.map((participant) => (
				<Avatar
					key={participant.id}
					size="sm"
					name={participant.name.slice(0, 1)}
					color="initials"
				/>
			))}
		</Avatar.Group>
	);
}
