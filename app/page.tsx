"use client";

import { Box, Button, Center, Image, Text } from "@mantine/core";
import NextImage from "next/image";
import NextLink from "next/link";
import catImage from "./_assets/cat.png";

export default function RootPage() {
	return (
		<Box pos="relative" mih="100dvh" style={{ overflow: "hidden" }}>
			<Box pos="absolute" inset={0} bg="primary.8" />
			<Image
				component={NextImage}
				src={catImage}
				alt="My image"
				pos="absolute"
				top="30px"
				left="40px"
				w="178%"
				h="auto"
				style={{
					mask: "radial-gradient(ellipse at center, black 40%, transparent 70%)",
					WebkitMask:
						"radial-gradient(ellipse at center, black 40%, transparent 70%)",
					filter: "drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1))",
				}}
				opacity={0.7}
			/>
			<Text fw={700} size="lg" pos="absolute" top="20px" left="20px" c="white">
				ワリーリ
			</Text>
			<Text
				size="60px"
				fw={700}
				pos="absolute"
				top="240px"
				left="20px"
				lh="1.3"
				c="white"
				style={{
					textShadow:
						"2px 2px 8px var(--mantine-color-primary-8), -1px -1px 4px var(--mantine-color-primary-8), 1px -1px 4px var(--mantine-color-primary-8), -1px 1px 4px var(--mantine-color-primary-8)",
				}}
			>
				割り勘<br></br>しようよ
			</Text>
			<Center pos="absolute" bottom={0} left={0} right={0} px="30" pb="40">
				<Button
					component={NextLink}
					href="/groups/new"
					size="xl"
					variant="white"
					w="100%"
					fw={700}
					style={{
						boxShadow: "0 4px 20px rgba(255, 255, 255, 0.2)",
					}}
				>
					グループを作成
				</Button>
			</Center>
		</Box>
	);
}
