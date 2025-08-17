'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error boundary caught:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle>Oops! Something went wrong</CardTitle>
          <CardDescription>
            We encountered an unexpected error. This has been logged and we're looking into it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left text-sm text-muted-foreground">
              <summary className="cursor-pointer font-medium mb-2">Error Details (Dev Mode)</summary>
              <div className="bg-muted p-3 rounded text-xs">
                <div className="font-medium mb-1">Error:</div>
                <div className="mb-2">{error.message}</div>
                {error.digest && (
                  <>
                    <div className="font-medium mb-1">Digest:</div>
                    <div className="mb-2">{error.digest}</div>
                  </>
                )}
                <div className="font-medium mb-1">Stack:</div>
                <pre className="whitespace-pre-wrap break-all">
                  {error.stack}
                </pre>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  );
}