import { getGroup } from "@/lib/data";
import { Stack } from "@mantine/core";
import { GroupInfo } from "./_components/group-info";
import { AddExpenseButton } from "./_components/add-expense-button";
import { SettlementSummary } from "./_components/settlement-summary";
import { ActivityHistory } from "./_components/activity-history";
import { RecentGroupTracker } from "./_components/recent-group-tracker";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GroupPage({ params }: Props) {
  const { id } = await params;
  const group = await getGroup(id);

  return (
    <Stack gap="lg">
      <RecentGroupTracker groupId={id} groupName={group.name} />
      <GroupInfo group={group} />
      <AddExpenseButton groupId={id} />
      <SettlementSummary groupId={id} />
      <ActivityHistory groupId={id} />
    </Stack>
  );
}
