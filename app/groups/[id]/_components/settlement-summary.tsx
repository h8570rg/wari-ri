"use client";

import { useRealtimeGroup } from "@/lib/hooks/use-realtime-group";
import { useRealtimeSettlements } from "@/lib/hooks/use-realtime-settlements";
import {
  Card,
  Stack,
  Title,
  Text,
  Group,
  Badge,
  Button,
  Alert,
  Loader,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { createSettlement } from "./settlement-summary/actions";

type Props = {
  groupId: string;
};

type Settlement = {
  from: string;
  fromUserId: string;
  to: string;
  toUserId: string;
  amount: number;
};

type UserBalance = {
  userId: string;
  userName: string;
  paid: number;
  owes: number;
  balance: number;
};

// ヘルパー関数
const getBalanceColor = (balance: number) => {
  if (balance > 0) return "green";
  if (balance < 0) return "red";
  return "gray";
};

export function SettlementSummary({ groupId }: Props) {
  const {
    group,
    loading: groupLoading,
    error: groupError,
  } = useRealtimeGroup(groupId);
  const {
    settlements: completedSettlements,
    loading: settlementsLoading,
    error: settlementsError,
  } = useRealtimeSettlements(groupId);

  // ローディング状態
  if (groupLoading || settlementsLoading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md" align="center">
          <Loader size="sm" />
          <Text size="sm" c="dimmed">
            精算サマリーを読み込み中...
          </Text>
        </Stack>
      </Card>
    );
  }

  // エラー状態
  if (groupError || settlementsError || !group) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={2} size="h3">
            精算サマリー
          </Title>
          <Alert
            icon={<IconInfoCircle size="1rem" />}
            title="エラー"
            color="red"
          >
            <Text size="sm">データの読み込みに失敗しました。</Text>
          </Alert>
        </Stack>
      </Card>
    );
  }

  const aggregation = group.aggregation;

  // 集計データが存在しない場合は、データがないことを示す
  if (!aggregation) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Title order={2} size="h3">
            精算サマリー
          </Title>
          <Alert
            icon={<IconInfoCircle size="1rem" />}
            title="データがありません"
            color="gray"
          >
            <Text size="sm">
              まだ建て替え記録がありません。建て替え記録を追加すると、自動的に精算サマリーが生成されます。
            </Text>
          </Alert>
        </Stack>
      </Card>
    );
  }

  if (aggregation.totalExpenses === 0) {
    return null;
  }

  // 集計データからユーザーバランスを構築
  const userBalances: UserBalance[] = group.users.map((user) => ({
    userId: user.id,
    userName: user.name,
    paid: aggregation.userBalances[user.id]?.paid || 0,
    owes: aggregation.userBalances[user.id]?.owes || 0,
    balance: aggregation.userBalances[user.id]?.balance || 0,
  }));

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
          fromUserId: debtor.userId,
          to: creditor.userName,
          toUserId: creditor.userId,
          amount: Math.round(settlementAmount),
        });

        debtAmount -= settlementAmount;
        creditor.balance -= settlementAmount;
      }
    }

    return settlements;
  };

  const settlements = calculateSettlements();

  // 精算履歴から完了済み精算額を計算する関数
  const getCompletedAmount = (settlement: Settlement): number => {
    return completedSettlements
      .filter(
        (completed) =>
          completed.fromUserId === settlement.fromUserId &&
          completed.toUserId === settlement.toUserId,
      )
      .reduce((sum, completed) => sum + completed.amount, 0);
  };

  // 残りの精算必要額を計算する関数
  const getRemainingAmount = (settlement: Settlement): number => {
    const completed = getCompletedAmount(settlement);
    return Math.max(0, settlement.amount - completed);
  };

  const hasUncompletedSettlements = settlements.some(
    (settlement) => getRemainingAmount(settlement) > 0,
  );

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={2} size="h3">
            精算サマリー
          </Title>
          <Badge color="gray" size="sm">
            最終更新: {aggregation.lastCalculatedAt.toLocaleDateString("ja-JP")}
          </Badge>
        </Group>

        {/* 総支出額の表示 */}
        <Group justify="space-between">
          <Text fw={500}>総支出額</Text>
          <Text fw={700} c="blue" size="lg">
            ¥{aggregation.totalExpenses.toLocaleString()}
          </Text>
        </Group>

        {/* ユーザー別収支 */}
        <Stack gap="xs">
          <Text fw={500} size="sm">
            メンバー別収支
          </Text>
          {userBalances.map((user) => (
            <Group key={user.userId} justify="space-between">
              <Text size="sm">{user.userName}</Text>
              <Group gap="xs">
                <Text size="xs" c="dimmed">
                  支払い: ¥{user.paid.toLocaleString()}
                </Text>
                <Text size="xs" c="dimmed">
                  負担: ¥{Math.round(user.owes).toLocaleString()}
                </Text>
                <Badge color={getBalanceColor(user.balance)} size="sm">
                  {user.balance > 0 ? "+" : ""}¥
                  {Math.round(user.balance).toLocaleString()}
                </Badge>
              </Group>
            </Group>
          ))}
        </Stack>

        {/* 精算が必要な場合 */}
        {hasUncompletedSettlements && (
          <Stack gap="xs">
            <Text fw={500} size="sm">
              必要な精算
            </Text>
            {settlements
              .filter((settlement) => getRemainingAmount(settlement) > 0)
              .map((settlement) => {
                const remainingAmount = getRemainingAmount(settlement);
                return (
                  <Group
                    key={`${settlement.fromUserId}-${settlement.toUserId}`}
                    justify="space-between"
                  >
                    <Text size="sm">
                      {settlement.from} → {settlement.to}
                    </Text>
                    <Group gap="xs">
                      <Text fw={500}>¥{remainingAmount.toLocaleString()}</Text>
                      <form
                        action={createSettlement.bind(null, {
                          groupId,
                          fromUserId: settlement.fromUserId,
                          toUserId: settlement.toUserId,
                          amount: remainingAmount,
                        })}
                      >
                        <Button size="xs" type="submit">
                          精算完了
                        </Button>
                      </form>
                    </Group>
                  </Group>
                );
              })}
          </Stack>
        )}

        {/* 精算完了の場合 */}
        {!hasUncompletedSettlements && (
          <Alert color="green" title="精算完了">
            <Text size="sm">すべての精算が完了しています！</Text>
          </Alert>
        )}
      </Stack>
    </Card>
  );
}
