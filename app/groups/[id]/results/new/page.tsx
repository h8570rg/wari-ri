import { Container } from "@mantine/core";
import type { Route } from "next";
import { PageHeader } from "@/components/page-header";
import { getGroup } from "@/lib/data/group";
import { NewResultForm } from "./_components/new-result-form";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function NewResultPage({ params }: Props) {
	const { id } = await params;
	const group = await getGroup(id);

	return (
		<Container>
			<PageHeader
				title="勝ち負け記録追加"
				backLinkHref={`/groups/${id}` as Route}
			/>
			<NewResultForm group={group} />
		</Container>
	);
}
