import { getGroup } from "@/lib/data";
import { NewExpenseForm } from "./_components/new-expense-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewExpensePage({ params }: Props) {
  const { id } = await params;
  const group = await getGroup(id);

  console.debug(group);

  return <NewExpenseForm group={group} />;
}
