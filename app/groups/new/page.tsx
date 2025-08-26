import { Box, Container } from "@mantine/core";
import { PageHeader } from "@/components/page-header";
import { NewGroupForm } from "./_components/new-group-form";

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
