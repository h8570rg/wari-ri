"use client";

import { useRealtimeGroup } from "@/lib/hooks/use-realtime-group";
import {
  Card,
  Stack,
  Title,
  Text,
  Group,
  Badge,
  Button,
  Alert,
} from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import { createSettlement } from "./settlement-summary/actions";
import { GroupDocument } from "@/lib/data/group";

type Props = {
  groupId: string;
  initialGroup: GroupDocument;
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

export function SettlementSummary({ groupId, initialGroup }: Props) {
  const { group } = useRealtimeGroup(groupId, initialGroup);

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
  const userBalances: UserBalance[] = group.users.map(
    (user: { id: string; name: string }) => ({
      userId: user.id,
      userName: user.name,
      paid: aggregation.userBalances?.[user.id]?.paid || 0,
      owes: aggregation.userBalances?.[user.id]?.owes || 0,
      balance: aggregation.userBalances?.[user.id]?.balance || 0,
    }),
  );

  // aggregationから残りの精算必要額を取得
  const remainingSettlements = aggregation.remainingSettlements || [];

  // ユーザー名を含む精算情報を構築
  const settlements = remainingSettlements.map(
    (settlement: { fromUserId: string; toUserId: string; amount: number }) => {
      const fromUser = group.users.find(
        (user: { id: string; name: string }) =>
          user.id === settlement.fromUserId,
      );
      const toUser = group.users.find(
        (user: { id: string; name: string }) => user.id === settlement.toUserId,
      );
      return {
        from: fromUser?.name || "不明",
        fromUserId: settlement.fromUserId,
        to: toUser?.name || "不明",
        toUserId: settlement.toUserId,
        amount: settlement.amount,
      };
    },
  );

  const hasUncompletedSettlements = settlements.length > 0;

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="md">
        <Group justify="space-between">
          <Title order={2} size="h3">
            精算サマリー
          </Title>
          <Badge color="gray" size="sm">
            最終更新:{" "}
            {aggregation.lastCalculatedAt?.toLocaleDateString("ja-JP") ||
              "不明"}
          </Badge>
        </Group>

        {/* 総支出額の表示 */}
        <Group justify="space-between">
          <Text fw={500}>総支出額</Text>
          <Text fw={700} c="blue" size="lg">
            ¥{aggregation.totalExpenses?.toLocaleString() || "不明"}
          </Text>
        </Group>

        {/* ユーザー別収支 */}
        <Stack gap="xs">
          <Text fw={500} size="sm">
            メンバー別収支
          </Text>
          {userBalances.map((user: UserBalance) => (
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
            {settlements.map((settlement: Settlement) => (
              <Group
                key={`${settlement.fromUserId}-${settlement.toUserId}`}
                justify="space-between"
              >
                <Text size="sm">
                  {settlement.from} → {settlement.to}
                </Text>
                <Group gap="xs">
                  <Text fw={500}>¥{settlement.amount.toLocaleString()}</Text>
                  <form
                    action={createSettlement.bind(null, {
                      groupId,
                      fromUserId: settlement.fromUserId,
                      toUserId: settlement.toUserId,
                      amount: settlement.amount,
                    })}
                  >
                    <Button size="xs" type="submit">
                      精算完了
                    </Button>
                  </form>
                </Group>
              </Group>
            ))}
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
