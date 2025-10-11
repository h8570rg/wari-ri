import { Box, Flex, Text } from "@mantine/core";

type Props = {
	children: React.ReactNode;
	supportingText: string;
};

export function ExpenseFormField({ children, supportingText }: Props) {
	return (
		<Flex gap="lg" align="center">
			<Box flex="1">{children}</Box>
			<Box
				style={{
					flexBasis: "max(70px, 30%)",
				}}
			>
				<Text fw="bold">{supportingText}</Text>
			</Box>
		</Flex>
	);
}
