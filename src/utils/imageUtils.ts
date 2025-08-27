// 이미지 파일을 Base64로 변환
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// 이미지 리사이즈
export const resizeImage = (
  file: File,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      // 비율 계산
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      const width = img.width * ratio;
      const height = img.height * ratio;

      canvas.width = width;
      canvas.height = height;

      // 이미지 그리기
      ctx?.drawImage(img, 0, 0, width, height);

      // Base64로 변환
      resolve(canvas.toDataURL("image/jpeg", quality));
    };

    img.src = URL.createObjectURL(file);
  });
};

// 파일 타입 검증
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  return validTypes.includes(file.type);
};

// 파일 크기 검증 (5MB 제한)
export const isValidFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  return file.size <= maxSizeMB * 1024 * 1024;
};

// 카메라 지원 여부 확인
export const isCameraSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};
