import "@mantine/core/styles.css";
import {
	Box,
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
	description: "割り勘アプリ",
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
				<MantineProvider theme={theme}>
					<Box pos="relative" mih="100dvh">
						{/* <Box
							pos="absolute"
							inset={0}
							style={{
								background:
									"linear-gradient(176deg, rgba(233, 233, 233, 1), rgba(172, 172, 172, 1))",
							}}
						/> */}
						<Box pos="relative">{children}</Box>
					</Box>
				</MantineProvider>
			</body>
		</html>
	);
}
