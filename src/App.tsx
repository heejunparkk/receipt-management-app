import { useState } from "react";
import toast from "react-hot-toast";
import { Header } from "./components/Header";
import { ReceiptList } from "./components/ReceiptList";
import { useReceipts } from "./hooks/useReceipts";
import { Receipt } from "./types/receipt";
import ReceiptAddModal from "./components/ReceiptAddModal";
import ReceiptEditModal from "./components/ReceiptEditModal";
import ReceiptDetailModal from "./components/ReceiptDetailModal";

function App() {
  const { receipts, loading, addReceipt, updateReceipt, deleteReceipt } =
    useReceipts();

  // 모달 상태 관리
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  const handleAddReceipt = () => {
    setIsAddModalOpen(true);
  };

  const handleEditReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsEditModalOpen(true);
  };

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsDetailModalOpen(true);
  };

  const handleDeleteReceipt = (id: string) => {
    deleteReceipt(id);
    toast.success("영수증이 삭제되었습니다.");
  };

  const handleAddSubmit = async (
    receiptData: Omit<Receipt, "id" | "createdAt" | "updatedAt">
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
    await addReceipt(formData, receiptData.imageUrl);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = async (
    id: string,
    receiptData: Omit<Receipt, "id" | "createdAt" | "updatedAt">
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
    await updateReceipt(id, formData);
    toast.success("영수증이 수정되었습니다!");
    setIsEditModalOpen(false);
    setSelectedReceipt(null);
  };

  const handleDetailEdit = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDetailDelete = (id: string) => {
    deleteReceipt(id);
    toast.success("영수증이 삭제되었습니다.");
    setIsDetailModalOpen(false);
    setSelectedReceipt(null);
  };

  // loading이 항상 false이므로 이 조건은 실행되지 않음
  // 향후 API 호출 시를 대비해 유지
  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Header title="쓱싹" onAddClick={handleAddReceipt} />
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
      <Header title="쓱싹" onAddClick={handleAddReceipt} />
      <main>
        <ReceiptList
          receipts={receipts}
          onEdit={handleEditReceipt}
          onDelete={handleDeleteReceipt}
          onView={handleViewReceipt}
        />
      </main>

      {/* 모달들 */}
      <ReceiptAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSubmit}
      />

      <ReceiptEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onEdit={handleEditSubmit}
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
