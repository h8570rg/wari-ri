import { getActivityHistory, getGroup } from "@/lib/data";
import {
  Avatar,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  ActionIcon,
} from "@mantine/core";
import {
  IconArrowRight,
  IconEdit,
  IconReceipt,
  IconCoin,
} from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  groupId: string;
};

export async function ActivityHistory({ groupId }: Props) {
  const [activities, group] = await Promise.all([
    getActivityHistory(groupId),
    getGroup(groupId),
  ]);

  const getUserName = (userId: string) => {
    return group.users.find((user) => user.id === userId)?.name || "不明";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (activities.length === 0) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={2} size="h3">
            履歴
          </Title>
          <Text c="dimmed" ta="center" py="xl">
            まだ履歴がありません
          </Text>
        </Stack>
      </Card>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={2} size="h3">
          履歴
        </Title>

        <Stack gap="sm">
          {activities.map((activity) => (
            <Card key={activity.id} padding="md" radius="sm" withBorder>
              {activity.type === "expense" ? (
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconReceipt
                        size={20}
                        color="var(--mantine-color-blue-6)"
                      />
                      <Text fw={500}>建て替え記録</Text>
                      <Badge size="sm" color="blue">
                        支出
                      </Badge>
                    </Group>
                    <Group gap="xs">
                      <Text size="sm" c="dimmed">
                        {formatDate(activity.createdAt)}
                      </Text>
                      <ActionIcon
                        component={Link}
                        href={`/groups/${groupId}/expenses/${activity.id}/edit`}
                        variant="subtle"
                        size="sm"
                        color="gray"
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Group>
                  </Group>

                  <Group justify="space-between">
                    <Text fw={500} size="lg">
                      {activity.description}
                    </Text>
                    <Text fw={700} c="blue" size="lg">
                      ¥{activity.amount.toLocaleString()}
                    </Text>
                  </Group>

                  <Group gap="xs">
                    <Avatar size="sm" color="green" radius="xl">
                      {getUserName(activity.payerId).charAt(0)}
                    </Avatar>
                    <Text size="sm" c="dimmed">
                      {getUserName(activity.payerId)} が建て替え
                    </Text>
                  </Group>

                  <Group gap="xs">
                    <Text size="sm" c="dimmed">
                      参加者:
                    </Text>
                    <Group gap="xs">
                      {activity.participantIds.map((participantId) => (
                        <Text key={participantId} size="sm">
                          {getUserName(participantId)}
                        </Text>
                      ))}
                    </Group>
                  </Group>
                </Stack>
              ) : (
                <Stack gap="xs">
                  <Group justify="space-between">
                    <Group gap="xs">
                      <IconCoin
                        size={20}
                        color="var(--mantine-color-green-6)"
                      />
                      <Text fw={500}>精算記録</Text>
                      <Badge size="sm" color="green">
                        精算
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">
                      {formatDate(activity.createdAt)}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Group gap="xs">
                      <Avatar size="sm" color="orange" radius="xl">
                        {getUserName(activity.fromUserId).charAt(0)}
                      </Avatar>
                      <Text fw={500}>{getUserName(activity.fromUserId)}</Text>
                      <IconArrowRight
                        size={16}
                        color="var(--mantine-color-dimmed)"
                      />
                      <Avatar size="sm" color="green" radius="xl">
                        {getUserName(activity.toUserId).charAt(0)}
                      </Avatar>
                      <Text fw={500}>{getUserName(activity.toUserId)}</Text>
                    </Group>
                    <Text fw={700} c="green" size="lg">
                      ¥{activity.amount.toLocaleString()}
                    </Text>
                  </Group>
                </Stack>
              )}
            </Card>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
