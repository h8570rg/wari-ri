import { getGroup } from "@/lib/data/group";
import { NewExpenseForm } from "./_components/new-expense-form";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NewExpensePage({ params }: Props) {
  const { id } = await params;
  const group = await getGroup(id);

  return <NewExpenseForm group={group} />;
}
