import { Container } from "@mantine/core";
import type { Route } from "next";
import { PageHeader } from "@/components/page-header";
import { getGroup } from "@/lib/data/group";
import { getResult } from "@/lib/data/result";
import { EditResultForm } from "./_components/edit-result-form";

type Props = {
	params: Promise<{ id: string; resultId: string }>;
};

export default async function EditResultPage({ params }: Props) {
	const { id, resultId } = await params;
	const [group, result] = await Promise.all([
		getGroup(id),
		getResult(id, resultId),
	]);

	return (
		<Container>
			<PageHeader
				title="勝ち負け記録編集"
				backLinkHref={`/groups/${id}` as Route}
			/>
			<EditResultForm group={group} result={result} />
		</Container>
	);
}
