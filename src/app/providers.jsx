"use client";

import StoreProvider from "@/store/StoreProvider";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Providers({ children }) {
  return (
    <StoreProvider>
      {children}
      <ThemeToggle />
    </StoreProvider>
  );
}
