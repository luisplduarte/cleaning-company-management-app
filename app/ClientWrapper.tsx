"use client";

import { Suspense } from "react";
import AuthProvider from "@/app/auth/components/AuthProvider";
import { Providers } from "./providers";
import { ErrorBoundary } from "react-error-boundary";
import RootLoading from "./loading";
import RootError from "./error";

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return <RootError error={error} reset={resetErrorBoundary} />;
}

export default function ClientWrapper({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <Providers>
          <Suspense fallback={<RootLoading />}>
            {children}
          </Suspense>
        </Providers>
      </AuthProvider>
    </ErrorBoundary>
  );
}
