import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Header } from "./components/Header";
import { ReceiptList } from "./components/ReceiptList";
import { useReceipts } from "./hooks/useReceipts";
import { Receipt } from "./types/receipt";
import ReceiptFormModal from "./components/ReceiptFormModal";
import ReceiptDetailModal from "./components/ReceiptDetailModal";
import { StatsDashboard } from "./components/StatsDashboard";
import { Button } from "./components/ui/button";

function App() {
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

  // loading이 항상 false이므로 이 조건은 실행되지 않음
  // 향후 API 호출 시를 대비해 유지
  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Header
          title="쓱싹"
          onAddClick={handleAddReceipt}
          receipts={receipts}
          onImport={handleImportData}
        />
        <main>
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
              <p className="text-muted-foreground">
                영수증 데이터를 불러오는 중...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <Header
        title="쓱싹"
        onAddClick={handleAddReceipt}
        receipts={receipts}
        onImport={handleImportData}
      />
      <main>
        {/* 탭 네비게이션 */}
        <div className="container mx-auto px-4 py-4">
          <div className="border-border flex space-x-1 border-b">
            <Button
              variant={activeTab === "receipts" ? "default" : "ghost"}
              onClick={() => setActiveTab("receipts")}
              className="rounded-b-none"
              aria-label="영수증 목록 탭 (Ctrl+1)"
              aria-pressed={activeTab === "receipts"}
            >
              📄 영수증 목록
            </Button>
            <Button
              variant={activeTab === "stats" ? "default" : "ghost"}
              onClick={() => setActiveTab("stats")}
              className="rounded-b-none"
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
    </div>
  );
}

export default App;
