'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Greeting skeleton */}
      <div className="mb-6">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Review card skeleton */}
      <Card>
        <div className="p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-2 w-full mb-4" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <Card key={i}>
            <div className="p-4">
              <Skeleton className="h-10 w-10 rounded-lg mb-3" />
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Card>
        ))}
      </div>

      {/* Subjects skeleton */}
      <div>
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex gap-4 overflow-x-auto">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="min-w-[200px]">
              <div className="p-4">
                <Skeleton className="h-12 w-12 rounded-lg mb-3" />
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

