import { Box, Container } from "@mantine/core";
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
		<Box>
			<PageHeader title="支出編集" />
			<Container>
				<EditExpenseForm group={group} expense={expense} />
			</Container>
		</Box>
	);
}
