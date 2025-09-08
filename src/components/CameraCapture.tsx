import React, { useEffect } from "react";
import { useCamera } from "../hooks/useCamera";
import { Button } from "./ui/button";
import { X, Camera, RotateCcw } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onClose,
  isOpen,
}) => {
  const { isActive, error, startCamera, stopCamera, capturePhoto, videoRef } =
    useCamera();

  useEffect(() => {
    console.log(
      "CameraCapture useEffect - isOpen:",
      isOpen,
      "isActive:",
      isActive
    );

    if (isOpen && !isActive) {
      console.log("카메라 시작 시도");
      startCamera();
    } else if (!isOpen && isActive) {
      console.log("카메라 정지 시도");
      stopCamera();
    }

    // 컴포넌트 언마운트 시 카메라 정리
    return () => {
      if (isActive) {
        stopCamera();
      }
    };
  }, [isOpen, isActive, startCamera, stopCamera]);

  const handleCapture = async () => {
    console.log("촬영 버튼 클릭됨");
    alert("촬영 시도 중..."); // 디버깅용

    try {
      const imageData = await capturePhoto();
      console.log("capturePhoto 결과:", imageData ? "성공" : "실패");

      if (imageData) {
        alert("사진 촬영 성공!"); // 디버깅용
        onCapture(imageData);
        onClose();
      } else {
        alert("사진 촬영 실패"); // 디버깅용
      }
    } catch (error) {
      console.error("촬영 중 오류:", error);
      alert("촬영 중 오류 발생: " + error); // 디버깅용
    }
  };

  const handleRetry = () => {
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 100);
  };

  if (!isOpen) {
    console.log("CameraCapture - isOpen이 false라서 렌더링 안함");
    return null;
  }

  console.log(
    "🎥 CameraCapture 렌더링 시작! isOpen:",
    isOpen,
    "isActive:",
    isActive,
    "error:",
    error
  );

  return (
    <div
      className="fixed inset-0 bg-black"
      style={{
        zIndex: 99999, // 더 높은 z-index
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "black",
        pointerEvents: "auto", // 포인터 이벤트 활성화
      }}
      onClick={(e) => e.stopPropagation()} // 이벤트 전파 방지
      onTouchStart={(e) => e.stopPropagation()} // 터치 이벤트 전파 방지
    >
      {/* 헤더 */}
      <div className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between bg-black/50 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="h-6 w-6" />
        </Button>

        <h2 className="font-semibold text-white">영수증 촬영</h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleRetry}
          className="text-white hover:bg-white/20"
          disabled={!error}
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* 카메라 뷰 */}
      <div className="relative flex h-full w-full items-center justify-center">
        {error ? (
          <div className="p-6 text-center text-white">
            <div className="mb-4 text-red-400">⚠️</div>
            <p className="mb-4">{error}</p>
            <Button
              onClick={handleRetry}
              variant="outline"
              className="border-white text-white hover:bg-white/20"
            >
              다시 시도
            </Button>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              playsInline
              muted
              autoPlay
              controls={false}
              onLoadedMetadata={() => console.log("비디오 메타데이터 로드됨")}
              onCanPlay={() => console.log("비디오 재생 준비됨")}
            />

            {/* 영수증 가이드 프레임 */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* 가이드 프레임 */}
                <div className="relative h-96 w-80 rounded-lg border-2 border-white/50">
                  {/* 모서리 강조 */}
                  <div className="absolute -top-1 -left-1 h-6 w-6 rounded-tl-lg border-t-4 border-l-4 border-white"></div>
                  <div className="absolute -top-1 -right-1 h-6 w-6 rounded-tr-lg border-t-4 border-r-4 border-white"></div>
                  <div className="absolute -bottom-1 -left-1 h-6 w-6 rounded-bl-lg border-b-4 border-l-4 border-white"></div>
                  <div className="absolute -right-1 -bottom-1 h-6 w-6 rounded-br-lg border-r-4 border-b-4 border-white"></div>
                </div>

                {/* 가이드 텍스트 */}
                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 transform text-center text-white">
                  <p className="text-sm opacity-80">
                    영수증을 프레임 안에 맞춰주세요
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 하단 컨트롤 */}
      {isActive && !error && (
        <div className="absolute right-0 bottom-0 left-0 bg-black/50 p-6">
          <div className="flex items-center justify-center">
            <Button
              onClick={handleCapture}
              onTouchStart={(e) => {
                e.preventDefault();
                console.log("촬영 버튼 터치됨");
                handleCapture();
              }}
              className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-black hover:bg-gray-200"
              style={{
                touchAction: "manipulation",
                userSelect: "none",
                WebkitTouchCallout: "none",
                WebkitUserSelect: "none",
              }}
            >
              <Camera className="h-8 w-8" />
            </Button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-white opacity-80">
              영수증이 선명하게 보이도록 조명을 확인하세요
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
