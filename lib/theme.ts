import { createTheme } from "@mantine/core";

export const theme = createTheme({
  // プライマリカラー（緑系を割り勘アプリのメインカラーとして設定）
  primaryColor: "green",

  // カラーパレット
  colors: {},

  // デフォルトの半径を設定
  defaultRadius: "md",

  // フォント設定
  fontFamily:
    'Hiragino Sans, "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", Meiryo, sans-serif',
  headings: {
    fontFamily:
      'Hiragino Sans, "Hiragino Kaku Gothic ProN", "Noto Sans CJK JP", Meiryo, sans-serif',
    sizes: {
      h1: { fontSize: "2.5rem", lineHeight: "1.2" },
      h2: { fontSize: "2rem", lineHeight: "1.3" },
      h3: { fontSize: "1.5rem", lineHeight: "1.4" },
    },
  },

  // スペーシング
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },

  // コンポーネントのデフォルトプロパティ
  components: {
    Container: {
      defaultProps: {
        size: "md",
      },
      styles: {
        root: {
          padding: "2rem",
        },
      },
    },

    Button: {
      defaultProps: {
        variant: "filled",
        radius: "md",
      },
    },

    Title: {},

    Paper: {
      defaultProps: {
        shadow: "sm",
        radius: "md",
        p: "lg",
      },
    },
  },

  // シャドウ
  shadows: {
    xs: "0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)",
    sm: "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)",
    md: "0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)",
    lg: "0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.10)",
    xl: "0 15px 25px rgba(0, 0, 0, 0.15), 0 5px 10px rgba(0, 0, 0, 0.05)",
  },
});
