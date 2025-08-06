import "@mantine/core/styles.css";
import {
  Box,
  ColorSchemeScript,
  Container,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { theme } from "@/lib/theme";
import { Metadata } from "next";
import { Header } from "./_components/header";
import "./global.css";

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
          <Box
            style={{
              backgroundImage:
                "linear-gradient(225deg, white, var(--mantine-primary-color-1))",
            }}
          >
            <Container size="xs" pt={0}>
              <Header />
              {children}
            </Container>
          </Box>
        </MantineProvider>
      </body>
    </html>
  );
}
