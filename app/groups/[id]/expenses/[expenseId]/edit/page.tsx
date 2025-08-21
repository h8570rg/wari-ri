import { getGroup } from "@/lib/data/group";
import { getExpense } from "@/lib/data/expense";
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

  return <EditExpenseForm group={group} expense={expense} />;
}
