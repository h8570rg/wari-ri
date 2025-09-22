"use client";

import {
	Box,
	Button,
	Center,
	Container,
	Image,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconPencil } from "@tabler/icons-react";
import NextImage from "next/image";
import NextLink from "next/link";
import { RecentGroups } from "./_components/recent-groups";
import FreeImage from "./free.svg";
import HeroImage from "./image.svg";
import SimpleImage from "./simple.svg";
import UIImage from "./ui.svg";

export default function RootPage() {
	return (
		<Box>
			<Box pos="relative" mb="xl">
				<Box
					pos="relative"
					bg="green.8"
					style={{
						background: "white",
						clipPath: "inset(0 round 0 0 30px 0)",
					}}
				>
					<Center pt="md" px="md">
						<Text
							component={NextLink}
							href="/"
							c="white"
							size="xl"
							fw={400}
							style={{ fontFamily: "var(--font-mochiy-pop-one)" }}
						>
							ワリーリ
						</Text>
					</Center>
					<Container py="50px">
						<Image
							component={NextImage}
							src={HeroImage}
							alt=""
							h="auto"
							w="calc(100% - 140px)"
							mx="auto"
							maw="500px"
						/>
						<Text c="white" ta="center" size="xl" mt="md" fw={600}>
							みんなで使う、シンプルな割り勘アプリ
						</Text>
						<Button
							mt="lg"
							variant="white"
							component={NextLink}
							href="/groups/new"
							leftSection={<IconPencil size={22} />}
							size="lg"
							fullWidth
						>
							割り勘グループを作成
						</Button>
						<RecentGroups mt="lg" w="100%" />
					</Container>
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
			<Container mb="xl">
				<Stack gap="80px">
					<Stack gap="lg" align="center">
						<Title c="green" order={2} size="h3">
							シンプルな割り勘管理
						</Title>
						<Box px="70px">
							<Image
								component={NextImage}
								src={SimpleImage}
								alt=""
								h="auto"
								mx="auto"
							/>
						</Box>
						<Text ta="center">
							グループを作成して、誰が何を支払ったかを記録。参加者全員で自動的に金額を均等に分け合い、複雑な計算はアプリが自動で処理します。
						</Text>
					</Stack>
					<Stack gap="lg" align="center">
						<Title c="green" order={2} size="h3">
							直感的なUI
						</Title>
						<Box px="70px">
							<Image
								component={NextImage}
								src={UIImage}
								alt=""
								h="auto"
								mx="auto"
							/>
						</Box>
						<Text ta="center">
							使いやすいインターフェースで、誰でも簡単に操作できます。直感的なボタン配置と分かりやすい表示で、ストレスなく割り勘を管理できます。
						</Text>
					</Stack>
					<Stack gap="lg" align="center">
						<Title c="green" order={2} size="h3">
							広告なし
						</Title>
						<Box px="70px">
							<Image
								component={NextImage}
								src={FreeImage}
								alt=""
								h="auto"
								mx="auto"
							/>
						</Box>
						<Text ta="center">
							広告による邪魔な表示は一切ありません。純粋に割り勘管理に集中できる、クリーンな環境を提供します。
						</Text>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}
