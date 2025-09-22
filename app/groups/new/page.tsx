import { ActionIcon, Container, Flex, Space, Title } from "@mantine/core";
import { IconChevronLeft } from "@tabler/icons-react";
import NextLink from "next/link";
import { NewGroupForm } from "./_components/new-group-form";

export default function NewGroupPage() {
	return (
		<Container>
			<Flex justify="space-between" align="center" mb="lg">
				<ActionIcon component={NextLink} href="/" variant="subtle" size="lg">
					<IconChevronLeft />
				</ActionIcon>
				<Title order={1} size="md">
					グループ作成
				</Title>
				<Space w="32" />
			</Flex>
			<NewGroupForm />
		</Container>
	);
}
