'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Plus, CalendarIcon, Loader2, MapPin, Search } from 'lucide-react';
import type { TripLocation } from '@/lib/types';

interface PlaceSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  class: string;
}

interface AddLocationFormProps {
  onAdd: (location: Omit<TripLocation, 'id' | 'order'>) => void;
}

export function AddLocationForm({ onAdd }: AddLocationFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search for location suggestions
  const searchLocations = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
        { headers: { 'User-Agent': 'TripPlotter/1.0' } }
      );
      const results: PlaceSuggestion[] = await response.json();
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } catch {
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Handle search input change with debounce
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setError(null);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce the search
    searchTimeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion: PlaceSuggestion) => {
    // Extract a cleaner name from display_name (first part before comma)
    const cleanName = suggestion.display_name.split(',')[0].trim();
    setName(cleanName);
    setSearchQuery(suggestion.display_name);
    setLat(suggestion.lat);
    setLng(suggestion.lon);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = () => {
    if (!name.trim() || !lat || !lng) return;

    onAdd({
      name: name.trim(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      date: date ? format(date, 'yyyy-MM-dd') : undefined,
      activities: [],
    });

    // Reset form
    setName('');
    setSearchQuery('');
    setDate(undefined);
    setLat('');
    setLng('');
    setError(null);
    setSuggestions([]);
    setOpen(false);
  };

  // Format suggestion display - show type and truncate if needed
  const formatSuggestion = (suggestion: PlaceSuggestion) => {
    const parts = suggestion.display_name.split(',');
    const mainName = parts[0].trim();
    const secondary = parts.slice(1, 3).join(',').trim();
    return { mainName, secondary };
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted group-hover:bg-primary/10 transition-colors">
            <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Add location</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Add New Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 pt-2">
          {/* Search Input with Autocomplete */}
          <div className="space-y-2">
            <Label htmlFor="search" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Search Location</Label>
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  id="search"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                  placeholder="Search for a place..."
                  className="pl-10 pr-10"
                  autoComplete="off"
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
              </div>
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-50 w-full mt-1 bg-popover border border-border shadow-lg max-h-[240px] overflow-y-auto"
                >
                  {suggestions.map((suggestion) => {
                    const { mainName, secondary } = formatSuggestion(suggestion);
                    return (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        className="w-full px-3 py-2.5 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-b-0 flex items-start gap-3"
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        <MapPin className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{mainName}</p>
                          {secondary && (
                            <p className="text-xs text-muted-foreground truncate">{secondary}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Selected location indicator */}
            {name && lat && lng && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/10 px-3 py-2 rounded border border-primary/20">
                <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                <span className="truncate font-medium text-foreground">{name}</span>
                <span className="text-muted-foreground font-mono ml-auto">
                  {parseFloat(lat).toFixed(4)}, {parseFloat(lng).toFixed(4)}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Date (optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start font-normal">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  {date ? format(date, 'PPP') : <span className="text-muted-foreground">Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[200]">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button 
            onClick={handleSubmit} 
            className="w-full"
            disabled={!name.trim() || !lat || !lng}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
