'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { FileText, Copy, Check, Loader2, RefreshCw } from 'lucide-react';
import { useItineraryCache } from '@/hooks/use-itinerary-cache';
import type { Trip } from '@/lib/types';

interface ItineraryModalProps {
  trip: Trip;
}

export function ItineraryModal({ trip }: ItineraryModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isGenerating, generatedItinerary, generateItinerary, clearCache } = useItineraryCache();
  const [error, setError] = useState<string | null>(null);

  const handleOpen = async (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !generatedItinerary && !isGenerating) {
      try {
        setError(null);
        await generateItinerary(trip);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate itinerary');
      }
    }
  };

  const handleRegenerate = async () => {
    clearCache(trip);
    setError(null);
    try {
      await generateItinerary(trip);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate itinerary');
    }
  };

  const handleCopy = async () => {
    if (!generatedItinerary) return;
    
    try {
      await navigator.clipboard.writeText(generatedItinerary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = generatedItinerary;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Simple markdown to HTML conversion
  const renderMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-base font-semibold mt-5 mb-2 text-foreground">{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-lg font-bold mt-6 mb-3 text-foreground">{line.slice(3)}</h2>;
        }
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-xl font-bold mt-6 mb-4 text-foreground">{line.slice(2)}</h1>;
        }
        // Bold
        const boldProcessed = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
        // List items
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li 
              key={i} 
              className="ml-5 list-disc text-muted-foreground marker:text-primary"
              dangerouslySetInnerHTML={{ __html: boldProcessed.slice(2) }}
            />
          );
        }
        // Numbered lists
        const numberedMatch = line.match(/^(\d+)\.\s/);
        if (numberedMatch) {
          return (
            <li 
              key={i} 
              className="ml-5 list-decimal text-muted-foreground marker:text-primary marker:font-semibold"
              dangerouslySetInnerHTML={{ __html: boldProcessed.slice(numberedMatch[0].length) }}
            />
          );
        }
        // Empty lines
        if (!line.trim()) {
          return <div key={i} className="h-3" />;
        }
        // Regular paragraphs
        return (
          <p 
            key={i} 
            className="text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: boldProcessed }}
          />
        );
      });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-2 h-9 px-3">
          <FileText className="h-4 w-4" />
          <span className="hidden sm:inline">Itinerary</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center justify-between pr-8">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Your Itinerary
            </span>
            {generatedItinerary && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="h-8 px-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="h-8 px-2"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                <Loader2 className="h-10 w-10 animate-spin text-primary relative" />
              </div>
              <p className="text-muted-foreground text-sm">Crafting your perfect itinerary...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <p className="text-destructive text-sm">{error}</p>
              <Button variant="outline" size="sm" onClick={handleRegenerate}>
                Try Again
              </Button>
            </div>
          ) : generatedItinerary ? (
            <div className="text-sm space-y-1 pb-4">
              {renderMarkdown(generatedItinerary)}
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
