"use client";

import { Button, Center, CopyButton, Stack, Text, Title } from "@mantine/core";
import { IconCircleCheckFilled, IconCopy } from "@tabler/icons-react";
import type { Route } from "next";
import { NextLink } from "@/components/next-link";

export function ShareContent({
	groupId,
	shareUrl,
}: {
	groupId: string;
	shareUrl: string;
}) {
	return (
		<>
			<Center c="primary" py="xl">
				<IconCircleCheckFilled size="4rem" />
			</Center>
			<Title order={2} size="h3" mb="sm" ta="center">
				グループが作成されました！
			</Title>
			<Text size="sm" ta="center" mb="xl">
				メンバーにグループのURLを共有しましょう
			</Text>
			<Stack gap="lg">
				<CopyButton value={shareUrl}>
					{({ copied, copy }) => (
						<Button
							leftSection={<IconCopy size="20" />}
							onClick={copy}
							fullWidth
							color={copied ? "teal" : undefined}
						>
							{copied ? "コピーしました！" : "URLをコピー"}
						</Button>
					)}
				</CopyButton>
				<Button
					component={NextLink}
					href={`/groups/${groupId}` as Route}
					size="lg"
					fullWidth
					variant="outline"
				>
					グループページへ進む
				</Button>
			</Stack>
		</>
	);
}
