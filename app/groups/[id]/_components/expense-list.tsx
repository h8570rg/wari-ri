import { getExpensesByGroup, getGroup } from "@/lib/data";
import { Avatar, Card, Group, Stack, Text, Title } from "@mantine/core";

type Props = {
  groupId: string;
};

export async function ExpenseList({ groupId }: Props) {
  const [expenses, group] = await Promise.all([
    getExpensesByGroup(groupId),
    getGroup(groupId),
  ]);

  const getUserName = (userId: string) => {
    return group.users.find((user) => user.id === userId)?.name || "不明";
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={2} size="h3">
          建て替え記録
        </Title>

        {expenses.length === 0 ? (
          <Text c="dimmed" ta="center" py="xl">
            まだ建て替え記録がありません
          </Text>
        ) : (
          <Stack gap="sm">
            {expenses.map((expense) => (
              <Card key={expense.id} padding="md" radius="sm" withBorder>
                <Group justify="space-between" mb="xs">
                  <Text fw={500}>{expense.description}</Text>
                  <Text fw={700} c="blue">
                    ¥{expense.amount.toLocaleString()}
                  </Text>
                </Group>

                <Group gap="xs" mb="xs">
                  <Avatar size="sm" color="green" radius="xl">
                    {getUserName(expense.payerId).charAt(0)}
                  </Avatar>
                  <Text size="sm" c="dimmed">
                    {getUserName(expense.payerId)} が建て替え
                  </Text>
                </Group>

                <Group gap="xs">
                  <Text size="sm" c="dimmed">
                    参加者:
                  </Text>
                  <Group gap="xs">
                    {expense.participantIds.map((participantId) => (
                      <Text key={participantId} size="sm">
                        {getUserName(participantId)}
                      </Text>
                    ))}
                  </Group>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
