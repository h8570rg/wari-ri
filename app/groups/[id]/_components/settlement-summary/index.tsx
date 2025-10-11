"use client";

import { Alert, Box, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Fragment } from "react";
import type { Aggregation } from "@/lib/data/group";
import { SettlementButton } from "./settlement-button";

export function SettlementSummary({
	groupId,
	users,
	aggregation,
}: {
	groupId: string;
	users: { id: string; name: string }[];
	aggregation: Aggregation;
}) {
	// aggregationから残りの精算必要額を取得
	const remainingSettlements = aggregation.remainingSettlements || [];

	// ユーザー名を含む精算情報を構築
	const settlements = remainingSettlements.map(
		(settlement: { fromUserId: string; toUserId: string; amount: number }) => {
			const fromUser = users.find(
				(user: { id: string; name: string }) =>
					user.id === settlement.fromUserId,
			);
			const toUser = users.find(
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
			<Title order={2} size="sm" mb="md" fw="normal">
				精算方法
			</Title>
			{/* 精算が必要な場合 */}
			{hasUncompletedSettlements && (
				<Stack gap="xs">
					{settlements.map((settlement) => (
						<Fragment key={`${settlement.fromUserId}-${settlement.toUserId}`}>
							<Group
								key={`${settlement.fromUserId}-${settlement.toUserId}`}
								justify="space-between"
							>
								<Text size="sm">
									{settlement.from} → {settlement.to}
								</Text>
								<Group gap="xs">
									<Text fw={500}>¥{settlement.amount.toLocaleString()}</Text>
									<SettlementButton
										groupId={groupId}
										fromUser={{
											id: settlement.fromUserId,
											name: settlement.from,
										}}
										toUser={{
											id: settlement.toUserId,
											name: settlement.to,
										}}
										amount={settlement.amount}
									/>
								</Group>
							</Group>
							<Divider />
						</Fragment>
					))}
				</Stack>
			)}

			{/* 精算完了の場合 */}
			{!hasUncompletedSettlements && (
				<Alert color="green" icon={<IconCheck size="1rem" />}>
					すべての精算が完了しています
				</Alert>
			)}
		</Box>
	);
}
