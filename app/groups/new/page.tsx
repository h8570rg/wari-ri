import { NewGroupForm } from "./_components/new-group-form";
import { Box, Container } from "@mantine/core";
import { PageHeader } from "@/components/page-header";

export default function NewGroupPage() {
  return (
    <Box>
      <PageHeader title="グループ作成" />
      <Container>
        <NewGroupForm />
      </Container>
    </Box>
  );
}
