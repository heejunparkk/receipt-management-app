import { z } from "zod";

export const receiptSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(100, "제목은 100자 이하로 입력해주세요"),

  storeName: z
    .string()
    .min(1, "상점명을 입력해주세요")
    .max(50, "상점명은 50자 이하로 입력해주세요"),

  amount: z
    .number({
      invalid_type_error: "올바른 금액을 입력해주세요",
    })
    .positive("금액은 0보다 커야 합니다")
    .max(10000000, "금액이 너무 큽니다"),

  date: z.string().min(1, "날짜를 선택해주세요"),

  category: z.string().min(1, "카테고리를 선택해주세요"),

  description: z
    .string()
    .max(500, "설명은 500자 이하로 입력해주세요")
    .optional(),

  imageUrl: z.string().optional(),
});

export type ReceiptFormData = z.infer<typeof receiptSchema>;

export const categories = [
  "식비",
  "교통비",
  "쇼핑",
  "의료비",
  "교육비",
  "문화생활",
  "주거비",
  "기타",
] as const;
