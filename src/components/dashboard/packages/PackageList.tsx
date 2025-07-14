'use client'
import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Package, FEATURE_FIELDS } from '@/types/package'
import { apiClient } from '@/lib/utils/apiClient'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { PackageForm } from './PackageForm'
import { Badge } from '@/components/ui/badge'

async function fetchPackages(): Promise<Package[]> {
  return await apiClient('/packages')
}

async function deletePackage(id: number | undefined): Promise<boolean> {
  await apiClient(`/packages/${id}`, { method: 'DELETE' })
  return true
}

export function PackageList() {
  const queryClient = useQueryClient()
  const [editOpen, setEditOpen] = useState(false)
  const [editingPackage, setEditingPackage] = useState<Package | null>(null)
  const { data: packages, isLoading, error } = useQuery<Package[]>({
    queryKey: ['packages'],
    queryFn: fetchPackages,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number | undefined) => deletePackage(id),
    onSuccess: () => {
      toast.success('Package deleted')
      queryClient.invalidateQueries({ queryKey: ['packages'] })
    },
    onError: (err: unknown) => {
      if (err instanceof Error) toast.error(err.message)
      else toast.error('Failed to delete package')
    },
  })

  if (isLoading) return <div className="text-primary-700">Loading packages...</div>
  if (error) return <div className="text-red-600">Failed to load packages</div>
  if (!packages || packages.length === 0) return <div className="text-secondary-500">No packages found.</div>

  return (
    <>
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent side="right" className="max-w-md w-full overflow-y-auto max-h-screen">
          <SheetHeader>
            <SheetTitle>Edit Package</SheetTitle>
          </SheetHeader>
          {editingPackage && (
            <PackageForm initialData={editingPackage} onSuccess={() => setEditOpen(false)} />
          )}
        </SheetContent>
      </Sheet>
      <div className="space-y-4">
        {packages.map((pkg, idx) => (
          <Card key={pkg.id ?? idx} className="p-6 flex flex-col gap-2 border border-secondary-200 relative">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-primary-700">{pkg.name}</h2>
              <span className="text-primary-600 font-bold text-xl">
                {pkg.price === 0 ? 'Free' : `${pkg.currency} $${pkg.price}`}
                <span className="text-secondary-500 text-sm ml-1">/ {pkg.billing_cycle.toLowerCase()}</span>
              </span>
            </div>
            <div className="text-secondary-700 mb-2">{pkg.description}</div>
            <ul className="list-disc pl-6 text-accent-700">
              {FEATURE_FIELDS.map((feature) => {
                const value = pkg.features?.[feature.key];
                if (feature.type === 'boolean') {
                  if (value === true) {
                    return <li key={feature.key}>{feature.label}</li>;
                  }
                  // If missing or false, skip
                  return null;
                }
                if (feature.type === 'number') {
                  if (typeof value === 'number') {
                    return <li key={feature.key}>{feature.label}: <span className="font-semibold">{value}</span></li>;
                  }
                  // If missing or not a number, skip
                  return null;
                }
                return null;
              })}
            </ul>
            <div className="mt-2 flex items-center justify-between">
              <Badge variant={pkg.is_active ? 'default' : 'secondary'}>
                {pkg.is_active ? 'Active' : 'Inactive'}
              </Badge>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setEditingPackage(pkg); setEditOpen(true) }}
                  aria-label={`Edit package ${pkg.name}`}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(pkg.id)}
                  disabled={deleteMutation.isPending}
                  aria-label={`Delete package ${pkg.name}`}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
