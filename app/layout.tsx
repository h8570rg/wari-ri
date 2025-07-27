import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  Container,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "@/lib/theme";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ワリーリ",
  description: "割り勘アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Container size="xs">{children}</Container>
        </MantineProvider>
      </body>
    </html>
  );
}
