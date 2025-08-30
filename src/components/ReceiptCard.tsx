import { memo } from "react";
import { Receipt } from "../types/receipt";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Edit2, Trash2, Store, Calendar } from "lucide-react";
import { formatCurrency, formatDateShort } from "../lib/utils";

interface ReceiptCardProps {
  receipt: Receipt;
  onEdit: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
  onView: (receipt: Receipt) => void;
}

export const ReceiptCard = memo<ReceiptCardProps>(
  ({ receipt, onEdit, onDelete, onView }) => {
    return (
      <Card
        className="group hover:shadow-elegant-lg animate-fade-in-up shadow-elegant from-card/90 to-card/60 relative cursor-pointer overflow-hidden border-0 bg-gradient-to-br backdrop-blur-sm transition-all duration-500 hover:-translate-y-3 hover:scale-105"
        onClick={() => onView(receipt)}
      >
        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-start justify-between">
            <h3 className="group-hover:text-primary line-clamp-2 origin-left text-lg leading-none font-semibold tracking-tight transition-all duration-300 group-hover:scale-105">
              {receipt.title}
            </h3>
            <Badge
              variant="secondary"
              className="animate-slide-in-right group-hover:bg-primary/20 group-hover:text-primary ml-2 shrink-0 shadow-sm transition-all duration-300 group-hover:scale-110"
            >
              {receipt.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 space-y-3">
          <div className="text-muted-foreground group-hover:text-foreground flex items-center text-sm transition-all duration-300 group-hover:translate-x-1">
            <Store className="text-primary/70 group-hover:text-primary mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-110" />
            <span className="truncate">{receipt.storeName}</span>
          </div>

          <div className="text-muted-foreground group-hover:text-foreground flex items-center text-sm transition-all duration-300 group-hover:translate-x-1">
            <Calendar className="text-primary/70 group-hover:text-primary mr-2 h-4 w-4 transition-all duration-300 group-hover:scale-110" />
            <span>{formatDateShort(receipt.date)}</span>
          </div>

          <div className="from-success to-success/80 origin-left bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent transition-transform duration-300 group-hover:scale-110">
            {formatCurrency(receipt.amount)}
          </div>

          {receipt.imageUrl && (
            <div className="mt-4 overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:shadow-lg">
              <img
                src={receipt.imageUrl}
                alt={receipt.title}
                loading="lazy"
                className="h-32 w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
              />
            </div>
          )}

          {receipt.description && (
            <p className="text-muted-foreground group-hover:text-foreground line-clamp-2 text-sm transition-all duration-300 group-hover:translate-x-1">
              {receipt.description}
            </p>
          )}
        </CardContent>

        <CardFooter className="relative z-10 pt-3">
          <TooltipProvider>
            <div
              className="flex w-full translate-y-1 transform gap-2 opacity-70 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary/10 hover:border-primary/30 hover:text-primary flex-1 transition-all duration-200 hover:scale-105"
                    onClick={() => onEdit(receipt)}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    수정
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>영수증 정보를 수정합니다</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1 transition-all duration-200 hover:scale-110 hover:shadow-md"
                    onClick={() => onDelete(receipt.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    삭제
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>영수증을 영구적으로 삭제합니다</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </CardFooter>

        {/* 호버시 나타나는 배경 그라데이션 */}
        <div className="from-primary/5 to-primary/10 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* 테두리 광선 효과 */}
        <div className="border-primary/0 group-hover:border-primary/20 absolute inset-0 rounded-lg border transition-all duration-500" />
      </Card>
    );
  }
);
