'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { GripHorizontal } from 'lucide-react';

interface BottomSheetProps {
  children: React.ReactNode;
  minHeight?: number;
  peekHeight?: number;
  maxHeight?: string;
}

export function BottomSheet({ 
  children, 
  minHeight = 80,
  peekHeight = 280,
  maxHeight = '85vh'
}: BottomSheetProps) {
  const [sheetHeight, setSheetHeight] = useState(peekHeight);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startHeight = useRef(0);

  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    startY.current = clientY;
    startHeight.current = sheetHeight;
  }, [sheetHeight]);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    
    const deltaY = startY.current - clientY;
    const newHeight = Math.max(minHeight, startHeight.current + deltaY);
    const maxPx = window.innerHeight * 0.85;
    setSheetHeight(Math.min(newHeight, maxPx));
  }, [isDragging, minHeight]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const maxPx = window.innerHeight * 0.85;
    const threshold = maxPx * 0.3;
    
    // Snap to positions
    if (sheetHeight < threshold) {
      setSheetHeight(minHeight);
    } else if (sheetHeight < maxPx * 0.6) {
      setSheetHeight(peekHeight);
    } else {
      setSheetHeight(maxPx);
    }
  }, [isDragging, sheetHeight, minHeight, peekHeight]);

  // Mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const handleMouseUp = () => handleDragEnd();

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  const isExpanded = sheetHeight > peekHeight + 50;
  const isMinimized = sheetHeight <= minHeight + 20;

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 z-30 bg-background rounded-t-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.3)] transition-[height] will-change-[height]"
      style={{ 
        height: sheetHeight,
        transitionDuration: isDragging ? '0ms' : '300ms',
      }}
    >
      {/* Drag Handle */}
      <div
        className="flex items-center justify-center py-3 cursor-grab active:cursor-grabbing touch-none select-none"
        onMouseDown={(e) => handleDragStart(e.clientY)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-12 h-1.5 rounded-full bg-muted-foreground/30" />
      </div>

      {/* Content */}
      <div 
        className="overflow-y-auto overscroll-contain px-1"
        style={{ height: `calc(100% - 40px)` }}
      >
        {children}
      </div>

      {/* Quick actions bar when minimized */}
      {isMinimized && (
        <div className="absolute inset-x-0 top-10 px-4 flex items-center gap-3">
          <GripHorizontal className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Swipe up to view trip details</span>
        </div>
      )}
    </div>
  );
}
