import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  groupId: string;
};

export function AddExpenseButton({ groupId }: Props) {
  return (
    <Button
      component={Link}
      href={`/groups/${groupId}/expenses/new`}
      leftSection={<IconPlus size={18} />}
      size="lg"
      fullWidth
    >
      建て替え記録を追加
    </Button>
  );
}
