import React, { useState, useMemo, useCallback } from "react";
import { Receipt } from "../types/receipt";
import { ReceiptCard } from "./ReceiptCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Search, Calendar, DollarSign, ArrowUpDown } from "lucide-react";

interface ReceiptListProps {
  receipts: Receipt[];
  onEdit: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
  onView: (receipt: Receipt) => void;
}

export const ReceiptList: React.FC<ReceiptListProps> = ({
  receipts,
  onEdit,
  onDelete,
  onView,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const categories = ["전체", "식비", "교통비", "의료비", "쇼핑", "기타"];

  const filteredAndSortedReceipts = useMemo(() => {
    let filtered = [...receipts];

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(
        (receipt) =>
          receipt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          receipt.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          receipt.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 카테고리 필터
    if (selectedCategory !== "전체") {
      filtered = filtered.filter(
        (receipt) => receipt.category === selectedCategory
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        const comparison = a.date.getTime() - b.date.getTime();
        return sortOrder === "desc" ? -comparison : comparison;
      } else {
        const comparison = a.amount - b.amount;
        return sortOrder === "desc" ? -comparison : comparison;
      }
    });

    return filtered;
  }, [receipts, searchQuery, selectedCategory, sortBy, sortOrder]);

  const totalAmount = useMemo(
    () =>
      filteredAndSortedReceipts.reduce(
        (sum, receipt) => sum + receipt.amount,
        0
      ),
    [filteredAndSortedReceipts]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const handleSort = useCallback(
    (newSortBy: "date" | "amount") => {
      if (sortBy === newSortBy) {
        setSortOrder(sortOrder === "desc" ? "asc" : "desc");
      } else {
        setSortBy(newSortBy);
        setSortOrder("desc");
      }
    },
    [sortBy, sortOrder]
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 검색 및 필터 영역 */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          {/* 검색창 */}
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              type="text"
              placeholder="영수증 검색..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="shadow-elegant bg-card/50 hover:shadow-elegant-lg border-0 pl-10 backdrop-blur-sm transition-all duration-200 focus:scale-[1.02]"
            />
          </div>

          {/* 필터 및 정렬 */}
          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="shadow-elegant bg-card hover:shadow-elegant-lg w-[140px] border-0 backdrop-blur-sm transition-all duration-200">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent className="shadow-elegant-lg bg-popover border-border border backdrop-blur-xl">
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="hover:bg-primary/5 transition-colors duration-200"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("date")}
              className="shadow-elegant bg-card/50 hover:shadow-elegant-lg hover:bg-primary/5 gap-2 border-0 backdrop-blur-sm transition-all duration-200"
            >
              <Calendar className="h-4 w-4" />
              날짜순
              {sortBy === "date" && (
                <ArrowUpDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    sortOrder === "desc" ? "rotate-180" : ""
                  }`}
                />
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSort("amount")}
              className="shadow-elegant bg-card/50 hover:shadow-elegant-lg hover:bg-primary/5 gap-2 border-0 backdrop-blur-sm transition-all duration-200"
            >
              <DollarSign className="h-4 w-4" />
              금액순
              {sortBy === "amount" && (
                <ArrowUpDown
                  className={`h-4 w-4 transition-transform duration-200 ${
                    sortOrder === "desc" ? "rotate-180" : ""
                  }`}
                />
              )}
            </Button>
          </div>
        </div>

        {/* 요약 통계 */}
        <div className="text-muted-foreground bg-card/30 shadow-elegant animate-fade-in rounded-lg px-4 py-3 text-sm backdrop-blur-sm">
          총{" "}
          <span className="text-foreground font-semibold">
            {filteredAndSortedReceipts.length}
          </span>
          개의 영수증 • 합계:{" "}
          <span className="text-success font-semibold">
            {new Intl.NumberFormat("ko-KR", {
              style: "currency",
              currency: "KRW",
            }).format(totalAmount)}
          </span>
        </div>
      </div>

      {/* 영수증 목록 */}
      {filteredAndSortedReceipts.length === 0 ? (
        <div className="animate-fade-in py-12 text-center">
          <div className="bg-card/50 shadow-elegant rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-muted-foreground mb-2 text-lg">
              {receipts.length === 0
                ? "아직 등록된 영수증이 없습니다."
                : "검색 결과가 없습니다."}
            </p>
            <p className="text-muted-foreground text-sm">
              '+' 버튼을 눌러 첫 번째 영수증을 추가해보세요
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedReceipts.map((receipt, index) => (
            <div
              key={receipt.id}
              className={`animate-fade-in-up [animation-delay:${index * 100}ms]`}
            >
              <ReceiptCard
                receipt={receipt}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
