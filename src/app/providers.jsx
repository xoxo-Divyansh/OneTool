"use client";

import LayoutShell from "@/components/layout/LayoutShell";
import StoreProvider from "@/store/StoreProvider";

export default function Providers({ children }) {
  return (
    <StoreProvider>
      <LayoutShell>{children}</LayoutShell>
    </StoreProvider>
  );
}