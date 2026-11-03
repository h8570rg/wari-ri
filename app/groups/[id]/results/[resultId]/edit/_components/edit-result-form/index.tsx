"use client";

import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { ResultForm } from "@/app/groups/[id]/results/_components/result-form";
import type { GroupDocument } from "@/lib/data/group";
import type { ResultDocument } from "@/lib/data/result";
import { deleteResult, updateResult } from "./actions";

type Props = {
	group: GroupDocument;
	result: ResultDocument;
};

export function EditResultForm({ group, result }: Props) {
	const [
		deleteModalOpened,
		{ open: openDeleteModal, close: closeDeleteModal },
	] = useDisclosure(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = async () => {
		setIsDeleting(true);
		await deleteResult({
			groupId: group.id,
			resultId: result.id,
		});
	};

	return (
		<>
			<ResultForm
				group={group}
				initialValues={{
					description: result.description,
					entries: result.entries,
				}}
				submitLabel="更新"
				onSubmit={async (values) => {
					await updateResult({
						groupId: group.id,
						resultId: result.id,
						description: values.description,
						entries: values.entries,
					});
				}}
			/>
			<Button
				mt="sm"
				variant="outline"
				color="red"
				fullWidth
				onClick={openDeleteModal}
			>
				削除
			</Button>

			<Modal
				opened={deleteModalOpened}
				onClose={closeDeleteModal}
				title="勝ち負け記録を削除"
				centered
			>
				<Stack gap="md">
					<Text size="sm">
						この勝ち負け記録を削除しますか？
						<br />
						この操作は取り消せません。
					</Text>
					<Text size="sm" fw={500}>
						タイトル: {result.description}
					</Text>
				</Stack>
				<Group gap="md" mt="xl" justify="flex-end">
					<Button
						color="red"
						size="md"
						loading={isDeleting}
						onClick={handleDelete}
					>
						削除する
					</Button>
				</Group>
			</Modal>
		</>
	);
}
