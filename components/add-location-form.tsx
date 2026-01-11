'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Plus, CalendarIcon, Loader2, MapPin } from 'lucide-react';
import type { TripLocation } from '@/lib/types';

interface AddLocationFormProps {
  onAdd: (location: Omit<TripLocation, 'id' | 'order'>) => void;
}

export function AddLocationForm({ onAdd }: AddLocationFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [date, setDate] = useState<Date | undefined>();
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeocode = async () => {
    if (!name.trim()) return;
    
    setIsGeocoding(true);
    setError(null);
    
    try {
      // Use Nominatim for geocoding (free, no API key)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}&limit=1`,
        { headers: { 'User-Agent': 'TripPlotter/1.0' } }
      );
      const results = await response.json();
      
      if (results.length > 0) {
        setLat(results[0].lat);
        setLng(results[0].lon);
      } else {
        setError('Location not found. Please enter coordinates manually.');
      }
    } catch {
      setError('Failed to geocode. Please enter coordinates manually.');
    } finally {
      setIsGeocoding(false);
    }
  };

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
    setDate(undefined);
    setLat('');
    setLng('');
    setError(null);
    setOpen(false);
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
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Location Name</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Sapa Stone Church"
                className="flex-1"
              />
              <Button 
                variant="secondary" 
                onClick={handleGeocode}
                disabled={!name.trim() || isGeocoding}
                className="px-4"
              >
                {isGeocoding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Find'
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="lat" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Latitude</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="21.0285"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Longitude</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="105.8542"
                className="font-mono text-sm"
              />
            </div>
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
              <PopoverContent className="w-auto p-0">
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
