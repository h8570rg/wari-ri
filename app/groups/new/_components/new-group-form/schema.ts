import { z } from "zod";

export const userNameSchema = z.object({
	userName: z
		.string()
		.min(1, { message: "メンバー名を入力してください" })
		.max(50, { message: "メンバー名は50文字以内で入力してください" }),
});

export const newGroupSchema = z.object({
	name: z.string().min(1, { message: "グループ名を入力してください" }),
	userNames: z
		.array(z.string().min(1, { message: "メンバー名を入力してください" }))
		.min(1, { message: "メンバーを1人以上入力してください" }),
});
