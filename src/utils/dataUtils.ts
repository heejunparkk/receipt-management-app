import { Receipt } from "../types/receipt";

// JSON 형태로 데이터 내보내기
export const exportToJSON = (receipts: Receipt[]): void => {
  const dataStr = JSON.stringify(receipts, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `receipts_backup_${new Date().toISOString().split("T")[0]}.json`;
  link.click();

  // 메모리 정리
  URL.revokeObjectURL(link.href);
};

// CSV 형태로 데이터 내보내기
export const exportToCSV = (receipts: Receipt[]): void => {
  const headers = [
    "ID",
    "제목",
    "상점명",
    "금액",
    "날짜",
    "카테고리",
    "설명",
    "생성일",
    "수정일",
  ];

  const csvContent = [
    headers.join(","),
    ...receipts.map((receipt) =>
      [
        receipt.id,
        `"${receipt.title.replace(/"/g, '""')}"`,
        `"${receipt.storeName.replace(/"/g, '""')}"`,
        receipt.amount,
        receipt.date.toISOString().split("T")[0],
        `"${receipt.category}"`,
        `"${(receipt.description || "").replace(/"/g, '""')}"`,
        receipt.createdAt.toISOString(),
        receipt.updatedAt.toISOString(),
      ].join(",")
    ),
  ].join("\n");

  const dataBlob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `receipts_export_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();

  URL.revokeObjectURL(link.href);
};

// JSON 파일에서 데이터 가져오기
export const importFromJSON = (file: File): Promise<Receipt[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);

        // 데이터 유효성 검사
        if (!Array.isArray(jsonData)) {
          throw new Error("올바른 형식의 JSON 파일이 아닙니다.");
        }

        const receipts: Receipt[] = jsonData.map((item: any) => {
          if (
            !item.id ||
            !item.title ||
            !item.storeName ||
            !item.amount ||
            !item.date ||
            !item.category
          ) {
            throw new Error("필수 필드가 누락된 데이터가 있습니다.");
          }

          return {
            ...item,
            date: new Date(item.date),
            createdAt: new Date(item.createdAt || new Date()),
            updatedAt: new Date(item.updatedAt || new Date()),
            amount: Number(item.amount),
            description: item.description || "",
            imageUrl: item.imageUrl || "",
          };
        });

        resolve(receipts);
      } catch (error) {
        reject(new Error(`파일 읽기 실패: ${(error as Error).message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("파일을 읽을 수 없습니다."));
    };

    reader.readAsText(file);
  });
};

// 파일 유효성 검사
export const validateImportFile = (file: File): string | null => {
  // 파일 크기 제한 (10MB)
  if (file.size > 10 * 1024 * 1024) {
    return "파일 크기가 너무 큽니다. (최대 10MB)";
  }

  // JSON 파일만 허용
  if (!file.type.includes("json") && !file.name.endsWith(".json")) {
    return "JSON 파일만 가져올 수 있습니다.";
  }

  return null;
};

// 데이터 백업 생성
export const createBackup = (receipts: Receipt[]): string => {
  const backup = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    receipts: receipts,
    metadata: {
      total: receipts.length,
      categories: [...new Set(receipts.map((r) => r.category))],
      dateRange: {
        earliest: receipts.reduce(
          (earliest, r) => (r.date < earliest ? r.date : earliest),
          receipts[0]?.date || new Date()
        ),
        latest: receipts.reduce(
          (latest, r) => (r.date > latest ? r.date : latest),
          receipts[0]?.date || new Date()
        ),
      },
    },
  };

  return JSON.stringify(backup, null, 2);
};

// 백업에서 데이터 복원
export const restoreFromBackup = (backupData: string): Receipt[] => {
  try {
    const backup = JSON.parse(backupData);

    if (!backup.receipts || !Array.isArray(backup.receipts)) {
      throw new Error("올바른 백업 파일이 아닙니다.");
    }

    return backup.receipts.map((item: any) => ({
      ...item,
      date: new Date(item.date),
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      amount: Number(item.amount),
    }));
  } catch (error) {
    throw new Error(`백업 복원 실패: ${(error as Error).message}`);
  }
};
