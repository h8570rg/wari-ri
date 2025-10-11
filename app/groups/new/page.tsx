import { ActionIcon, Container, Group, Space, Title } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import NextLink from "next/link";
import { NewGroupForm } from "./_components/new-group-form";

export default function NewGroupPage() {
	return (
		<Container>
			<Group justify="space-between" mb="lg">
				<ActionIcon component={NextLink} href="/" size="lg" color="secondary">
					<IconChevronLeft />
				</ActionIcon>
				<Title order={1} size="lg">
					グループ作成
				</Title>
				<Space w="32" />
			</Group>
			<NewGroupForm />
		</Container>
	);
}
