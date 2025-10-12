import { Container } from "@mantine/core";
import { headers } from "next/headers";
import { PageHeader } from "@/components/page-header";
import { ShareContent } from "./_components/share-content";

export default async function GroupSharePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id: groupId } = await params;
	const headersList = await headers();
	const host = headersList.get("host") || "";
	const protocol = headersList.get("x-forwarded-proto") || "http";
	const shareUrl = `${protocol}://${host}/groups/${groupId}`;

	return (
		<Container>
			<PageHeader title="グループを共有" backLinkHref="/" showNavbar={false} />
			<ShareContent groupId={groupId} shareUrl={shareUrl} />
		</Container>
	);
}
