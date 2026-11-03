"use client";

import { Badge } from "@mantine/core";

export function UserBadge({ name, color }: { name: string; color: string }) {
	return (
		<Badge variant="light" color={color} tt="none" size="sm">
			{name}
		</Badge>
	);
}
