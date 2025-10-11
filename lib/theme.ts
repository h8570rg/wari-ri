import { createTheme, DEFAULT_THEME } from "@mantine/core";
import { mPlusRounded1c } from "./fonts";

export const theme = createTheme({
	// プライマリカラー（緑系を割り勘アプリのメインカラーとして設定）
	primaryColor: "primary",

	// カラーパレット
	colors: {
		primary: DEFAULT_THEME.colors.orange,
		secondary: DEFAULT_THEME.colors.gray,
	},

	fontFamily: mPlusRounded1c.style.fontFamily,

	// デフォルトの半径を設定
	defaultRadius: "md",

	// コンポーネントのデフォルトプロパティ
	components: {
		ActionIcon: {
			defaultProps: {
				variant: "light",
			},
		},
		Container: {
			defaultProps: {
				size: "md",
			},
			styles: {
				root: {
					padding: "1rem 1.5rem 2rem",
				},
			},
		},
		Button: {
			defaultProps: {
				size: "lg",
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
				size: "lg",
			},
		},
		Select: {
			defaultProps: {
				size: "lg",
			},
		},
		NumberInput: {
			defaultProps: {
				size: "lg",
			},
		},
		Checkbox: {
			defaultProps: {
				size: "md",
			},
		},
	},
});
