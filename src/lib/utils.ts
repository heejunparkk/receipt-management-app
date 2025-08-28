import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 통화 포맷팅 함수
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// 날짜 포맷팅 함수 (date-fns 사용)
export function formatDate(date: Date): string {
  return format(date, "yyyy년 M월 d일 EEEE", { locale: ko });
}

// 간단한 날짜 포맷팅 (카드용)
export function formatDateShort(date: Date): string {
  return format(date, "M월 d일", { locale: ko });
}

// 상대적 시간 표시
export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
}

// 입력 폼용 날짜 포맷 (YYYY-MM-DD)
export function formatDateForInput(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

// 문자열을 Date 객체로 변환
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}
