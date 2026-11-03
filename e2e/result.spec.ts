import { expect, type Page, test } from "@playwright/test";
import { addExpense, createGroup } from "./helpers";

function amountInput(page: Page, member: string) {
	return page.getByLabel(`${member}の金額`);
}

test("未入力・合計が0でない場合は勝ち負けを記録できない", async ({ page }) => {
	const groupId = await createGroup(page, {
		name: "合計チェック",
		members: ["やまだ", "たなか"],
	});

	await page.goto(`/groups/${groupId}/results/new`);
	const submitButton = page.getByRole("button", { name: "記録する" });

	// 何も入力せずに記録
	await expect(page.getByText("¥0", { exact: true })).toBeVisible();
	await submitButton.click();
	await expect(page.getByText("タイトルを入力してください")).toBeVisible();
	await expect(page.getByText("2人以上の金額を入力してください")).toBeVisible();

	// 合計・人数のエラーは、金額を変えても次に記録するまで残る
	await amountInput(page, "やまだ").fill("500");
	await amountInput(page, "たなか").fill("-300");
	await expect(page.getByText("+¥200", { exact: true })).toBeVisible();
	await expect(page.getByText("2人以上の金額を入力してください")).toBeVisible();

	// 2人入力したが合計が0でないまま記録
	await submitButton.click();
	await expect(page.getByText("2人以上の金額を入力してください")).toHaveCount(
		0,
	);
	await expect(
		page.getByText("合計が0になるように入力してください"),
	).toBeVisible();

	// 合計を0にして記録すると、合計のエラーは消える（タイトル未入力のエラーは残る）
	await amountInput(page, "たなか").fill("-500");
	await expect(page.getByText("¥0", { exact: true })).toBeVisible();
	await submitButton.click();
	await expect(
		page.getByText("合計が0になるように入力してください"),
	).toHaveCount(0);
	await expect(page.getByText("タイトルを入力してください")).toBeVisible();
	await expect(page).toHaveURL(/\/results\/new$/);
});

test("合計が0でない場合は勝ちと負けの合計をそろえて補正できる", async ({
	page,
}) => {
	const groupId = await createGroup(page, {
		name: "補正",
		members: ["やまだ", "たなか", "さとう", "すずき"],
	});

	await page.goto(`/groups/${groupId}/results/new`);
	const adjustButton = page.getByRole("button", { name: "合計を0に調整" });

	// 合計が0のときは押せない
	await expect(adjustButton).toBeDisabled();

	// 勝ちしかないときは補正できない
	await amountInput(page, "やまだ").fill("1230");
	await expect(adjustButton).toBeDisabled();

	// 勝ち1,230円・負け1,250円（すずきは不参加）
	await amountInput(page, "たなか").fill("-480");
	await amountInput(page, "さとう").fill("-770");
	await expect(page.getByText("-¥20", { exact: true })).toBeVisible();
	await adjustButton.click();

	// 初期位置ではずれを半分ずつ持ち、1,240円にそろえる
	const dialog = page.getByRole("dialog", { name: "合計を0に調整" });
	await expect(dialog.getByText("+¥1,240")).toBeVisible();

	// スライダーを動かして閉じても、開き直すと初期位置に戻る
	const slider = dialog.getByRole("slider", { name: "調整の基準" });
	await slider.press("End");
	await expect(dialog.getByText("+¥1,250")).toBeVisible();
	await page.keyboard.press("Escape");
	await expect(dialog).toHaveCount(0);
	await adjustButton.click();
	await expect(dialog.getByText("+¥1,240")).toBeVisible();

	// 勝ちに合わせると、負け側だけが比例して縮む
	await slider.press("Home");
	await expect(dialog.getByText("-¥472")).toBeVisible();
	await dialog.getByRole("button", { name: "適用する" }).click();
	await expect(dialog).toHaveCount(0);

	await expect(amountInput(page, "やまだ")).toHaveValue("1230");
	await expect(amountInput(page, "たなか")).toHaveValue("-472");
	await expect(amountInput(page, "さとう")).toHaveValue("-758");
	await expect(amountInput(page, "すずき")).toHaveValue("");
	await expect(page.getByText("¥0", { exact: true })).toBeVisible();
	await expect(adjustButton).toBeDisabled();

	await page.getByLabel("タイトル").fill("麻雀");
	await page.getByRole("button", { name: "記録する" }).click();
	await page.waitForURL(/\/groups\/[^/]+$/);
	await expect(page.getByText("-¥472")).toBeVisible();
});

test("タイトルが長すぎる場合は記録できない", async ({ page }) => {
	const groupId = await createGroup(page, {
		name: "入力チェック",
		members: ["やまだ", "たなか", "さとう"],
	});

	await page.goto(`/groups/${groupId}/results/new`);
	await page.getByLabel("タイトル").fill("あ".repeat(101));
	await amountInput(page, "やまだ").fill("500");
	await amountInput(page, "たなか").fill("-500");
	await page.getByRole("button", { name: "記録する" }).click();

	await expect(
		page.getByText("タイトルは100文字以内で入力してください"),
	).toBeVisible();
	await expect(page).toHaveURL(/\/results\/new$/);
});

test("勝ち負けを記録すると履歴と精算方法に反映され、編集・削除できる", async ({
	page,
}) => {
	await createGroup(page, {
		name: "麻雀",
		members: ["やまだ", "たなか", "さとう"],
	});

	await page.getByRole("link", { name: "勝ち負け記録" }).click();
	await page.getByLabel("タイトル").fill("1半荘目");
	await amountInput(page, "やまだ").fill("1000");
	await amountInput(page, "たなか").fill("-300");

	await amountInput(page, "さとう").fill("-700");

	await page.getByRole("button", { name: "記録する" }).click();
	await page.waitForURL(/\/groups\/[^/]+$/);

	// 履歴
	await expect(page.getByText("1半荘目")).toBeVisible();
	await expect(page.getByText("+¥1,000")).toBeVisible();

	// 精算方法
	await expect(page.getByText("たなか → やまだ")).toBeVisible();
	await expect(page.getByText("さとう → やまだ")).toBeVisible();
	await expect(page.getByText("¥700", { exact: true })).toBeVisible();

	// 編集
	await page.locator('a[href*="/results/"][href$="/edit"]').click();
	await expect(amountInput(page, "さとう")).toHaveValue("-700");
	await amountInput(page, "たなか").fill("-1000");
	await amountInput(page, "さとう").fill("");
	await page.getByRole("button", { name: "更新" }).click();
	await page.waitForURL(/\/groups\/[^/]+$/);

	await expect(page.getByText("たなか → やまだ")).toBeVisible();
	await expect(page.getByText("さとう → やまだ")).toHaveCount(0);

	// 空欄にした人は保存されず、編集画面でも空欄のまま
	await page.locator('a[href*="/results/"][href$="/edit"]').click();
	await expect(amountInput(page, "さとう")).toHaveValue("");
	await expect(amountInput(page, "たなか")).toHaveValue("-1000");

	// 削除
	await page.getByRole("button", { name: "削除" }).click();
	await page
		.getByRole("dialog", { name: "勝ち負け記録を削除" })
		.getByRole("button", { name: "削除する" })
		.click();
	await page.waitForURL(/\/groups\/[^/]+$/);

	await expect(page.getByText("1半荘目")).toHaveCount(0);
	await expect(page.getByText("すべての精算が完了しています")).toBeVisible();
});

test("建て替え記録と勝ち負け記録をまとめて精算できる", async ({ page }) => {
	await createGroup(page, {
		name: "旅行と麻雀",
		members: ["やまだ", "たなか"],
	});

	// たなか → やまだ に 1,500円
	await addExpense(page, {
		payer: "やまだ",
		participants: ["やまだ", "たなか"],
		description: "ホテル",
		amount: 3000,
	});

	// たなかが1,000円勝ったので、差し引き たなか → やまだ に 500円
	await page.getByRole("link", { name: "勝ち負け記録" }).click();
	await page.getByLabel("タイトル").fill("麻雀");
	await amountInput(page, "やまだ").fill("-1000");
	await amountInput(page, "たなか").fill("1000");
	await page.getByRole("button", { name: "記録する" }).click();
	await page.waitForURL(/\/groups\/[^/]+$/);

	await expect(page.getByText("たなか → やまだ")).toBeVisible();
	await expect(page.getByText("¥500", { exact: true })).toBeVisible();
});

test.describe("iOS", () => {
	// useOsはUser-Agentで判定するため、iPhoneのUser-Agentで iOS 用の入力欄に切り替える
	test.use({
		userAgent:
			"Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
	});

	test("type=numberの入力欄で勝ち負けを記録できる", async ({ page }) => {
		await createGroup(page, {
			name: "iOS確認",
			members: ["やまだ", "たなか"],
		});

		await page.getByRole("link", { name: "勝ち負け記録" }).click();
		await expect(amountInput(page, "やまだ")).toHaveAttribute("type", "number");

		await page.getByLabel("タイトル").fill("ポーカー");
		await amountInput(page, "やまだ").fill("-800");
		await amountInput(page, "たなか").fill("800");
		await expect(page.getByText("¥0", { exact: true })).toBeVisible();
		await page.getByRole("button", { name: "記録する" }).click();
		await page.waitForURL(/\/groups\/[^/]+$/);

		await expect(page.getByText("やまだ → たなか")).toBeVisible();
		await expect(page.getByText("¥800", { exact: true })).toBeVisible();
	});

	// iOS以外のNumberInputは小数を入力できないため、type="number"のiOSで確認する
	test("金額が整数でない場合は記録できない", async ({ page }) => {
		const groupId = await createGroup(page, {
			name: "整数チェック",
			members: ["やまだ", "たなか", "さとう"],
		});

		await page.goto(`/groups/${groupId}/results/new`);
		await page.getByLabel("タイトル").fill("ポーカー");
		await amountInput(page, "やまだ").fill("500");
		await amountInput(page, "たなか").fill("-500");
		await amountInput(page, "さとう").fill("1.5");
		await page.getByRole("button", { name: "記録する" }).click();

		await expect(page.getByText("金額は整数で入力してください")).toBeVisible();
		await expect(page).toHaveURL(/\/results\/new$/);
	});
});
