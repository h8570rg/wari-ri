import { getGroup } from "@/lib/data/group";
import { EditGroupForm } from "./_components/edit-group-form";
import { PageHeader } from "@/components/page-header";
import { Box, Container } from "@mantine/core";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditGroupPage({ params }: Props) {
  const { id } = await params;
  const group = await getGroup(id);

  return (
    <Box>
      <PageHeader title="グループ編集" />
      <Container>
        <EditGroupForm group={group} />
      </Container>
    </Box>
  );
}
