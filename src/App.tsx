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

  // loading이 항상 false이므로 이 조건은 실행되지 않음
  // 향후 API 호출 시를 대비해 유지
  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <Header title="영수증 관리 앱" onAddClick={handleAddReceipt} />
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
