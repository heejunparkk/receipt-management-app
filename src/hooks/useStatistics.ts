import { useMemo } from "react";
import { Receipt } from "../types/receipt";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  isSameMonth,
} from "date-fns";

export interface MonthlyData {
  month: string;
  amount: number;
  count: number;
}

export interface CategoryData {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}

export interface DailyData {
  date: string;
  amount: number;
  count: number;
}

export interface StatsSummary {
  totalAmount: number;
  totalCount: number;
  averageAmount: number;
  thisMonthAmount: number;
  thisMonthCount: number;
  lastMonthAmount: number;
  lastMonthCount: number;
  monthlyGrowth: number;
}

export const useStatistics = (receipts: Receipt[]) => {
  const statistics = useMemo(() => {
    if (!receipts.length) {
      return {
        summary: {
          totalAmount: 0,
          totalCount: 0,
          averageAmount: 0,
          thisMonthAmount: 0,
          thisMonthCount: 0,
          lastMonthAmount: 0,
          lastMonthCount: 0,
          monthlyGrowth: 0,
        },
        monthlyData: [],
        categoryData: [],
        dailyData: [],
        topExpenses: [],
      };
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subDays(thisMonthStart, 1));
    const lastMonthEnd = endOfMonth(subDays(thisMonthStart, 1));

    // 전체 요약 통계
    const totalAmount = receipts.reduce(
      (sum, receipt) => sum + receipt.amount,
      0
    );
    const totalCount = receipts.length;
    const averageAmount = totalAmount / totalCount;

    // 이번 달 통계
    const thisMonthReceipts = receipts.filter(
      (receipt) =>
        receipt.date >= thisMonthStart && receipt.date <= thisMonthEnd
    );
    const thisMonthAmount = thisMonthReceipts.reduce(
      (sum, receipt) => sum + receipt.amount,
      0
    );
    const thisMonthCount = thisMonthReceipts.length;

    // 지난 달 통계
    const lastMonthReceipts = receipts.filter(
      (receipt) =>
        receipt.date >= lastMonthStart && receipt.date <= lastMonthEnd
    );
    const lastMonthAmount = lastMonthReceipts.reduce(
      (sum, receipt) => sum + receipt.amount,
      0
    );
    const lastMonthCount = lastMonthReceipts.length;

    // 월별 성장률
    const monthlyGrowth =
      lastMonthAmount > 0
        ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100
        : 0;

    // 월별 데이터 (최근 6개월)
    const monthlyData: MonthlyData[] = [];
    for (let i = 5; i >= 0; i--) {
      const targetDate = subDays(now, i * 30);
      const monthStart = startOfMonth(targetDate);
      const monthEnd = endOfMonth(targetDate);

      const monthReceipts = receipts.filter(
        (receipt) => receipt.date >= monthStart && receipt.date <= monthEnd
      );

      monthlyData.push({
        month: format(targetDate, "MM월"),
        amount: monthReceipts.reduce((sum, receipt) => sum + receipt.amount, 0),
        count: monthReceipts.length,
      });
    }

    // 카테고리별 데이터
    const categoryMap = new Map<string, { amount: number; count: number }>();
    receipts.forEach((receipt) => {
      const existing = categoryMap.get(receipt.category) || {
        amount: 0,
        count: 0,
      };
      categoryMap.set(receipt.category, {
        amount: existing.amount + receipt.amount,
        count: existing.count + 1,
      });
    });

    const categoryData: CategoryData[] = Array.from(categoryMap.entries())
      .map(([category, data]) => ({
        category,
        amount: data.amount,
        count: data.count,
        percentage: (data.amount / totalAmount) * 100,
      }))
      .sort((a, b) => b.amount - a.amount);

    // 최근 7일 일별 데이터
    const dailyData: DailyData[] = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = subDays(now, i);
      const dayReceipts = receipts.filter(
        (receipt) =>
          format(receipt.date, "yyyy-MM-dd") ===
          format(targetDate, "yyyy-MM-dd")
      );

      dailyData.push({
        date: format(targetDate, "MM/dd"),
        amount: dayReceipts.reduce((sum, receipt) => sum + receipt.amount, 0),
        count: dayReceipts.length,
      });
    }

    // 최고 지출 내역 (상위 5개)
    const topExpenses = [...receipts]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      summary: {
        totalAmount,
        totalCount,
        averageAmount,
        thisMonthAmount,
        thisMonthCount,
        lastMonthAmount,
        lastMonthCount,
        monthlyGrowth,
      },
      monthlyData,
      categoryData,
      dailyData,
      topExpenses,
    };
  }, [receipts]);

  return statistics;
};
