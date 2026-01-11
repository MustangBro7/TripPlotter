'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  CalendarIcon, 
  Trash2, 
  MapPin,
  ChevronRight,
  Pencil,
  Check,
  X
} from 'lucide-react';
import type { TripLocation } from '@/lib/types';

interface LocationCardProps {
  location: TripLocation;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<TripLocation>) => void;
  onDelete: () => void;
}

export function LocationCard({
  location,
  index,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: LocationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(location.name);

  const handleSaveName = () => {
    if (editedName.trim()) {
      onUpdate({ name: editedName.trim() });
    } else {
      setEditedName(location.name);
    }
    setIsEditingName(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onUpdate({ date: format(date, 'yyyy-MM-dd') });
    }
  };

  const selectedDate = location.date ? parseISO(location.date) : undefined;

  return (
    <div
      className={`rounded-xl transition-all duration-200 ${
        isSelected 
          ? 'bg-primary/10 ring-1 ring-primary/30' 
          : 'bg-muted/30 hover:bg-muted/50'
      }`}
    >
      {/* Main row */}
      <div
        className="flex items-center gap-3 p-3 cursor-pointer"
        onClick={() => {
          onSelect();
          setIsExpanded(!isExpanded);
        }}
      >
        {/* Number badge */}
        <div className={`
          flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold flex-shrink-0 transition-colors
          ${isSelected 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground'
          }
        `}>
          {index + 1}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditingName ? (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="h-7 text-sm bg-background"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') {
                    setEditedName(location.name);
                    setIsEditingName(false);
                  }
                }}
              />
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={handleSaveName}>
                <Check className="h-3.5 w-3.5 text-green-500" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 w-7 p-0" 
                onClick={() => {
                  setEditedName(location.name);
                  setIsEditingName(false);
                }}
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group">
              <span className="font-medium text-sm truncate">{location.name}</span>
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
              >
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </Button>
            </div>
          )}
          
          {location.date && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(parseISO(location.date), 'EEE, MMM d')}
            </p>
          )}
        </div>

        {/* Expand indicator */}
        <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 pt-0 space-y-3">
          {/* Coordinates */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 rounded-lg px-3 py-2">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
            <span className="font-mono">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 text-xs flex-1 justify-start">
                  <CalendarIcon className="h-3.5 w-3.5 mr-2" />
                  {location.date ? format(parseISO(location.date), 'MMM d, yyyy') : 'Set date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Activities */}
          {location.activities.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Activities</p>
              <div className="flex flex-wrap gap-1.5">
                {location.activities.map((activity, i) => (
                  <span 
                    key={i} 
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
