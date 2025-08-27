import { useState, useEffect } from "react";
import { Receipt, ReceiptFormData } from "../types/receipt";

const STORAGE_KEY = "receipts";

export const useReceipts = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);

  // localStorage에서 영수증 데이터 로드
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedReceipts = JSON.parse(stored).map((receipt: any) => ({
          ...receipt,
          date: new Date(receipt.date),
          createdAt: new Date(receipt.createdAt),
          updatedAt: new Date(receipt.updatedAt),
        }));
        setReceipts(parsedReceipts);
      }
    } catch (error) {
      console.error("영수증 데이터를 불러오는데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // localStorage에 영수증 데이터 저장
  const saveToStorage = (updatedReceipts: Receipt[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReceipts));
    } catch (error) {
      console.error("영수증 데이터 저장에 실패했습니다:", error);
    }
  };

  // 영수증 추가
  const addReceipt = (formData: ReceiptFormData, imageUrl?: string) => {
    const newReceipt: Receipt = {
      id: Date.now().toString(),
      ...formData,
      date: new Date(formData.date),
      amount: Number(formData.amount),
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedReceipts = [...receipts, newReceipt];
    setReceipts(updatedReceipts);
    saveToStorage(updatedReceipts);
    return newReceipt;
  };

  // 영수증 수정
  const updateReceipt = (id: string, updates: Partial<ReceiptFormData>) => {
    const updatedReceipts = receipts.map((receipt) =>
      receipt.id === id
        ? {
            ...receipt,
            ...updates,
            date: updates.date ? new Date(updates.date) : receipt.date,
            amount: updates.amount ? Number(updates.amount) : receipt.amount,
            updatedAt: new Date(),
          }
        : receipt
    );
    setReceipts(updatedReceipts);
    saveToStorage(updatedReceipts);
  };

  // 영수증 삭제
  const deleteReceipt = (id: string) => {
    const updatedReceipts = receipts.filter((receipt) => receipt.id !== id);
    setReceipts(updatedReceipts);
    saveToStorage(updatedReceipts);
  };

  // 카테고리별 필터링
  const getReceiptsByCategory = (category: string) => {
    return receipts.filter((receipt) => receipt.category === category);
  };

  // 검색
  const searchReceipts = (query: string) => {
    return receipts.filter(
      (receipt) =>
        receipt.title.toLowerCase().includes(query.toLowerCase()) ||
        receipt.store.toLowerCase().includes(query.toLowerCase()) ||
        receipt.description?.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    receipts,
    loading,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    getReceiptsByCategory,
    searchReceipts,
  };
};
