import React from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  onAddClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onAddClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 animate-fade-in">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="group cursor-default">
            <h1 className="text-xl font-bold text-gradient animate-fade-in group-hover:scale-105 transition-all duration-300 origin-left">
              {title}
            </h1>
            <div className="h-0.5 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500 mt-1" />
          </div>
          <Button
            onClick={onAddClick}
            size="sm"
            className="group/btn relative overflow-hidden gap-2 shadow-elegant hover:shadow-elegant-lg hover:shadow-primary/25 hover:scale-110 active:scale-95 transition-all duration-300 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
            aria-label="영수증 추가"
          >
            <Plus className="h-4 w-4 group-hover/btn:rotate-180 transition-transform duration-500" />
            <span className="relative z-10">영수증 추가</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
          </Button>
        </div>
      </div>
    </header>
  );
};
