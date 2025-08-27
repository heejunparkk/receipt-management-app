import { useState } from "react";
import { Header } from "./components/Header";
import { ReceiptList } from "./components/ReceiptList";
import { useReceipts } from "./hooks/useReceipts";
import { Receipt } from "./types/receipt";

function App() {
  const { receipts, loading, deleteReceipt } = useReceipts();
  const [, setSelectedReceipt] = useState<Receipt | null>(null);

  const handleAddReceipt = () => {
    // TODO: 영수증 추가 모달 열기
    console.log("영수증 추가");
  };

  const handleEditReceipt = (receipt: Receipt) => {
    // TODO: 영수증 편집 모달 열기
    console.log("영수증 편집:", receipt);
  };

  const handleViewReceipt = (receipt: Receipt) => {
    setSelectedReceipt(receipt);
    console.log("영수증 상세보기:", receipt);
  };

  const handleDeleteReceipt = (id: string) => {
    if (confirm("정말 이 영수증을 삭제하시겠습니까?")) {
      deleteReceipt(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">
            영수증 데이터를 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="영수증 관리 앱" onAddClick={handleAddReceipt} />
      <main>
        <ReceiptList
          receipts={receipts}
          onEdit={handleEditReceipt}
          onDelete={handleDeleteReceipt}
          onView={handleViewReceipt}
        />
      </main>
    </div>
  );
}

export default App;
