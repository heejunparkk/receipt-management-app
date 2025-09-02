import React, { useRef } from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Plus, Upload, Menu, FileText, Database } from "lucide-react";
import toast from "react-hot-toast";
import { Receipt } from "../types/receipt";
import {
  exportToJSON,
  exportToCSV,
  importFromJSON,
  validateImportFile,
} from "../utils/dataUtils";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  title: string;
  onAddClick: () => void;
  receipts: Receipt[];
  onImport: (receipts: Receipt[]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onAddClick,
  receipts,
  onImport,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    exportToJSON(receipts);
    toast.success("JSON 파일로 내보내기 완료!");
  };

  const handleExportCSV = () => {
    exportToCSV(receipts);
    toast.success("CSV 파일로 내보내기 완료!");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImportFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      const importedReceipts = await importFromJSON(file);
      onImport(importedReceipts);
      toast.success(`${importedReceipts.length}개의 영수증을 가져왔습니다!`);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  return (
    <header className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 animate-fade-in sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* 테마 토글 */}
            <ThemeToggle />

            {/* 데이터 관리 드롭다운 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Menu className="h-4 w-4" />
                  데이터 관리
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleExportJSON} className="gap-2">
                  <Database className="h-4 w-4" />
                  JSON으로 내보내기
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportCSV} className="gap-2">
                  <FileText className="h-4 w-4" />
                  CSV로 내보내기
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleImportClick} className="gap-2">
                  <Upload className="h-4 w-4" />
                  데이터 가져오기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 숨겨진 파일 입력 */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
              aria-label="JSON 파일 가져오기"
            />

            {/* 영수증 추가 버튼 */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={onAddClick}
                    size="sm"
                    className="group/btn shadow-elegant hover:shadow-elegant-lg hover:shadow-primary/25 from-primary to-primary/80 hover:from-primary/90 hover:to-primary relative gap-2 overflow-hidden bg-gradient-to-r transition-all duration-300 hover:scale-110 active:scale-95"
                    aria-label="영수증 추가"
                  >
                    <Plus className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-90" />
                    <span className="relative z-10">영수증 추가</span>
                    <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover/btn:translate-x-[100%]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>새로운 영수증을 등록합니다</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </header>
  );
};
