"use client";

import { useEffect, useState } from "react";
import { getRecentGroupIds, removeRecentGroupId } from "@/lib/local-storage";
import { getGroup } from "@/lib/data";
import type { GroupDocument } from "@/lib/data";
import { Button, Text, Stack, Paper, Group } from "@mantine/core";
import { IconUsers, IconClock } from "@tabler/icons-react";
import NextLink from "next/link";

export function RecentGroups() {
  const [recentGroups, setRecentGroups] = useState<GroupDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadRecentGroups() {
      // クライアントサイドでのみlocal storageから読み込む
      const groupIds = getRecentGroupIds();

      if (groupIds.length === 0) {
        setIsLoading(false);
        return;
      }

      // 各IDからグループ情報を取得
      const groupPromises = groupIds.map(async (id) => {
        try {
          return await getGroup(id);
        } catch {
          removeRecentGroupId(id);
          return null;
        }
      });

      const groups = await Promise.all(groupPromises);
      // nullを除去
      const validGroups = groups.filter(
        (group): group is GroupDocument => group !== null,
      );

      setRecentGroups(validGroups);
      setIsLoading(false);
    }

    loadRecentGroups();
  }, []);

  // サーバーサイドレンダリング時やロード中は何も表示しない
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
