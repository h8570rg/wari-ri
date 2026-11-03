"use client";

import { ResultForm } from "@/app/groups/[id]/results/_components/result-form";
import type { GroupDocument } from "@/lib/data/group";
import { createResult } from "./actions";

type Props = {
	group: GroupDocument;
};

export function NewResultForm({ group }: Props) {
	return (
		<ResultForm
			group={group}
			submitLabel="記録する"
			onSubmit={async (values) => {
				await createResult({
					groupId: group.id,
					description: values.description,
					entries: values.entries,
				});
			}}
		/>
	);
}
