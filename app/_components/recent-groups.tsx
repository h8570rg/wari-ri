"use client";

import { Box, type BoxProps, Button, Stack, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import type { Route } from "next";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { getGroup } from "@/lib/data/group";
import {
	getRecentGroups,
	type RecentGroup,
	removeRecentGroup,
	updateRecentGroup,
} from "@/lib/local-storage";

export function RecentGroups(props: BoxProps) {
	const [recentGroups, setRecentGroups] = useState<RecentGroup[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// 即座にlocal storageから表示用データを読み込み
		const storedGroups = getRecentGroups();
		setRecentGroups(storedGroups);
		setIsLoading(false);

		// 裏側でFirestoreからデータを取得し、差異があればlocal storageを更新
		async function syncWithFirestore() {
			if (storedGroups.length === 0) {
				return;
			}

			const syncPromises = storedGroups.map(async (storedGroup) => {
				try {
					const group = await getGroup(storedGroup.id);

					// グループ名に差異がある場合、local storageを更新
					if (group.name !== storedGroup.name) {
						updateRecentGroup(storedGroup.id, group.name);
						return {
							...storedGroup,
							name: group.name,
						};
					}

					return storedGroup;
				} catch {
					// グループが存在しない場合、local storageから削除

					removeRecentGroup(storedGroup.id);
					return null;
				}
			});

			const syncedGroups = await Promise.all(syncPromises);
			const validGroups = syncedGroups.filter(
				(group): group is RecentGroup => group !== null,
			);

			// 同期後のデータで表示を更新
			if (
				validGroups.length !== storedGroups.length ||
				validGroups.some(
					(group, index) => group.name !== storedGroups[index]?.name,
				)
			) {
				setRecentGroups(validGroups);
			}
		}

		// 非同期で同期処理を実行（表示はブロックしない）
		syncWithFirestore();
	}, []);

	// サーバーサイドレンダリング時やグループが無い場合は何も表示しない
	if (isLoading || recentGroups.length === 0) {
		return null;
	}

	return (
		<Box {...props}>
			<Text size="sm" c="white" ta="center" mb="md">
				最近閲覧したグループ
			</Text>
			<Stack gap="xs" w="100%">
				{recentGroups.map((group) => (
					<Button
						key={group.id}
						component={NextLink}
						href={`/groups/${group.id}` as Route}
						variant="outline"
						color="white"
						rightSection={<IconChevronRight size={16} />}
						justify="space-between"
						size="sm"
						w="100%"
					>
						{group.name}
					</Button>
				))}
			</Stack>
		</Box>
	);
}
