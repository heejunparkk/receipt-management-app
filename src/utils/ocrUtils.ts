// OCR 결과 타입 정의
export interface OCRResult {
  text: string;
  confidence: number;
}

export interface ParsedReceiptData {
  storeName: string;
  amount: number;
  date: string;
  items: string[];
  category: string;
}

// 간단한 클라이언트 사이드 OCR (Tesseract.js 사용 예정)
export const extractTextFromImage = async (
  _imageData: string
): Promise<OCRResult> => {
  try {
    // TODO: 실제 OCR 라이브러리 통합 (Tesseract.js 등)
    // const { createWorker } = await import('tesseract.js');
    // const worker = await createWorker('kor+eng');
    // const { data: { text, confidence } } = await worker.recognize(imageData);
    // await worker.terminate();

    // 임시 모의 OCR 결과 (개발용)
    const mockText = `
      롯데마트 본점
      2024-01-15 14:30:25
      바나나          3,000원
      우유 1L        2,500원
      계란 10개      4,800원
      ─────────────────
      합계          10,300원
      카드결제      10,300원
    `;

    return {
      text: mockText.trim(),
      confidence: 0.85,
    };
  } catch (error) {
    console.error("OCR 처리 실패:", error);
    throw new Error("텍스트 추출에 실패했습니다.");
  }
};

// 영수증 텍스트에서 구조화된 데이터 추출
export const parseReceiptText = (text: string): Partial<ParsedReceiptData> => {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const result: Partial<ParsedReceiptData> = {
    items: [],
  };

  // 상호명 추출 (첫 번째 줄 또는 특정 패턴)
  const storePatterns = [
    /^(.+?)(?:점|마트|마켓|스토어|샵)/,
    /^(.+?)(?:본점|지점)/,
  ];

  for (const line of lines.slice(0, 3)) {
    for (const pattern of storePatterns) {
      const match = line.match(pattern);
      if (match) {
        result.storeName = match[1].trim();
        break;
      }
    }
    if (result.storeName) break;
  }

  // 날짜 추출
  const datePatterns = [
    /(\d{4})[-./](\d{1,2})[-./](\d{1,2})/,
    /(\d{2})[-./](\d{1,2})[-./](\d{1,2})/,
  ];

  for (const line of lines) {
    for (const pattern of datePatterns) {
      const match = line.match(pattern);
      if (match) {
        const [, year, month, day] = match;
        // 2자리 연도를 4자리로 변환
        const fullYear = year.length === 2 ? `20${year}` : year;
        result.date = `${fullYear}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        break;
      }
    }
    if (result.date) break;
  }

  // 총 금액 추출
  const amountPatterns = [
    /(?:합계|총액|total|계)\s*[:\s]*([0-9,]+)원?/i,
    /([0-9,]+)원?\s*(?:합계|총액|total)/i,
  ];

  for (const line of lines) {
    for (const pattern of amountPatterns) {
      const match = line.match(pattern);
      if (match) {
        const amountStr = match[1].replace(/,/g, "");
        const amount = parseInt(amountStr, 10);
        if (!isNaN(amount) && amount > 0) {
          result.amount = amount;
          break;
        }
      }
    }
    if (result.amount) break;
  }

  // 상품 목록 추출
  const itemPattern = /(.+?)\s+([0-9,]+)원/;
  for (const line of lines) {
    const match = line.match(itemPattern);
    if (match && !line.match(/합계|총액|total|카드|현금|결제/i)) {
      const itemName = match[1].trim();
      if (itemName.length > 0) {
        result.items!.push(itemName);
      }
    }
  }

  // 카테고리 추정
  result.category = estimateCategory(
    result.items || [],
    result.storeName || ""
  );

  return result;
};

// 상품명과 상호명으로 카테고리 추정
const estimateCategory = (items: string[], storeName: string): string => {
  const categoryKeywords = {
    식료품: [
      "마트",
      "마켓",
      "슈퍼",
      "우유",
      "계란",
      "빵",
      "과일",
      "채소",
      "육류",
      "생선",
    ],
    외식: ["레스토랑", "카페", "치킨", "피자", "버거", "커피", "음료"],
    교통: [
      "주유소",
      "GS칼텍스",
      "SK에너지",
      "현대오일뱅크",
      "버스",
      "지하철",
      "택시",
    ],
    쇼핑: ["백화점", "아울렛", "의류", "신발", "가방", "화장품"],
    의료: ["병원", "약국", "클리닉", "한의원"],
    문화: ["영화관", "서점", "박물관", "공연"],
  };

  const allText = `${storeName} ${items.join(" ")}`.toLowerCase();

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => allText.includes(keyword.toLowerCase()))) {
      return category;
    }
  }

  return "기타";
};

// OCR 신뢰도 검증
export const validateOCRResult = (result: OCRResult): boolean => {
  return result.confidence > 0.7 && result.text.length > 10;
};
