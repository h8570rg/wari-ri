"use client";

import {
	Alert,
	Box,
	Button,
	Card,
	Group,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconCheck, IconInfoCircle } from "@tabler/icons-react";
import type { GroupDocument } from "@/lib/data/group";
import { useRealtimeGroup } from "@/lib/hooks/use-realtime-group";
import { createSettlement } from "./settlement-summary/actions";

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
		<Box component="section">
			<Title order={2} size="sm" mb="md">
				精算方法
			</Title>
			<Stack gap="md">
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
					<Alert color="green" icon={<IconCheck size="1rem" />}>
						すべての精算が完了しています
					</Alert>
				)}
			</Stack>
		</Box>
	);
}
