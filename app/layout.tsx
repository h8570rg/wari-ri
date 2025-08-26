import "@mantine/core/styles.css";
import {
	Box,
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from "@mantine/core";
import type { Metadata } from "next";
import { theme } from "@/lib/theme";
import "./global.css";

export const metadata: Metadata = {
	title: "ワリーリ",
	description: "割り勘アプリ",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja" {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider theme={theme}>
					<Box>{children}</Box>
				</MantineProvider>
			</body>
		</html>
	);
}
