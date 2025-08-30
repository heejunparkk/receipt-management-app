import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // 스크롤 방지
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // 배경 클릭 시 모달 닫기 (단순화)
  const handleBackdropClick = (e: React.MouseEvent) => {
    // 정확히 배경 오버레이를 클릭했는지 확인
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 모달 외부 클릭 감지 (Select 충돌 방지 개선)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // 모달 내부 클릭인지 확인
      if (modalRef.current && modalRef.current.contains(target)) {
        return;
      }

      // Radix UI Select 관련 요소들 확인 (더 포괄적)
      const selectElements = [
        "[data-radix-select-viewport]",
        "[data-radix-select-content]",
        "[data-radix-select-item]",
        "[data-radix-select-trigger]",
        "[data-radix-select-value]",
        "[data-radix-select-icon]",
        "[data-radix-popper-content]",
        "[data-radix-popper-content-wrapper]",
        "[data-radix-portal]",
        "[data-radix-collection-item]",
      ];

      // 클릭된 요소가 Select 관련 요소인지 확인
      for (const selector of selectElements) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          if (element.contains(target)) {
            return; // Select 관련 요소 클릭이면 모달을 닫지 않음
          }
        }
      }

      // 클릭된 요소 자체나 부모 요소가 data-radix 속성을 가지고 있는지 확인
      let currentElement: Element | null = target;
      while (currentElement) {
        // data-radix로 시작하는 모든 속성 확인
        const attributes = currentElement.getAttributeNames();
        for (const attr of attributes) {
          if (attr.startsWith("data-radix")) {
            return; // Radix UI 요소면 모달을 닫지 않음
          }
        }
        currentElement = currentElement.parentElement;
      }

      // 진짜 외부 클릭일 때만 모달 닫기
      onClose();
    };

    if (isOpen) {
      // 짧은 지연으로 Select 렌더링 후 이벤트 리스너 등록
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 150);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* 배경 오버레이 */}
      <div className="animate-fade-in fixed inset-0 bg-black/50 backdrop-blur-sm" />

      {/* 모달 컨테이너 */}
      <div
        ref={modalRef}
        className={cn(
          "shadow-elegant-lg animate-scale-in bg-card relative w-full rounded-2xl",
          sizeClasses[size],
          className
        )}
      >
        {/* 헤더 */}
        {(title || showCloseButton) && (
          <div className="border-border flex items-center justify-between border-b p-6 pb-4">
            {title && (
              <h2 className="text-card-foreground text-xl font-semibold">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors duration-200"
                aria-label="모달 닫기"
              >
                <X size={20} />
              </button>
            )}
          </div>
        )}

        {/* 컨텐츠 */}
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
