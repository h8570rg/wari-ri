import "@mantine/core/styles.css";
import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from "@mantine/core";
import type { Metadata } from "next";
import { mPlusRounded1c } from "@/lib/fonts";
import "./global.css";
import { theme } from "@/lib/theme";

export const metadata: Metadata = {
	title: "ワリーリ",
	description: "無料で使える広告無しの割り勘アプリ",
	applicationName: "ワリーリ",
	keywords: [
		"割り勘",
		"割り勘アプリ",
		"経費精算",
		"グループ会計",
		"無料",
		"広告無し",
	],
	authors: [{ name: "ワリーリ" }],
	themeColor: "#228be6",
	openGraph: {
		type: "website",
		locale: "ja_JP",
		siteName: "ワリーリ",
		title: "ワリーリ",
		description: "無料で使える広告無しの割り勘アプリ",
	},
	twitter: {
		card: "summary",
		title: "ワリーリ",
		description: "無料で使える広告無しの割り勘アプリ",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ja" {...mantineHtmlProps} className={mPlusRounded1c.variable}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider theme={theme}>{children}</MantineProvider>
			</body>
		</html>
	);
}
