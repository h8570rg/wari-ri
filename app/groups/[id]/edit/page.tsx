import { getGroup } from "@/lib/data/group";
import { EditGroupForm } from "./_components/edit-group-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditGroupPage({ params }: Props) {
  const { id } = await params;
  const group = await getGroup(id);

  return <EditGroupForm group={group} />;
}
