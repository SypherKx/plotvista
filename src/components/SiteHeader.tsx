import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Compass, ArrowRight } from "lucide-react";

interface SiteHeaderProps {
  isHero?: boolean;
}

export function SiteHeader({ isHero = false }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [currentPath]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const headerClasses = [
    "site-header",
    isScrolled ? "is-scrolled" : isHero ? "is-hero" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClasses}>
        <div className="header-inner">
          <Link to="/" className="brand" aria-label="PlotVista Home">
            <span className="brand-mark">
              <Compass className="w-6 h-6 text-emerald-600" />
            </span>
            <span className="brand-name">PlotVista</span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <Link
              to="/explore"
              className="nav-link"
              data-status={currentPath.startsWith("/explore") ? "active" : undefined}
            >
              Explore Projects
            </Link>
            <Link
              to="/virtual-tour/$id"
              params={{ id: "green-valley-residency" }}
              className="nav-link flex items-center gap-1.5"
              data-status={currentPath.startsWith("/virtual-tour") ? "active" : undefined}
            >
              <span>3D Virtual Tour</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 px-1.5 py-0.5 rounded font-mono font-semibold">
                360° LIVE
              </span>
            </Link>
            <Link
              to="/about"
              className="nav-link"
              data-status={currentPath === "/about" ? "active" : undefined}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="nav-link"
              data-status={currentPath === "/contact" ? "active" : undefined}
            >
              Contact
            </Link>
          </nav>

          <div className="header-cta flex items-center gap-3">
            <Link
              to="/virtual-tour/$id"
              params={{ id: "green-valley-residency" }}
              className={`nav-cta flex items-center gap-2 ${isHero && !isScrolled ? "hero-nav-cta" : ""}`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch 3D Tour</span>
            </Link>
          </div>

          <button
            type="button"
            className="menu-toggle p-2 text-inherit"
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true">
          <div className="flex flex-col gap-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={currentPath === "/" ? "text-forest font-bold" : ""}
            >
              Home
            </Link>
            <Link
              to="/explore"
              onClick={() => setMobileMenuOpen(false)}
              className={currentPath.startsWith("/explore") ? "text-forest font-bold" : ""}
            >
              Explore Townships
            </Link>
            <Link
              to="/virtual-tour/$id"
              params={{ id: "green-valley-residency" }}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between ${
                currentPath.startsWith("/virtual-tour") ? "text-forest font-bold" : ""
              }`}
            >
              <span>3D Virtual Tour</span>
              <span className="text-[10px] bg-emerald-600 text-white font-mono px-2 py-0.5 rounded-full font-bold">
                360° LIVE
              </span>
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={currentPath === "/about" ? "text-forest font-bold" : ""}
            >
              About PlotVista
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={currentPath === "/contact" ? "text-forest font-bold" : ""}
            >
              Contact & Advisory
            </Link>
          </div>

          <div className="pt-6 border-t border-line flex flex-col gap-3">
            <Link
              to="/virtual-tour/$id"
              params={{ id: "green-valley-residency" }}
              className="flex items-center justify-center gap-2 w-full h-12 rounded-lg bg-forest text-white font-semibold text-sm shadow-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Compass className="w-4 h-4 text-emerald-300" />
              <span>Launch 3D Walkthrough</span>
            </Link>
            <Link
              to="/explore"
              className="flex items-center justify-center w-full h-11 rounded-lg border border-line bg-card text-foreground font-medium text-xs hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Browse All 8 Master Plans
            </Link>
          </div>

          <div className="mobile-contact pt-4 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Verified Plot Discovery Advisory</p>
            <p>Hotline: +91 (800) 123-4567 · Mon–Sat, 9AM–7PM IST</p>
          </div>
        </div>
      )}
    </>
  );
}

