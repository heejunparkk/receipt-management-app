import { useState, useRef, useCallback } from "react";

interface CameraHook {
  isActive: boolean;
  stream: MediaStream | null;
  error: string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  capturePhoto: () => Promise<string | null>;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

export const useCamera = (): CameraHook => {
  const [isActive, setIsActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      // 카메라 지원 확인
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          "카메라 접근이 제한되어 있습니다. 최신 브라우저나 HTTPS 연결을 사용해주세요."
        );
      }

      // 모바일에서 후면 카메라 우선 사용
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: "environment" }, // 후면 카메라
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream =
        await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // play() 호출을 안전하게 처리
        try {
          await videoRef.current.play();
        } catch (playError) {
          // AbortError는 무시하고 계속 진행
          if ((playError as Error).name !== "AbortError") {
            throw playError;
          }
        }
      }

      setStream(mediaStream);
      setIsActive(true);
    } catch (err) {
      console.error("카메라 접근 실패:", err);
      if ((err as Error).name === "NotAllowedError") {
        setError(
          "카메라 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요."
        );
      } else if ((err as Error).name === "NotFoundError") {
        setError(
          "카메라를 찾을 수 없습니다. 다른 앱에서 카메라를 사용 중일 수 있습니다."
        );
      } else {
        setError("카메라에 접근할 수 없습니다. 권한을 확인해주세요.");
      }
      setIsActive(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    setError(null);
  }, [stream]);

  const capturePhoto = useCallback(async (): Promise<string | null> => {
    if (!videoRef.current || !isActive) {
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas context를 생성할 수 없습니다.");
      }

      // 캔버스 크기를 비디오 크기에 맞춤
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 비디오 프레임을 캔버스에 그리기
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Base64 이미지로 변환
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      return imageData;
    } catch (err) {
      console.error("사진 촬영 실패:", err);
      setError("사진을 촬영할 수 없습니다.");
      return null;
    }
  }, [isActive]);

  return {
    isActive,
    stream,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    videoRef,
  };
};
