import { expect, type Page } from "@playwright/test";

/**
 * UIからグループを作成し、グループページを開いた状態にする。
 * @returns 作成したグループのID
 */
export async function createGroup(
	page: Page,
	{ name, members }: { name: string; members: string[] },
) {
	await page.goto("/groups/new");
	await page.getByLabel("グループ名").fill(name);
	const memberInput = page.getByLabel("メンバー");
	for (const member of members) {
		await memberInput.fill(member);
		await page.getByRole("button", { name: "追加" }).click();
	}
	await page.getByRole("button", { name: "グループを作成" }).click();

	await expect(
		page.getByRole("heading", { name: "グループが作成されました！" }),
	).toBeVisible();
	const groupId = page.url().match(/\/groups\/([^/]+)\/share/)?.[1];
	if (!groupId) {
		throw new Error(`Unexpected URL after group creation: ${page.url()}`);
	}

	await page.getByRole("link", { name: "グループページへ進む" }).click();
	await expect(page.getByRole("heading", { name })).toBeVisible();

	return groupId;
}

export async function addExpense(
	page: Page,
	{
		payer,
		participants,
		description,
		amount,
	}: {
		payer: string;
		participants: string[];
		description: string;
		amount: number;
	},
) {
	await page.getByRole("link", { name: "建て替え記録" }).click();
	await page.getByPlaceholder("払った人").click();
	await page.getByRole("option", { name: payer }).click();
	for (const participant of participants) {
		await page.getByRole("checkbox", { name: participant }).check();
	}
	await page.getByPlaceholder("ランチ代").fill(description);
	await page.getByPlaceholder("1000").fill(String(amount));
	await page.getByRole("button", { name: "建て替え記録を追加" }).click();
	await page.waitForURL(/\/groups\/[^/]+$/);
}
