import { z } from "zod";

export const userNameSchema = z.object({
  userName: z
    .string()
    .min(1, { message: "メンバー名を入力してください" })
    .max(50, { message: "メンバー名は50文字以内で入力してください" }),
});

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
