'use client';

import { useState, useEffect } from 'react';
import type { Amenity, PropertyType } from '@/types/hotel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RotateCcw } from 'lucide-react';

interface FiltersProps {
  priceRange: { min: number; max: number };
  onFilterChange: (filters: {
    priceMin?: number;
    priceMax?: number;
    starRating?: number[];
    amenities?: Amenity[];
    propertyType?: PropertyType[];
  }) => void;
}

export function Filters({ priceRange, onFilterChange }: FiltersProps) {
  const [priceMin, setPriceMin] = useState(priceRange.min);
  const [priceMax, setPriceMax] = useState(priceRange.max);
  const [starRating, setStarRating] = useState<number[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [propertyType, setPropertyType] = useState<PropertyType[]>([]);

  const amenitiesList: Amenity[] = ['WiFi', 'Pool', 'Parking', 'AC', 'Gym', 'Spa', 'Restaurant', 'Bar'];
  const propertyTypes: PropertyType[] = ['Hotel', 'Resort', 'Apartment'];

  useEffect(() => {
    onFilterChange({ priceMin, priceMax, starRating, amenities, propertyType });
  }, [priceMin, priceMax, starRating, amenities, propertyType, onFilterChange]);

  const toggleStarRating = (rating: number) => {
    setStarRating(prev => prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]);
  };

  const toggleAmenity = (amenity: Amenity) => {
    setAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };

  const togglePropertyType = (type: PropertyType) => {
    setPropertyType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const handleReset = () => {
    setPriceMin(priceRange.min);
    setPriceMax(priceRange.max);
    setStarRating([]);
    setAmenities([]);
    setPropertyType([]);
  };

  const hasActiveFilters = starRating.length > 0 || amenities.length > 0 || propertyType.length > 0 || 
    priceMin !== priceRange.min || priceMax !== priceRange.max;

  return (
    <Card className="sticky top-24 border-2 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <Label className="text-base font-semibold">
            Price Range
          </Label>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Min: ${priceMin}</span>
              <span className="text-muted-foreground">Max: ${priceMax}</span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={priceMin}
                onChange={(e) => setPriceMin(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <input
                type="range"
                min={priceRange.min}
                max={priceRange.max}
                value={priceMax}
                onChange={(e) => setPriceMax(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Star Rating</Label>
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3].map(rating => (
              <Button
                key={rating}
                variant={starRating.includes(rating) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleStarRating(rating)}
                className={starRating.includes(rating) ? '' : 'hover:bg-muted'}
              >
                {rating} ⭐
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Amenities</Label>
          <div className="grid grid-cols-2 gap-3">
            {amenitiesList.map(amenity => (
              <label key={amenity} className="flex items-center space-x-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => toggleAmenity(amenity)}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm group-hover:text-foreground text-muted-foreground transition-colors">
                  {amenity}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold">Property Type</Label>
          <div className="flex flex-col gap-2">
            {propertyTypes.map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer group p-2 rounded-md hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={propertyType.includes(type)}
                  onChange={() => togglePropertyType(type)}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-sm group-hover:text-foreground text-muted-foreground transition-colors">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
