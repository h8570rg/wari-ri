"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { createSettlement } from "./actions";

export function SettlementButton({
	groupId,
	fromUser,
	toUser,
	amount,
}: {
	groupId: string;
	fromUser: {
		id: string;
		name: string;
	};
	toUser: {
		id: string;
		name: string;
	};
	amount: number;
}) {
	const [opened, { open, close }] = useDisclosure(false);
	const [isSettling, setIsSettling] = useState(false);

	async function handleSettlement() {
		setIsSettling(true);
		await createSettlement({
			groupId,
			fromUserId: fromUser.id,
			toUserId: toUser.id,
			amount,
		});
		setIsSettling(false);
		close();
	}

	return (
		<>
			<Button size="xs" type="submit" onClick={open}>
				精算する
			</Button>
			<Modal opened={opened} onClose={close} title="精算" centered>
				<Stack gap="md">
					<Text size="sm" fw={500}>
						{fromUser.name}が{toUser.name}に{amount}円を支払いましたか？
					</Text>
				</Stack>
				<Group gap="md" mt="xl" justify="flex-end">
					<Button size="md" onClick={handleSettlement} loading={isSettling}>
						はい、記録する
					</Button>
				</Group>
			</Modal>
		</>
	);
}
