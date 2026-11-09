import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

interface SiteLayoutProps {
  children: ReactNode;
  isHero?: boolean;
}

export function SiteLayout({ children, isHero = false }: SiteLayoutProps) {
  return (
    <div className="site-shell">
      <SiteHeader isHero={isHero} />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  );
}

