import React from "react";
import { Receipt } from "../types/receipt";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit2, Trash2, Store, Calendar } from "lucide-react";

interface ReceiptCardProps {
  receipt: Receipt;
  onEdit: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
  onView: (receipt: Receipt) => void;
}

export const ReceiptCard: React.FC<ReceiptCardProps> = ({
  receipt,
  onEdit,
  onDelete,
  onView,
}) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(amount);
  };

  return (
    <Card
      className="group cursor-pointer transition-all duration-500 hover:shadow-elegant-lg hover:-translate-y-3 hover:scale-105 animate-fade-in-up border-0 shadow-elegant bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm overflow-hidden relative"
      onClick={() => onView(receipt)}
    >
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-lg leading-none tracking-tight line-clamp-2 group-hover:text-primary transition-all duration-300 group-hover:scale-105 origin-left">
            {receipt.title}
          </h3>
          <Badge
            variant="secondary"
            className="ml-2 shrink-0 animate-slide-in-right shadow-sm group-hover:bg-primary/20 group-hover:text-primary group-hover:scale-110 transition-all duration-300"
          >
            {receipt.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 relative z-10">
        <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-all duration-300 group-hover:translate-x-1">
          <Store className="mr-2 h-4 w-4 text-primary/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
          <span className="truncate">{receipt.store}</span>
        </div>

        <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-all duration-300 group-hover:translate-x-1">
          <Calendar className="mr-2 h-4 w-4 text-primary/70 group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
          <span>{formatDate(receipt.date)}</span>
        </div>

        <div className="text-2xl font-bold text-success bg-gradient-to-r from-success to-success/80 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300 origin-left">
          {formatAmount(receipt.amount)}
        </div>

        {receipt.imageUrl && (
          <div className="mt-4 overflow-hidden rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300">
            <img
              src={receipt.imageUrl}
              alt={receipt.title}
              loading="lazy"
              className="w-full h-32 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            />
          </div>
        )}

        {receipt.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-all duration-300 group-hover:translate-x-1">
            {receipt.description}
          </p>
        )}
      </CardContent>

      <CardFooter className="pt-3 relative z-10">
        <div
          className="flex w-full gap-2 opacity-70 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            size="sm"
            className="flex-1 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200 hover:scale-105"
            onClick={() => onEdit(receipt)}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            수정
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="flex-1 hover:scale-110 hover:shadow-md transition-all duration-200"
            onClick={() => onDelete(receipt.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            삭제
          </Button>
        </div>
      </CardFooter>

      {/* 호버시 나타나는 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* 테두리 광선 효과 */}
      <div className="absolute inset-0 rounded-lg border border-primary/0 group-hover:border-primary/20 transition-all duration-500" />
    </Card>
  );
};
