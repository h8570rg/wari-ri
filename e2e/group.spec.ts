import { expect, test } from "@playwright/test";
import { createGroup } from "./helpers";

test("トップページからグループ作成画面へ遷移できる", async ({ page }) => {
	await page.goto("/");
	await page.getByRole("link", { name: "グループを作成" }).click();
	await expect(page).toHaveURL("/groups/new");
	await expect(page.getByLabel("グループ名")).toBeVisible();
});

test("未入力ではグループを作成できない", async ({ page }) => {
	await page.goto("/groups/new");
	await page.getByRole("button", { name: "グループを作成" }).click();

	await expect(page.getByText("グループ名を入力してください")).toBeVisible();
	await expect(
		page.getByText("メンバーを1人以上入力してください"),
	).toBeVisible();
	await expect(page).toHaveURL("/groups/new");
});

test("同じメンバー名は追加できない", async ({ page }) => {
	await page.goto("/groups/new");
	const memberInput = page.getByLabel("メンバー");
	await memberInput.fill("やまだ");
	await page.getByRole("button", { name: "追加" }).click();
	await memberInput.fill("やまだ");
	await page.getByRole("button", { name: "追加" }).click();

	await expect(page.getByText("ユーザー名が重複しています")).toBeVisible();
});

test("グループを作成するとグループページに名前とメンバーが表示される", async ({
	page,
}) => {
	await createGroup(page, {
		name: "北海道旅行",
		members: ["やまだ", "たなか", "すずき"],
	});

	for (const member of ["やまだ", "たなか", "すずき"]) {
		await expect(page.getByText(member, { exact: true })).toBeVisible();
	}
});

test("閲覧したグループがトップページの最近閲覧したグループに表示される", async ({
	page,
}) => {
	const groupId = await createGroup(page, {
		name: "沖縄旅行",
		members: ["やまだ"],
	});

	await page.goto("/");
	await expect(page.getByText("最近閲覧したグループ")).toBeVisible();
	const recentLink = page.getByRole("link", { name: "沖縄旅行" });
	await expect(recentLink).toHaveAttribute("href", `/groups/${groupId}`);
});

test("グループ名を編集できる", async ({ page }) => {
	const groupId = await createGroup(page, {
		name: "旧グループ名",
		members: ["やまだ"],
	});

	await page.goto(`/groups/${groupId}/edit`);
	await page.getByLabel("グループ名").fill("新グループ名");
	await page.getByRole("button", { name: "グループを更新" }).click();

	await expect(
		page.getByRole("heading", { name: "新グループ名" }),
	).toBeVisible();
});
