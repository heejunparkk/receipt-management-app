export interface Receipt {
  id: string;
  title: string;
  amount: number;
  date: Date;
  category: string;
  storeName: string;
  imageUrl?: string;
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReceiptFormData {
  title: string;
  amount: number;
  date: string;
  category: string;
  storeName: string;
  description?: string;
  tags?: string[];
}

export type Category = "식비" | "교통" | "쇼핑" | "의료" | "여가" | "기타";

export interface Statistics {
  totalAmount: number;
  totalCount: number;
  categoryBreakdown: { [key in Category]: number };
  monthlyTrend: { month: string; amount: number }[];
}
