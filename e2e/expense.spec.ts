import { expect, test } from "@playwright/test";
import { addExpense, createGroup } from "./helpers";

test("未入力では建て替え記録を追加できない", async ({ page }) => {
	const groupId = await createGroup(page, {
		name: "バリデーション確認",
		members: ["やまだ", "たなか"],
	});

	await page.goto(`/groups/${groupId}/expenses/new`);
	await page.getByRole("button", { name: "建て替え記録を追加" }).click();

	await expect(page.getByText("払った人を選択してください")).toBeVisible();
	await expect(page.getByText("参加者を1人以上選択してください")).toBeVisible();
	await expect(page.getByText("内容を入力してください")).toBeVisible();
	await expect(page.getByText("金額を入力してください")).toBeVisible();
});

test("建て替え記録を追加すると精算方法が表示され、精算すると完了になる", async ({
	page,
}) => {
	await createGroup(page, {
		name: "精算テスト",
		members: ["やまだ", "たなか"],
	});

	await addExpense(page, {
		payer: "やまだ",
		participants: ["やまだ", "たなか"],
		description: "ランチ",
		amount: 3000,
	});

	// 履歴
	await expect(page.getByText("ランチ")).toBeVisible();

	// たなか → やまだ に 1,500円 の精算が必要
	await expect(page.getByText("たなか → やまだ")).toBeVisible();
	await expect(page.getByText("¥1,500", { exact: true }).last()).toBeVisible();

	await page.getByRole("button", { name: "精算する" }).click();
	const dialog = page.getByRole("dialog", { name: "精算" });
	await expect(
		dialog.getByText("たなかがやまだに1500円を支払いましたか？"),
	).toBeVisible();
	await dialog.getByRole("button", { name: "はい、記録する" }).click();

	await expect(page.getByText("すべての精算が完了しています")).toBeVisible();
});
