import { Container } from "@mantine/core";
import type { Route } from "next";
import { PageHeader } from "@/components/page-header";
import { getGroup } from "@/lib/data/group";
import { NewExpenseForm } from "./_components/new-expense-form";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function NewExpensePage({ params }: Props) {
	const { id } = await params;
	const group = await getGroup(id);

	return (
		<Container>
			<PageHeader
				title="建て替え記録追加"
				backLinkHref={`/groups/${id}` as Route}
			/>
			<NewExpenseForm group={group} />
		</Container>
	);
}
