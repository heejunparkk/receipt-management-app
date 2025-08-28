import React from "react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  onAddClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onAddClick }) => {
  return (
    <header className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 animate-fade-in sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-foreground text-xl font-bold">{title}</h1>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={onAddClick}
                  size="sm"
                  className="group/btn shadow-elegant hover:shadow-elegant-lg hover:shadow-primary/25 from-primary to-primary/80 hover:from-primary/90 hover:to-primary relative gap-2 overflow-hidden bg-gradient-to-r transition-all duration-300 hover:scale-110 active:scale-95"
                  aria-label="영수증 추가"
                >
                  <Plus className="h-4 w-4 transition-transform duration-500 group-hover/btn:rotate-180" />
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
    </header>
  );
};
