"use client";

import { Box, Button, Container, Image, Stack, Text } from "@mantine/core";
import NextImage from "next/image";
import { NextLink } from "@/components/next-link";
import catImage from "./_assets/cat.png";
import { RecentGroups } from "./_components/recent-groups";

export default function RootPage() {
	return (
		<Box pos="relative" mih="100dvh" style={{ overflow: "hidden" }}>
			<Box pos="absolute" inset={0} bg="dark.8" />
			<Text fw={700} size="lg" pos="absolute" top="20px" left="20px" c="white">
				ワリーリ
			</Text>
			<Container pos="relative" mih="100dvh" maw="800px">
				<Image
					component={NextImage}
					src={catImage}
					alt=""
					pos="absolute"
					top="48%"
					left="calc(50% + 210px)"
					w="800px"
					h="auto"
					style={{
						transform: "translate(-50%, -50%)",
						mask: "radial-gradient(ellipse at center, black 40%, transparent 70%)",
						WebkitMask:
							"radial-gradient(ellipse at center, black 40%, transparent 70%)",
						filter: "drop-shadow(0 4px 20px rgba(0, 0, 0, 0.1))",
					}}
					opacity={0.7}
				/>
				<Text
					pos="absolute"
					top="30%"
					left="20px"
					size="60px"
					fw={700}
					lh="1.3"
					c="white"
				>
					割り勘
					<br />
					しようよ
				</Text>
				<Stack pos="absolute" bottom={0} left={0} right={0} px="30" pb="40">
					<RecentGroups />
					<Button component={NextLink} href="/groups/new" size="xl" w="100%">
						グループを作成
					</Button>
				</Stack>
			</Container>
		</Box>
	);
}
