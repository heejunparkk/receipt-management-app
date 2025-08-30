import { memo } from "react";
import { Receipt } from "../types/receipt";
import { useStatistics } from "../hooks/useStatistics";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ShoppingCart,
  Calendar,
  Target,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface StatsDashboardProps {
  receipts: Receipt[];
}

export const StatsDashboard = memo<StatsDashboardProps>(({ receipts }) => {
  const { summary, monthlyData, categoryData, dailyData, topExpenses } =
    useStatistics(receipts);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  };

  if (receipts.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-foreground text-2xl font-bold">📊 지출 통계</h2>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="text-muted-foreground mb-4 h-16 w-16" />
            <p className="text-muted-foreground text-lg">
              아직 영수증이 없습니다
            </p>
            <p className="text-muted-foreground text-sm">
              영수증을 추가하면 통계를 확인할 수 있습니다
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-foreground text-2xl font-bold">📊 지출 통계</h2>

      {/* 요약 카드들 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 지출</CardTitle>
            <Wallet className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.totalAmount)}
            </div>
            <p className="text-muted-foreground text-xs">
              {summary.totalCount}건의 영수증
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 지출</CardTitle>
            <Target className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.averageAmount)}
            </div>
            <p className="text-muted-foreground text-xs">건당 평균</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달</CardTitle>
            <Calendar className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary.thisMonthAmount)}
            </div>
            <p className="text-muted-foreground text-xs">
              {summary.thisMonthCount}건
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">월별 증감</CardTitle>
            {summary.monthlyGrowth >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                summary.monthlyGrowth >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatPercentage(summary.monthlyGrowth)}
            </div>
            <p className="text-muted-foreground text-xs">전월 대비</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 카테고리별 지출 */}
        <Card>
          <CardHeader>
            <CardTitle>카테고리별 지출</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((category, index) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {category.category}
                      </Badge>
                      <span className="text-muted-foreground text-sm">
                        {category.count}건
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatCurrency(category.amount)}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        {category.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="bg-muted h-2 overflow-hidden rounded-full">
                    <div
                      className="from-primary to-primary/80 h-full bg-gradient-to-r transition-all duration-500"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 최고 지출 내역 */}
        <Card>
          <CardHeader>
            <CardTitle>최고 지출 내역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topExpenses.map((receipt, index) => (
                <div
                  key={receipt.id}
                  className="bg-muted/50 flex items-center justify-between rounded-lg p-3"
                >
                  <div className="flex-1">
                    <div className="font-medium">{receipt.title}</div>
                    <div className="text-muted-foreground text-sm">
                      {receipt.storeName} • {receipt.category}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {receipt.date.toLocaleDateString("ko-KR")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {formatCurrency(receipt.amount)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      #{index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 월별 트렌드 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 6개월 지출 트렌드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((month, index) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{month.month}</span>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(month.amount)}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {month.count}건
                    </div>
                  </div>
                </div>
                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                    style={{
                      width: `${
                        (month.amount /
                          Math.max(...monthlyData.map((m) => m.amount))) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 최근 7일 일별 지출 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 7일 일별 지출</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {dailyData.map((day) => (
              <div
                key={day.date}
                className="bg-muted/50 hover:bg-muted rounded-lg p-3 text-center transition-colors"
              >
                <div className="text-muted-foreground mb-1 text-xs">
                  {day.date}
                </div>
                <div className="text-sm font-medium">
                  {day.amount > 0 ? formatCurrency(day.amount) : "-"}
                </div>
                <div className="text-muted-foreground text-xs">
                  {day.count > 0 ? `${day.count}건` : ""}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
