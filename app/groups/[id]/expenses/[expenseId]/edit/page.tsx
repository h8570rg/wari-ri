import { Container } from "@mantine/core";
import type { Route } from "next";
import { PageHeader } from "@/components/page-header";
import { getExpense } from "@/lib/data/expense";
import { getGroup } from "@/lib/data/group";
import { EditExpenseForm } from "./_components/edit-expense-form";

type Props = {
	params: Promise<{ id: string; expenseId: string }>;
};

export default async function EditExpensePage({ params }: Props) {
	const { id, expenseId } = await params;
	const [group, expense] = await Promise.all([
		getGroup(id),
		getExpense(id, expenseId),
	]);

	return (
		<Container>
			<PageHeader
				title="建て替え記録編集"
				backLinkHref={`/groups/${id}` as Route}
			/>
			<EditExpenseForm group={group} expense={expense} />
		</Container>
	);
}
