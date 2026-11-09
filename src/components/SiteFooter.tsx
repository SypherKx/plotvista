import { Link } from "@tanstack/react-router";
import { Compass, ShieldCheck, MapPin, Phone, Mail } from "lucide-react";
import { projects } from "@/data/projects";

export function SiteFooter() {
  const topProjects = projects.slice(0, 4);

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand">
              <span className="brand-mark">
                <Compass className="w-5 h-5 text-emerald-700" />
              </span>
              <span className="brand-name">PlotVista</span>
            </Link>
            <p>
              A transparent digital land platform providing verified residential plots
              with interactive 3D street & aerial previews across Northern India.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>100% RERA Registered Demo Townships</span>
            </div>
          </div>

          <div className="footer-col">
            <h3>Featured Townships</h3>
            {topProjects.map((p) => (
              <Link
                key={p.id}
                to="/projects/$id"
                params={{ id: p.id }}
              >
                {p.name} ({p.city})
              </Link>
            ))}
            <Link to="/explore">View all locations →</Link>
          </div>

          <div className="footer-col">
            <h3>Platform</h3>
            <Link to="/explore">Explore Listings</Link>
            <Link
              to="/virtual-tour/$id"
              params={{ id: "green-valley-residency" }}
            >
              Interactive 3D Walkthrough
            </Link>
            <Link to="/about">Our Verification Process</Link>
            <Link to="/contact">Book Site Visit</Link>
          </div>

          <div className="footer-col">
            <h3>Contact & Enquiries</h3>
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>PlotVista Tower, Cyber City, Gurugram</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>+91 (800) 123-4567</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>support@plotvista.demo</span>
            </p>
            <Link to="/contact">Send an enquiry →</Link>
          </div>
        </div>

        <div className="footer-wordmark select-none">PLOTVISTA</div>

        <div className="footer-bottom">
          <p>© 2026 PlotVista Technologies. All rights reserved. Demo showcase only.</p>
          <div className="flex gap-4">
            <Link to="/about">Privacy Policy</Link>
            <Link to="/about">Terms of Use</Link>
            <Link to="/about">RERA Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

