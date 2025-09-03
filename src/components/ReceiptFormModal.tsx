import React, { useEffect } from "react";
import { Plus, Edit, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { DatePicker } from "./ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Receipt } from "../types/receipt";
import { formatDateForInput } from "../lib/utils";
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

interface ReceiptFormModalProps {
  mode: "add" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: Omit<Receipt, "id" | "createdAt" | "updatedAt">,
    id?: string
  ) => void;
  receipt?: Receipt | null;
}

const ReceiptFormModal: React.FC<ReceiptFormModalProps> = ({
  mode,
  isOpen,
  onClose,
  onSubmit,
  receipt,
}) => {
  const methods = useForm({
    resolver: zodResolver(receiptSchema),
    defaultValues: {
      title: "",
      storeName: "",
      amount: 0,
      date: formatDateForInput(new Date()),
      category: "",
      description: "",
      imageUrl: "",
    },
  });

  const {
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { isSubmitting },
  } = methods;

  const watchedImageUrl = watch("imageUrl");

  // 모드나 영수증이 변경될 때 폼 데이터 초기화
  useEffect(() => {
    if (mode === "edit" && receipt) {
      reset({
        title: receipt.title,
        storeName: receipt.storeName,
        amount: receipt.amount,
        date: formatDateForInput(receipt.date),
        category: receipt.category,
        description: receipt.description || "",
        imageUrl: receipt.imageUrl || "",
      });
    } else if (mode === "add") {
      reset({
        title: "",
        storeName: "",
        amount: 0,
        date: formatDateForInput(new Date()),
        category: "",
        description: "",
        imageUrl: "",
      });
    }
  }, [mode, receipt, reset]);

  const handleFormSubmit = async (data: ReceiptFormData) => {
    try {
      const receiptData: Omit<Receipt, "id" | "createdAt" | "updatedAt"> = {
        title: data.title.trim(),
        storeName: data.storeName.trim(),
        amount: data.amount,
        date: new Date(data.date),
        category: data.category,
        description: data.description?.trim() || "",
        imageUrl: data.imageUrl || "",
      };

      if (mode === "edit" && receipt) {
        await onSubmit(receiptData, receipt.id);
        toast.success("영수증이 성공적으로 수정되었습니다!");
      } else {
        await onSubmit(receiptData);
        toast.success("영수증이 성공적으로 추가되었습니다!");
      }

      reset();
      onClose();
    } catch (error) {
      console.error(`영수증 ${mode === "edit" ? "수정" : "추가"} 실패:`, error);
      toast.error(
        `영수증 ${mode === "edit" ? "수정" : "추가"}에 실패했습니다. 다시 시도해주세요.`
      );
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

  const handleClose = () => {
    reset();
    onClose();
  };

  const isEditMode = mode === "edit";
  const title = isEditMode ? "영수증 수정" : "새 영수증 추가";
  const submitButtonText = isEditMode ? "영수증 수정" : "영수증 추가";
  const submitIcon = isEditMode ? Edit : Plus;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* 제목 */}
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>제목 *</FormLabel>
                  <FormControl>
                    <Input placeholder="영수증 제목을 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 상점명과 금액 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="storeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>상점명 *</FormLabel>
                    <FormControl>
                      <Input placeholder="상점명을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>금액 *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        step="100"
                        {...field}
                        value={
                          typeof field.value === "number" ? field.value : ""
                        }
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 날짜와 카테고리 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>날짜</FormLabel>
                    <FormControl>
                      <DatePicker
                        date={field.value ? new Date(field.value) : undefined}
                        onDateChange={(date) => {
                          field.onChange(date ? formatDateForInput(date) : "");
                        }}
                        placeholder="날짜를 선택하세요"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>카테고리 *</FormLabel>
                    <FormControl>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 설명 */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>설명</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="추가 설명을 입력하세요 (선택사항)"
                      rows={3}
                      className="focus:ring-primary border-border bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border-2 px-3 py-2 shadow-sm focus:border-transparent focus:ring-2 focus:outline-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 이미지 업로드 */}
            <FormField
              control={control}
              name="imageUrl"
              render={() => (
                <FormItem>
                  <FormLabel>영수증 이미지</FormLabel>
                  <FormControl>
                    <div>
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
                            id={`imageUpload-${mode}`}
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <label
                            htmlFor={`imageUpload-${mode}`}
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 버튼 */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
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
                    {isEditMode ? "수정 중..." : "추가 중..."}
                  </>
                ) : (
                  <>
                    {React.createElement(submitIcon, {
                      size: 16,
                      className: "mr-2",
                    })}
                    {submitButtonText}
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

export default ReceiptFormModal;
