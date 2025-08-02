import { z } from "zod";

export const newExpenseSchema = z.object({
  amount: z
    .number({ message: "金額を入力してください" })
    .min(1, { message: "金額は1円以上を入力してください" }),
  description: z
    .string()
    .min(1, { message: "内容を入力してください" })
    .max(100, { message: "内容は100文字以内で入力してください" }),
  payerId: z.string().min(1, { message: "建て替えした人を選択してください" }),
  participantIds: z
    .array(z.string())
    .min(1, { message: "参加者を1人以上選択してください" }),
});
