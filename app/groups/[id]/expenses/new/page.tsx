import { Box, Container } from "@mantine/core";
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
		<Box>
			<PageHeader title="支出追加" />
			<Container>
				<NewExpenseForm group={group} />
			</Container>
		</Box>
	);
}
