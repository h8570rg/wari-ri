import { ActionIcon, Group, Space, Title } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import NextLink from "next/link";
import type { ComponentProps } from "react";

export function PageHeader({
	title,
	backLinkHref,
}: {
	title: string;
	backLinkHref: ComponentProps<typeof NextLink>["href"];
}) {
	return (
		<Group justify="space-between" mb="lg">
			<ActionIcon
				component={NextLink}
				href={backLinkHref}
				size="lg"
				color="secondary"
			>
				<IconChevronLeft />
			</ActionIcon>
			<Title order={1} size="lg">
				{title}
			</Title>
			<Space w="32" />
		</Group>
	);
}
