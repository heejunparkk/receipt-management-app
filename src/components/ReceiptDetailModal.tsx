import React from "react";
import {
  Edit,
  Trash2,
  Calendar,
  Store,
  Tag,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Receipt } from "../types/receipt";
import { formatCurrency, formatDate } from "../lib/utils";

interface ReceiptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Receipt | null;
  onEdit: (receipt: Receipt) => void;
  onDelete: (id: string) => void;
}

const ReceiptDetailModal: React.FC<ReceiptDetailModalProps> = ({
  isOpen,
  onClose,
  receipt,
  onEdit,
  onDelete,
}) => {
  if (!receipt) return null;

  const handleEdit = () => {
    onEdit(receipt);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("정말로 이 영수증을 삭제하시겠습니까?")) {
      onDelete(receipt.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>영수증 상세정보</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* 이미지 섹션 */}
          {receipt.imageUrl ? (
            <div className="relative">
              <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={receipt.imageUrl}
                  alt={`${receipt.title} 영수증 이미지`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const errorDiv = target.nextElementSibling as HTMLElement;
                    if (errorDiv) {
                      errorDiv.classList.remove("hidden");
                      errorDiv.classList.add("flex");
                    }
                  }}
                />
                <div className="absolute inset-0 hidden items-center justify-center bg-gray-100">
                  <div className="text-center text-gray-500">
                    <ImageIcon className="mx-auto mb-2 h-16 w-16 text-gray-400" />
                    <p className="text-sm">이미지를 불러올 수 없습니다</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50">
              <div className="text-center text-gray-500">
                <ImageIcon className="mx-auto mb-2 h-16 w-16 text-gray-400" />
                <p className="text-sm">이미지가 없습니다</p>
              </div>
            </div>
          )}

          {/* 기본 정보 */}
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                {receipt.title}
              </h3>
              <div className="text-primary text-3xl font-bold">
                {formatCurrency(receipt.amount)}
              </div>
            </div>

            {/* 정보 그리드 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                <Store className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">상점명</p>
                  <p className="font-medium text-gray-900">
                    {receipt.storeName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">날짜</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(receipt.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                <Tag className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">카테고리</p>
                  <Badge variant="secondary" className="mt-1">
                    {receipt.category}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
                <FileText className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">생성일</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(receipt.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* 설명 */}
            {receipt.description && (
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <h4 className="mb-2 font-medium text-blue-900">설명</h4>
                <p className="text-blue-800">{receipt.description}</p>
              </div>
            )}

            {/* 메타 정보 */}
            <div className="border-t border-gray-100 py-2 text-center text-xs text-gray-500">
              영수증 ID: {receipt.id}
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-end space-x-3 border-t border-gray-100 pt-4">
            <Button variant="outline" onClick={onClose}>
              닫기
            </Button>
            <Button
              variant="outline"
              onClick={handleEdit}
              className="border-blue-200 text-blue-700 hover:bg-blue-50"
            >
              <Edit size={16} className="mr-2" />
              수정
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} className="mr-2" />
              삭제
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDetailModal;
