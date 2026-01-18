'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PriceBreakdownProps {
  basePrice: number;
  nights: number;
  taxes: number;
  discount: number;
  total: number;
}

export function PriceBreakdown({ basePrice, nights, taxes, discount, total }: PriceBreakdownProps) {
  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Price Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base Price ({nights} nights)</span>
          <span className="font-medium">${basePrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Taxes (10%)</span>
          <span className="font-medium">${taxes.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span className="font-medium">-${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
