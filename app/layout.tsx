import "@mantine/core/styles.css";
import {
	Box,
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from "@mantine/core";
import type { Metadata } from "next";
import { mochiyPopOne } from "@/lib/fonts";
import "./global.css";
import { theme } from "@/lib/theme";

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
		<html lang="ja" {...mantineHtmlProps} className={mochiyPopOne.variable}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider theme={theme}>
					<Box
						style={{
							background: "linear-gradient(to bottom, #f6f6f6, #e7e7e7)",
						}}
						mih="100dvh"
					>
						{children}
					</Box>
				</MantineProvider>
			</body>
		</html>
	);
}
