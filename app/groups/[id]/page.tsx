import { getGroup } from "@/lib/data/group";
import { Box, Container } from "@mantine/core";
import { GroupInfo } from "./_components/group-info";
import { AddExpenseButton } from "./_components/add-expense-button";
import { SettlementSummary } from "./_components/settlement-summary";
import { ActivityHistory } from "./_components/activity-history";
import { RecentGroupTracker } from "./_components/recent-group-tracker";
import { PageHeader } from "@/components/page-header";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GroupPage({ params }: Props) {
  const { id } = await params;
  const group = await getGroup(id);

  return (
    <Box>
      <PageHeader title={group.name} />
      <Container>
        <RecentGroupTracker groupId={id} groupName={group.name} />
        <GroupInfo group={group} />
        <AddExpenseButton groupId={id} />
        <SettlementSummary groupId={id} initialGroup={group} />
        <ActivityHistory groupId={id} />
      </Container>
    </Box>
  );
}
