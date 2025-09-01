import React, { useEffect } from "react";
import { Edit, Upload, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Form } from "./ui/form";
import { DatePicker } from "./ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Receipt } from "../types/receipt";
import { cn, formatDateForInput } from "../lib/utils";
import {
  receiptSchema,
  categories,
  ReceiptFormData,
} from "../schemas/receiptSchema";
import {
  resizeImage,
  isValidImageFile,
  isValidFileSize,
} from "../utils/imageUtils";

interface ReceiptEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (
    id: string,
    receipt: Omit<Receipt, "id" | "createdAt" | "updatedAt">
  ) => void;
  receipt: Receipt | null;
}

const ReceiptEditModal: React.FC<ReceiptEditModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  receipt,
}) => {
  const methods = useForm({
    resolver: zodResolver(receiptSchema),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const watchedImageUrl = watch("imageUrl");

  // receipt가 변경될 때 폼 데이터 초기화
  useEffect(() => {
    if (receipt) {
      reset({
        title: receipt.title,
        storeName: receipt.storeName,
        amount: receipt.amount,
        date: formatDateForInput(receipt.date),
        category: receipt.category,
        description: receipt.description || "",
        imageUrl: receipt.imageUrl || "",
      });
    }
  }, [receipt, reset]);

  const onSubmit = async (data: ReceiptFormData) => {
    if (!receipt) return;

    try {
      const updatedReceipt: Omit<Receipt, "id" | "createdAt" | "updatedAt"> = {
        title: data.title.trim(),
        storeName: data.storeName.trim(),
        amount: data.amount,
        date: new Date(data.date),
        category: data.category,
        description: data.description?.trim() || "",
        imageUrl: data.imageUrl || "",
      };

      await onEdit(receipt.id, updatedReceipt);
      onClose();
    } catch (error) {
      console.error("영수증 수정 실패:", error);
      toast.error("영수증 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검사
    if (!isValidImageFile(file)) {
      toast.error("지원되지 않는 이미지 형식입니다. (JPEG, PNG, WebP만 지원)");
      return;
    }

    if (!isValidFileSize(file)) {
      toast.error("파일 크기가 너무 큽니다. (최대 5MB)");
      return;
    }

    try {
      // 이미지 리사이즈 및 Base64 변환
      const resizedImage = await resizeImage(file);
      setValue("imageUrl", resizedImage);
      toast.success("이미지가 업로드되었습니다!");
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      toast.error("이미지 업로드에 실패했습니다.");
    }
  };

  const removeImage = () => {
    setValue("imageUrl", "");
  };

  if (!receipt) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>영수증 수정</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 제목 */}
            <div>
              <label
                htmlFor="edit-title"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                제목 *
              </label>
              <Input
                id="edit-title"
                type="text"
                {...register("title")}
                placeholder="영수증 제목을 입력하세요"
                className={cn(
                  errors.title && "border-red-500 focus:border-red-500"
                )}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* 상점명과 금액 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="edit-storeName"
                  className="text-foreground mb-2 block text-sm font-medium"
                >
                  상점명 *
                </label>
                <Input
                  id="edit-storeName"
                  type="text"
                  {...register("storeName")}
                  placeholder="상점명을 입력하세요"
                  className={cn(
                    errors.storeName && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.storeName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.storeName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-amount"
                  className="text-foreground mb-2 block text-sm font-medium"
                >
                  금액 *
                </label>
                <Input
                  id="edit-amount"
                  type="number"
                  {...register("amount", { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                  step="100"
                  className={cn(
                    errors.amount && "border-red-500 focus:border-red-500"
                  )}
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.amount.message}
                  </p>
                )}
              </div>
            </div>

            {/* 날짜와 카테고리 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="text-foreground mb-2 block text-sm font-medium">
                  날짜
                </label>
                <DatePicker
                  date={watch("date") ? new Date(watch("date")) : undefined}
                  onDateChange={(date) => {
                    setValue("date", date ? formatDateForInput(date) : "");
                  }}
                  placeholder="날짜를 선택하세요"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-category"
                  className="text-foreground mb-2 block text-sm font-medium"
                >
                  카테고리 *
                </label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger
                          className={cn(
                            errors.category &&
                              "border-red-500 focus:border-red-500"
                          )}
                          onClick={(e) => e.stopPropagation()}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <SelectValue placeholder="카테고리를 선택하세요" />
                        </SelectTrigger>
                        <SelectContent
                          position="popper"
                          sideOffset={4}
                          onCloseAutoFocus={(e) => e.preventDefault()}
                          onEscapeKeyDown={(e) => e.stopPropagation()}
                        >
                          {categories.map((category) => (
                            <SelectItem
                              key={category}
                              value={category}
                              onSelect={() => field.onChange(category)}
                            >
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            {/* 설명 */}
            <div>
              <label
                htmlFor="edit-description"
                className="text-foreground mb-2 block text-sm font-medium"
              >
                설명
              </label>
              <textarea
                id="edit-description"
                {...register("description")}
                placeholder="추가 설명을 입력하세요 (선택사항)"
                rows={3}
                className="focus:ring-primary border-input bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border px-3 py-2 focus:border-transparent focus:ring-2 focus:outline-none"
              />
            </div>

            {/* 이미지 업로드 */}
            <div>
              <label className="text-foreground mb-2 block text-sm font-medium">
                영수증 이미지
              </label>

              {watchedImageUrl ? (
                <div className="space-y-3">
                  <div className="border-border relative overflow-hidden rounded-lg border">
                    <img
                      src={watchedImageUrl}
                      alt="업로드된 영수증"
                      className="h-48 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                      aria-label="이미지 제거"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-muted-foreground text-center text-xs">
                    영수증 이미지가 업로드되었습니다
                  </p>
                </div>
              ) : (
                <div className="hover:border-primary border-border rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                  <input
                    type="file"
                    id="edit-imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="edit-imageUpload"
                    className="flex cursor-pointer flex-col items-center space-y-2"
                  >
                    <Upload className="text-muted-foreground h-8 w-8" />
                    <div>
                      <p className="text-foreground text-sm">
                        <span className="text-primary font-medium">
                          클릭하여 업로드
                        </span>{" "}
                        또는
                      </p>
                      <p className="text-muted-foreground text-xs">
                        드래그 앤 드롭
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  onClose();
                }}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    수정 중...
                  </>
                ) : (
                  <>
                    <Edit size={16} className="mr-2" />
                    영수증 수정
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptEditModal;
