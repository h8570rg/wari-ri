"use client";

import { ActionIcon, Button, Group, Modal, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import { deleteSettlement } from "./actions";

export function SettlementDeleteButton({
	groupId,
	settlementId,
}: {
	groupId: string;
	settlementId: string;
}) {
	const [opened, { open, close }] = useDisclosure(false);
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		setIsDeleting(true);
		await deleteSettlement({ groupId, settlementId });
	}

	return (
		<>
			<ActionIcon variant="subtle" color="secondary" size="xs" onClick={open}>
				<IconTrash />
			</ActionIcon>
			<Modal
				opened={opened}
				onClose={close}
				title="建て替え記録を削除"
				centered
			>
				<Text size="sm">
					この建て替え記録を削除しますか？
					<br />
					この操作は取り消せません。
				</Text>
				<Group gap="md" mt="xl" justify="flex-end">
					<Button
						size="md"
						color="red"
						onClick={handleDelete}
						loading={isDeleting}
					>
						削除する
					</Button>
				</Group>
			</Modal>
		</>
	);
}
