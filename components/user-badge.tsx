"use client";

import { Badge } from "@mantine/core";

export function UserBadge({ name, color }: { name: string; color: string }) {
	return (
		<Badge variant="outline" color={color} tt="none" size="sm">
			{name}
		</Badge>
	);
}
