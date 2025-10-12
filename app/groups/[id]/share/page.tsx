import { Container } from "@mantine/core";
import { PageHeader } from "@/components/page-header";
import { baseUrl } from "@/lib/utils/env";
import { ShareContent } from "./_components/share-content";

export default async function GroupSharePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: groupId } = await params;
	const shareUrl = `${baseUrl}/groups/${groupId}`;

	return (
		<Container>
			<PageHeader title="グループを共有" backLinkHref="/" showNavbar={false} />
			<ShareContent groupId={groupId} shareUrl={shareUrl} />
		</Container>
	);
}
