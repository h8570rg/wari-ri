"use client";

import { NumberInput, TextInput } from "@mantine/core";
import { useOs } from "@mantine/hooks";
import { IconCurrencyYen } from "@tabler/icons-react";
import type { FocusEventHandler, ReactNode } from "react";

type Props = {
	// 値はnumberを使わず文字列で扱う
	value?: string;
	onChange?: (value: string) => void;
	onFocus?: FocusEventHandler<HTMLInputElement>;
	onBlur?: FocusEventHandler<HTMLInputElement>;
	error?: ReactNode;
	"aria-label"?: string;
};

/**
 * 符号付き金額の入力欄
 *
 * iOSのテンキー（inputMode="numeric" / "decimal"）にはマイナスキーがないため、
 * iOSでは type="number" で「-」を含む数字・記号キーボードを表示する。
 * MantineのNumberInputはinputModeを上書きできず、内部のreact-number-formatが
 * type="number"に対応していないので、iOSではTextInputを使う。
 */
export function SignedAmountInput({ value, onChange, ...others }: Props) {
	const os = useOs();

	const commonProps = {
		placeholder: "0",
		leftSection: <IconCurrencyYen />,
		...others,
	};

	if (os === "ios") {
		return (
			<TextInput
				type="number"
				step={1}
				value={value}
				onChange={(event) => onChange?.(event.currentTarget.value)}
				{...commonProps}
			/>
		);
	}

	return (
		<NumberInput
			hideControls
			allowDecimal={false}
			value={value}
			// NumberInputは数値として確定した値をnumberで返すため文字列に揃える
			onChange={(nextValue) => onChange?.(String(nextValue))}
			{...commonProps}
		/>
	);
}
