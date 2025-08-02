import { getExpensesByGroup, getGroup } from "@/lib/data";
import {
  Avatar,
  Card,
  Group,
  Stack,
  Text,
  Title,
  Alert,
  Divider,
  Badge,
} from "@mantine/core";
import { IconInfoCircle, IconArrowRight } from "@tabler/icons-react";

type Props = {
  groupId: string;
};

type UserBalance = {
  userId: string;
  userName: string;
  paid: number;
  owes: number;
  balance: number;
};

type Settlement = {
  from: string;
  to: string;
  amount: number;
};

export async function SettlementSummary({ groupId }: Props) {
  const [expenses, group] = await Promise.all([
    getExpensesByGroup(groupId),
    getGroup(groupId),
  ]);

  if (expenses.length === 0) {
    return null;
  }

  // 各ユーザーの収支を計算
  const userBalances: UserBalance[] = group.users.map((user) => {
    // このユーザーが支払った総額
    const paid = expenses
      .filter((expense) => expense.payerId === user.id)
      .reduce((sum, expense) => sum + expense.amount, 0);

    // このユーザーが負担すべき総額
    const owes = expenses
      .filter((expense) => expense.participantIds.includes(user.id))
      .reduce(
        (sum, expense) => sum + expense.amount / expense.participantIds.length,
        0,
      );

    const balance = paid - owes;

    return {
      userId: user.id,
      userName: user.name,
      paid,
      owes,
      balance,
    };
  });

  // 精算計算（債権者と債務者をマッチング）
  const calculateSettlements = (): Settlement[] => {
    const settlements: Settlement[] = [];
    const creditors = userBalances
      .filter((user) => user.balance > 0.01)
      .sort((a, b) => b.balance - a.balance);
    const debtors = userBalances
      .filter((user) => user.balance < -0.01)
      .sort((a, b) => a.balance - b.balance);

    // 債権者と債務者のコピーを作成（計算で値を変更するため）
    const remainingCreditors = creditors.map((c) => ({ ...c }));
    const remainingDebtors = debtors.map((d) => ({ ...d }));

    for (const debtor of remainingDebtors) {
      let debtAmount = Math.abs(debtor.balance);

      for (const creditor of remainingCreditors) {
        if (debtAmount <= 0.01 || creditor.balance <= 0.01) continue;

        const settlementAmount = Math.min(debtAmount, creditor.balance);

        settlements.push({
          from: debtor.userName,
          to: creditor.userName,
          amount: Math.round(settlementAmount),
        });

        debtAmount -= settlementAmount;
        creditor.balance -= settlementAmount;
      }
    }

    return settlements;
  };

  const settlements = calculateSettlements();
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Title order={2} size="h3">
          精算サマリー
        </Title>

        <Alert
          icon={<IconInfoCircle size={16} />}
          title="合計金額"
          color="blue"
        >
          <Text size="lg" fw={700}>
            ¥{totalExpenses.toLocaleString()}
          </Text>
        </Alert>

        <Divider label="各メンバーの収支" labelPosition="center" />

        <Stack gap="sm">
          {userBalances.map((user) => {
            let balanceColor = "gray";
            if (user.balance > 0.01) {
              balanceColor = "green";
            } else if (user.balance < -0.01) {
              balanceColor = "red";
            }

            const balanceText = `${user.balance > 0.01 ? "+" : ""}¥${Math.round(user.balance).toLocaleString()}`;

            return (
              <Card key={user.userId} padding="sm" radius="sm" withBorder>
                <Group justify="space-between">
                  <Group gap="xs">
                    <Avatar size="sm" color="blue" radius="xl">
                      {user.userName.charAt(0)}
                    </Avatar>
                    <Text fw={500}>{user.userName}</Text>
                  </Group>
                  <Group gap="md">
                    <Text size="sm" c="dimmed">
                      支払: ¥{Math.round(user.paid).toLocaleString()}
                    </Text>
                    <Text size="sm" c="dimmed">
                      負担: ¥{Math.round(user.owes).toLocaleString()}
                    </Text>
                    <Badge color={balanceColor} variant="light">
                      {balanceText}
                    </Badge>
                  </Group>
                </Group>
              </Card>
            );
          })}
        </Stack>

        {settlements.length > 0 && (
          <>
            <Divider label="必要な精算" labelPosition="center" />
            <Stack gap="sm">
              {settlements.map((settlement) => (
                <Card
                  key={`${settlement.from}-${settlement.to}-${settlement.amount}`}
                  padding="sm"
                  radius="sm"
                  withBorder
                  bg="yellow.0"
                >
                  <Group justify="space-between" align="center">
                    <Group gap="xs">
                      <Avatar size="sm" color="orange" radius="xl">
                        {settlement.from.charAt(0)}
                      </Avatar>
                      <Text fw={500}>{settlement.from}</Text>
                      <IconArrowRight
                        size={16}
                        color="var(--mantine-color-dimmed)"
                      />
                      <Avatar size="sm" color="green" radius="xl">
                        {settlement.to.charAt(0)}
                      </Avatar>
                      <Text fw={500}>{settlement.to}</Text>
                    </Group>
                    <Text fw={700} c="orange" size="lg">
                      ¥{settlement.amount.toLocaleString()}
                    </Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          </>
        )}

        {settlements.length === 0 && (
          <Alert color="green" title="精算完了">
            すべてのメンバーの収支が均等です！
          </Alert>
        )}
      </Stack>
    </Card>
  );
}
