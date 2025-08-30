import { z } from "zod";

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

export const receiptSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .max(100, "제목은 100자 이하로 입력해주세요")
    .regex(/^[\s\S]*\S[\s\S]*$/, "제목은 공백만으로 구성될 수 없습니다"),

  storeName: z
    .string()
    .min(1, "상점명을 입력해주세요")
    .max(50, "상점명은 50자 이하로 입력해주세요")
    .regex(/^[\s\S]*\S[\s\S]*$/, "상점명은 공백만으로 구성될 수 없습니다"),

  amount: z.coerce
    .number()
    .positive("금액은 0보다 커야 합니다")
    .max(10000000, "금액이 너무 큽니다")
    .refine((val) => val >= 1, "최소 1원 이상 입력해주세요")
    .refine((val) => Number.isInteger(val), "금액은 정수로 입력해주세요"),

  date: z
    .string()
    .min(1, "날짜를 선택해주세요")
    .refine((val) => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "올바른 날짜 형식이 아닙니다")
    .refine((val) => {
      const date = new Date(val);
      const now = new Date();
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      return date <= now && date >= oneYearAgo;
    }, "날짜는 오늘부터 1년 전 사이여야 합니다"),

  category: z
    .string()
    .min(1, "카테고리를 선택해주세요")
    .refine(
      (val) => categories.includes(val as (typeof categories)[number]),
      "올바른 카테고리를 선택해주세요"
    ),

  description: z
    .string()
    .max(500, "설명은 500자 이하로 입력해주세요")
    .optional()
    .transform((val) => val?.trim() || ""),

  imageUrl: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      // Base64 이미지 또는 유효한 URL 형식 확인
      return val.startsWith("data:image/") || val.match(/^https?:\/\/.+/);
    }, "올바른 이미지 형식이 아닙니다"),
});

export type ReceiptFormData = z.infer<typeof receiptSchema>;
