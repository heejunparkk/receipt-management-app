"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Header } from "../components/Header";
import { ReceiptList } from "../components/ReceiptList";
import { useReceipts } from "../hooks/useReceipts";
import { Receipt } from "../types/receipt";
import ReceiptFormModal from "../components/ReceiptFormModal";
import ReceiptDetailModal from "../components/ReceiptDetailModal";
import { StatsDashboard } from "../components/StatsDashboard";
import { Button } from "../components/ui/button";
import { ThemeProvider } from "../contexts/ThemeContext";
import ErrorBoundary from "../components/ErrorBoundary";
import ClientOnly from "../components/ClientOnly";

export default function HomePage() {
  const {
    receipts,
    loading,
    addReceipt,
    updateReceipt,
    deleteReceipt,
    importReceipts,
  } = useReceipts();

  // 모달 상태 관리
  const [formModalMode, setFormModalMode] = useState<"add" | "edit" | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // 탭 상태 관리
  const [activeTab, setActiveTab] = useState<"receipts" | "stats">("receipts");

  const handleAddReceipt = () => {
    setSelectedReceipt(null);
    setFormModalMode("add");
  };

  const handleEditReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setFormModalMode("edit");
  };

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsDetailModalOpen(true);
  };

  const handleDeleteReceipt = (id: string) => {
    deleteReceipt(id);
    toast.success("영수증이 삭제되었습니다.");
  };

  const handleFormSubmit = async (
    receiptData: Omit<Receipt, "id" | "createdAt" | "updatedAt">,
    id?: string
  ) => {
    const formData = {
      title: receiptData.title,
      amount: receiptData.amount,
      date: receiptData.date.toISOString().split("T")[0],
      category: receiptData.category,
      storeName: receiptData.storeName,
      description: receiptData.description,
      tags: receiptData.tags,
    };

    if (id) {
      // 수정 모드
      await updateReceipt(id, formData);
    } else {
      // 추가 모드
      await addReceipt(formData, receiptData.imageUrl);
    }

    setFormModalMode(null);
  };

  const handleDetailEdit = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsDetailModalOpen(false);
    setFormModalMode("edit");
  };

  const handleDetailDelete = (id: string) => {
    deleteReceipt(id);
    toast.success("영수증이 삭제되었습니다.");
    setIsDetailModalOpen(false);
    setSelectedReceipt(null);
  };

  const handleImportData = (importedReceipts: Receipt[]) => {
    const result = importReceipts(importedReceipts);
    if (result.skipped > 0) {
      toast.success(
        `${result.imported}개 영수증을 가져왔습니다. (${result.skipped}개 중복 제외)`
      );
    }
  };

  // 키보드 단축키
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl+N (Windows) 또는 Cmd+N (Mac): 새 영수증 추가
      if ((event.ctrlKey || event.metaKey) && event.key === "n") {
        event.preventDefault();
        handleAddReceipt();
      }

      // Ctrl+1: 영수증 목록 탭
      if ((event.ctrlKey || event.metaKey) && event.key === "1") {
        event.preventDefault();
        setActiveTab("receipts");
      }

      // Ctrl+2: 통계 탭
      if ((event.ctrlKey || event.metaKey) && event.key === "2") {
        event.preventDefault();
        setActiveTab("stats");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Loading Screen with premium animations
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 dark:from-slate-950 dark:via-blue-950/40 dark:to-indigo-950">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            {/* Premium spinner with multiple rings */}
            <div className="relative mx-auto mb-8 h-20 w-20">
              <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-800"></div>
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-indigo-500 dark:border-t-indigo-400"></div>
              <div className="absolute inset-2 animate-pulse rounded-full border-2 border-transparent border-r-purple-500 dark:border-r-purple-400"></div>
              <div
                className="absolute inset-4 animate-spin rounded-full border-2 border-transparent border-b-blue-500 dark:border-b-blue-400"
                style={{
                  animationDirection: "reverse",
                  animationDuration: "1.5s",
                }}
              ></div>
            </div>

            <div className="space-y-4">
              <h2 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-indigo-400 dark:to-purple-400">
                쓱싹
              </h2>
              <div className="space-y-2">
                <p className="font-medium text-slate-600 dark:text-slate-400">
                  영수증 데이터를 불러오는 중...
                </p>
                <div className="flex justify-center space-x-1">
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-purple-500"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ClientOnly
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 dark:from-slate-950 dark:via-blue-950/40 dark:to-indigo-950">
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
                <p className="text-muted-foreground">앱을 초기화하는 중...</p>
              </div>
            </div>
          </div>
        }
      >
        <ThemeProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50 dark:from-slate-950 dark:via-blue-950/40 dark:to-indigo-950">
            <Header
              title="쓱싹"
              onAddClick={handleAddReceipt}
              receipts={receipts}
              onImport={handleImportData}
            />
            <main>
              {/* 탭 네비게이션 */}
              <div className="container mx-auto px-4 py-4">
                <div className="flex space-x-1 border-b border-slate-200/60 backdrop-blur-sm dark:border-slate-800/60">
                  <Button
                    variant={activeTab === "receipts" ? "default" : "ghost"}
                    onClick={() => setActiveTab("receipts")}
                    className="rounded-b-none transition-all duration-200 hover:scale-105"
                    aria-label="영수증 목록 탭 (Ctrl+1)"
                    aria-pressed={activeTab === "receipts"}
                  >
                    📄 영수증 목록
                  </Button>
                  <Button
                    variant={activeTab === "stats" ? "default" : "ghost"}
                    onClick={() => setActiveTab("stats")}
                    className="rounded-b-none transition-all duration-200 hover:scale-105"
                    aria-label="지출 통계 탭 (Ctrl+2)"
                    aria-pressed={activeTab === "stats"}
                  >
                    📊 지출 통계
                  </Button>
                </div>
              </div>

              {/* 탭 콘텐츠 */}
              <div className="container mx-auto px-4">
                {activeTab === "receipts" ? (
                  <ReceiptList
                    receipts={receipts}
                    onEdit={handleEditReceipt}
                    onDelete={handleDeleteReceipt}
                    onView={handleViewReceipt}
                  />
                ) : (
                  <StatsDashboard receipts={receipts} />
                )}
              </div>
            </main>

            {/* 모달들 */}
            <ReceiptFormModal
              mode={formModalMode || "add"}
              isOpen={formModalMode !== null}
              onClose={() => setFormModalMode(null)}
              onSubmit={handleFormSubmit}
              receipt={selectedReceipt}
            />

            <ReceiptDetailModal
              isOpen={isDetailModalOpen}
              onClose={() => setIsDetailModalOpen(false)}
              receipt={selectedReceipt}
              onEdit={handleDetailEdit}
              onDelete={handleDetailDelete}
            />

            {/* Toast 알림 */}
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: "var(--color-background)",
                  color: "var(--color-foreground)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "12px",
                  fontWeight: "500",
                  backdropFilter: "blur(16px)",
                  boxShadow:
                    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
                },
                success: {
                  iconTheme: {
                    primary: "#10b981",
                    secondary: "#ffffff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#ffffff",
                  },
                },
              }}
            />
          </div>
        </ThemeProvider>
      </ClientOnly>
    </ErrorBoundary>
  );
}
