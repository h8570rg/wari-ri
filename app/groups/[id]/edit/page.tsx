import { Container } from "@mantine/core";
import type { Route } from "next";
import { PageHeader } from "@/components/page-header";
import { getGroup } from "@/lib/data/group";
import { EditGroupForm } from "./_components/edit-group-form";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function EditGroupPage({ params }: Props) {
	const { id } = await params;
	const group = await getGroup(id);

	return (
		<Container>
			<PageHeader
				title="グループ編集"
				backLinkHref={`/groups/${id}` as Route}
			/>
			<EditGroupForm group={group} />
		</Container>
	);
}
