"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-10 w-3/4 max-w-[300px]" />
        <Skeleton className="h-4 w-full max-w-[500px]" />
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <TabsTrigger key={i} value={`tab-${i}`} disabled>
              <Skeleton className="h-4 w-16" />
            </TabsTrigger>
          ))}
        </TabsList>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
          </CardHeader>
          <CardContent className="space-y-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                {i === 0 ? (
                  <div className="flex space-x-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <Skeleton className="h-10 w-full" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-between pt-6">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-28" />
        </div>
      </Tabs>
    </div>
  );
}
