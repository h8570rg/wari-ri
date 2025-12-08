"use client";

import {
	ActionIcon,
	Center,
	Group,
	Space,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import NextLink from "next/link";
import type { ComponentProps } from "react";

export function PageHeader({
	title,
	backLinkHref,
	showNavbar = true,
}: {
	title?: string;
	backLinkHref?: ComponentProps<typeof NextLink>["href"];
	showNavbar?: boolean;
}) {
	return (
		<Stack mb="lg">
			<Center>
				<Text component={NextLink} href="/" fw="900" c="primary">
					ワリーリ
				</Text>
			</Center>
			{showNavbar && (
				<Group justify="space-between">
					{backLinkHref && (
						<ActionIcon
							component={NextLink}
							href={backLinkHref}
							size="lg"
							color="secondary"
						>
							<IconChevronLeft />
						</ActionIcon>
					)}
					{title && (
						<Title order={1} size="lg">
							{title}
						</Title>
					)}
					<Space w="32" />
				</Group>
			)}
		</Stack>
	);
}
