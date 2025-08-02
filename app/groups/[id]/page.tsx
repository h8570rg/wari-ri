import { getGroup } from "@/lib/data";
import { notFound } from "next/navigation";
import { Stack } from "@mantine/core";
import { GroupInfo } from "./_components/group-info";
import { AddExpenseButton } from "./_components/add-expense-button";
import { SettlementSummary } from "./_components/settlement-summary";
import { ExpenseList } from "./_components/expense-list";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GroupPage({ params }: Props) {
  const { id } = await params;

  try {
    const group = await getGroup(id);

    if (!group) {
      notFound();
    }

    return (
      <Stack gap="lg">
        <GroupInfo group={group} />
        <AddExpenseButton groupId={id} />
        <SettlementSummary groupId={id} />
        <ExpenseList groupId={id} />
      </Stack>
    );
  } catch (error) {
    console.error("Failed to fetch group:", error);
    notFound();
  }
}
