import { z } from "zod";

// ユーザー名のバリデーション
export const userNameSchema = z.object({
	userName: z
		.string()
		.min(1, { message: "メンバー名を入力してください" })
		.max(50, { message: "メンバー名は50文字以内で入力してください" }),
});

// 新規グループ作成用のスキーマ
export const newGroupSchema = z.object({
	name: z.string().min(1, { message: "グループ名を入力してください" }),
	userNames: z
		.array(z.string().min(1, { message: "メンバー名を入力してください" }))
		.min(1, { message: "メンバーを1人以上入力してください" }),
});

// グループ編集用のスキーマ
export const editGroupSchema = z.object({
	name: z
		.string()
		.min(1, { message: "グループ名を入力してください" })
		.max(50, { message: "グループ名は50文字以内で入力してください" }),
	users: z
		.array(
			z.object({
				id: z.string(),
				name: z.string().min(1, { message: "メンバー名を入力してください" }),
			}),
		)
		.min(1, { message: "メンバーは1人以上必要です" })
		.max(20, { message: "メンバーは20人以下にしてください" }),
});

// 経費（建て替え記録）用のスキーマ
export const expenseSchema = z.object({
	amount: z
		.number({ message: "金額を入力してください" })
		.min(1, { message: "金額は1円以上を入力してください" }),
	description: z
		.string()
		.min(1, { message: "内容を入力してください" })
		.max(100, { message: "内容は100文字以内で入力してください" }),
	payerId: z.string().min(1, { message: "払った人を選択してください" }),
	participantIds: z
		.array(z.string())
		.min(1, { message: "参加者を1人以上選択してください" }),
});
