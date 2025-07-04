import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Package, FEATURE_FIELDS } from '@/types/package';
import React from 'react';

export function PricingCard({ plan, children }: { plan: Package, children?: React.ReactNode }) {
  return (
    <Card className="flex flex-col min-w-[320px] min-h-[600px] max-w-xs flex-shrink-0 h-full">
      {/* Top Section: Title + Price + Description */}
      <CardHeader className="space-y-4">
        <div>
          <CardTitle className="text-xl">{plan.name}</CardTitle>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight sm:text-4xl">
            {plan.price === 0 ? 'Free' : `${plan.currency} $${plan.price}`}
          </span>
          {plan.price !== 0 && (
            <span className="text-sm text-muted-foreground">/ {plan.billing_cycle.toLowerCase()}</span>
          )}
        </div>

        {/* Render HTML if present in plan.description */}
        {plan.description ? (
          <div className="text-muted-foreground text-sm" data-slot="card-description" dangerouslySetInnerHTML={{ __html: plan.description }} />
        ) : (
          <CardDescription>{plan.description}</CardDescription>
        )}
      </CardHeader>

      {/* Middle Section: Features */}
      <CardContent className="flex-1 flex flex-col justify-between">
        <ul className="grid gap-3 text-sm mb-4">
          {FEATURE_FIELDS.filter(f => f.key !== 'is_trial').map((feature) => {
            const value = plan.features[feature.key];
            if (feature.type === 'boolean' && value) {
              return (
                <li key={feature.key} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{feature.label}</span>
                </li>
              );
            }
            if (feature.type === 'number' && typeof value === 'number') {
              return (
                <li key={feature.key} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{value} <span className="">{feature.label}</span></span>
                </li>
              );
            }
            return null;
          })}
        </ul>

        {/* Footer: Action Button or Children */}
        {children && <div className="mt-auto pt-2">{children}</div>}
      </CardContent>
    </Card>
  );
}
