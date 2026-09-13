"use client";

import { Alert, Box, Divider, Group, Stack, Text, Title } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Fragment, useEffect, useState } from "react";
import { type GroupDocument, subscribeGroup } from "@/lib/data/group";
import { SettlementButton } from "./settlement-button";

export function SettlementSummary({
	groupId,
	initialGroup,
}: {
	groupId: string;
	initialGroup: GroupDocument;
}) {
	const [group, setGroup] = useState(initialGroup);

	useEffect(() => {
		return subscribeGroup(groupId, setGroup);
	}, [groupId]);

	if (!group.aggregation) {
		return null;
	}

	const remainingSettlements = group.aggregation.remainingSettlements || [];
	const users = group.users;

	const settlements = remainingSettlements.map((settlement) => {
		const fromUser = users.find((user) => user.id === settlement.fromUserId);
		const toUser = users.find((user) => user.id === settlement.toUserId);
		return {
			from: fromUser?.name || "不明",
			fromUserId: settlement.fromUserId,
			to: toUser?.name || "不明",
			toUserId: settlement.toUserId,
			amount: settlement.amount,
		};
	});

	const hasUncompletedSettlements = settlements.length > 0;

	return (
		<Box component="section">
			<Title order={2} size="sm" mb="md" fw="normal">
				精算方法
			</Title>
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

			{!hasUncompletedSettlements && (
				<Alert color="green" icon={<IconCheck size="1rem" />}>
					すべての精算が完了しています
				</Alert>
			)}
		</Box>
	);
}
