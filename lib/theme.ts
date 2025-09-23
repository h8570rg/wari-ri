import { createTheme, DEFAULT_THEME } from "@mantine/core";

export const theme = createTheme({
	// プライマリカラー（緑系を割り勘アプリのメインカラーとして設定）
	primaryColor: "primary",

	// カラーパレット
	colors: {
		primary: DEFAULT_THEME.colors.dark,
	},

	// デフォルトの半径を設定
	defaultRadius: "md",

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
		Paper: {
			defaultProps: {
				shadow: "sm",
				radius: "md",
				p: "lg",
			},
		},
		TextInput: {
			defaultProps: {
				size: "md",
				variant: "filled",
			},
			styles: {
				input: {
					backgroundColor: "white",
				},
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
