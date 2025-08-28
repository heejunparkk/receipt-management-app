import React from "react";
import { Plus, Upload, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
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

interface ReceiptAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (receipt: Omit<Receipt, "id" | "createdAt" | "updatedAt">) => void;
}

const ReceiptAddModal: React.FC<ReceiptAddModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const methods = useForm<ReceiptFormData>({
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
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = methods;

  const watchedImageUrl = watch("imageUrl");

  const onSubmit = async (data: ReceiptFormData) => {
    try {
      const newReceipt: Omit<Receipt, "id" | "createdAt" | "updatedAt"> = {
        title: data.title.trim(),
        storeName: data.storeName.trim(),
        amount: data.amount,
        date: new Date(data.date),
        category: data.category,
        description: data.description?.trim() || "",
        imageUrl: data.imageUrl || "",
      };

      await onAdd(newReceipt);

      toast.success("영수증이 성공적으로 추가되었습니다!");
      reset();
      onClose();
    } catch (error) {
      console.error("영수증 추가 실패:", error);
      toast.error("영수증 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 실제 구현에서는 이미지 업로드 API 호출
      // 현재는 임시로 파일명만 저장
      setValue("imageUrl", file.name);
      toast.success("이미지가 업로드되었습니다!");
    }
  };

  const removeImage = () => {
    setValue("imageUrl", "");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>새 영수증 추가</DialogTitle>
        </DialogHeader>
        <Form {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <div>
                <label
                  htmlFor="date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  날짜
                </label>
                <Input id="date" type="date" {...register("date")} />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-gray-700"
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
                          onPointerDownOutside={(e) => e.preventDefault()}
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
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                설명
              </label>
              <textarea
                id="description"
                {...register("description")}
                placeholder="추가 설명을 입력하세요 (선택사항)"
                rows={3}
                className="focus:ring-primary w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-transparent focus:ring-2 focus:outline-none"
              />
            </div>

            {/* 이미지 업로드 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                영수증 이미지
              </label>

              {watchedImageUrl ? (
                <div className="flex items-center space-x-3 rounded-lg border border-gray-300 bg-gray-50 p-3">
                  <div className="flex-1">
                    <p className="truncate text-sm text-gray-600">
                      {watchedImageUrl}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-1 text-gray-400 transition-colors hover:text-red-500"
                    aria-label="이미지 제거"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="hover:border-primary rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors">
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="flex cursor-pointer flex-col items-center space-y-2"
                  >
                    <Upload className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="text-primary font-medium">
                          클릭하여 업로드
                        </span>{" "}
                        또는
                      </p>
                      <p className="text-xs text-gray-500">드래그 앤 드롭</p>
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
                    추가 중...
                  </>
                ) : (
                  <>
                    <Plus size={16} className="mr-2" />
                    영수증 추가
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

export default ReceiptAddModal;
