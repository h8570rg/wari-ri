import { Box, Center, Text, Title } from "@mantine/core";
import NextLink from "next/link";

export function PageHeader({ title }: { title: string }) {
	return (
		<Box pos="relative" mb="xl">
			<Box
				pos="relative"
				bg="green.8"
				style={{
					clipPath: "inset(0 round 0 0 30px 0)",
				}}
			>
				<Box pt="md" px="xl">
					<Center>
						<Text
							component={NextLink}
							href="/"
							c="white"
							size="xl"
							fw={400}
							ff="var(--font-mochiy-pop-one)"
						>
							ワリーリ
						</Text>
					</Center>
					<Box pt="md" pb="lg">
						<Title order={1} size="h3" c="white">
							{title}
						</Title>
					</Box>
				</Box>
			</Box>
			<Box
				pos="absolute"
				top="calc(100% - 1px)"
				left={0}
				w="30px"
				h="30px"
				bg="green.8"
				style={{
					mask: "radial-gradient(30px at 100% 100%, #0000 98%, #000)",
				}}
			/>
		</Box>
	);
}
