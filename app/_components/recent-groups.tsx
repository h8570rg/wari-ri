"use client";

import { useEffect, useState } from "react";
import {
  getRecentGroups,
  updateRecentGroup,
  removeRecentGroup,
  type RecentGroup,
} from "@/lib/local-storage";
import { getGroup } from "@/lib/data";
import { Button, Text, Stack, Paper, Group } from "@mantine/core";
import { IconUsers, IconClock } from "@tabler/icons-react";
import NextLink from "next/link";

export function RecentGroups() {
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
          const firestoreGroup = await getGroup(storedGroup.id);

          // グループ名に差異がある場合、local storageを更新
          if (firestoreGroup.name !== storedGroup.name) {
            updateRecentGroup(storedGroup.id, firestoreGroup.name);
            return {
              ...storedGroup,
              name: firestoreGroup.name,
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
    <Paper withBorder w="100%" maw={400}>
      <Stack gap="md">
        <Group gap="xs">
          <IconClock size={16} color="var(--mantine-color-green-6)" />
          <Text size="sm" fw={600} c="green.7">
            最近閲覧したグループ
          </Text>
        </Group>

        <Stack gap="xs">
          {recentGroups.map((group) => (
            <Button
              key={group.id}
              component={NextLink}
              href={`/groups/${group.id}`}
              variant="subtle"
              color="green"
              leftSection={<IconUsers size={16} />}
              justify="start"
              size="sm"
              styles={{
                root: {
                  height: "auto",
                  padding: "8px 12px",
                },
                inner: {
                  justifyContent: "flex-start",
                },
              }}
            >
              <Text size="sm" fw={500}>
                {group.name}
              </Text>
            </Button>
          ))}
        </Stack>
      </Stack>
    </Paper>
  );
}
