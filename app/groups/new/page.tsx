import { Container } from "@mantine/core";
import { PageHeader } from "@/components/page-header";
import { NewGroupForm } from "./_components/new-group-form";

export default function NewGroupPage() {
	return (
		<Container>
			<PageHeader title="グループ作成" backLinkHref="/" />
			<NewGroupForm />
		</Container>
	);
}
