import { getGroup } from "@/lib/data";
import { notFound } from "next/navigation";
import { Stack } from "@mantine/core";
import { GroupInfo, AddExpenseButton, ExpenseList } from "./_components";

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
        <GroupInfo id={id} />
        <AddExpenseButton groupId={id} />
        <ExpenseList groupId={id} />
      </Stack>
    );
  } catch (error) {
    console.error("Failed to fetch group:", error);
    notFound();
  }
}
