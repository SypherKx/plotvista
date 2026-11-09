import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Compass } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { images } from "@/data/projects";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About PlotVista — Transparent Land Planning" },
      {
        name: "description",
        content:
          "PlotVista replaces opaque land buying with transparent master plans, verified RERA documentation, and 3D spatial previews.",
      },
    ],
  }),
});

function AboutPage() {
  const principles = [
    {
      num: "01",
      title: "Clarity Before Commitment",
      desc: "Every boundary, avenue width, setback, and zoning constraint is mapped with centimeter precision and published openly before any token deposit.",
    },
    {
      num: "02",
      title: "Government Verified Pedigree",
      desc: "We exclusively list townships with active RERA approvals, 30-year unencumbered title deeds, and sanctioned town-planning layout orders.",
    },
    {
      num: "03",
      title: "Spatial Understanding First",
      desc: "Paper blueprints fail to communicate real scale. Our 3D aerial and street-level spatial models let buyers truly evaluate perspective and sun paths.",
    },
    {
      num: "04",
      title: "Direct Developer Engagement",
      desc: "Eliminating unofficial broker markups and ambiguous terms. You transact directly on developer-approved terms with verified bank payment escrow.",
    },
  ];

  return (
    <SiteLayout>
      <div className="editorial-hero">
        <div className="wrap">
          <div className="eyebrow">ABOUT PLOTVISTA</div>
          <h1>Built for certainty in an uncertain market.</h1>
          <p>
            Buying a plot of land has traditionally meant traversing uncharted paperwork,
            vague promises of future development, and speculative pricing. PlotVista was
            founded to replace guesswork with verified spatial layouts and transparent legal clarity.
          </p>
        </div>
      </div>

      <div className="wrap-wide">
        <figure className="editorial-photo">
          <img
            src={images.hero.src}
            alt="Wide tree-lined residential boulevard"
          />
          <figcaption>Green Valley Residency · Avenue 1 · Phase 2 Master Plan</figcaption>
        </figure>
      </div>

      <div className="wrap">
        <div className="principles">
          <div>
            <div className="eyebrow">CORE PRINCIPLES</div>
            <h2 className="section-title text-4xl mt-3">
              How we approach residential land.
            </h2>
            <p className="section-copy mt-4">
              We believe a plots platform should serve the buyer first — prioritizing
              topographic clarity, infrastructure verification, and legal integrity.
            </p>

            <div className="mt-8">
              <Link to="/explore" className="primary-link">
                <span>Explore Townships</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div>
            {principles.map((principle) => (
              <div key={principle.num} className="principle-row">
                <span>{principle.num}</span>
                <div>
                  <h3>{principle.title}</h3>
                  <p>{principle.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RERA and Legal Standards */}
      <section className="plan-section">
        <div className="wrap">
          <div className="plan-head">
            <div>
              <div className="eyebrow">REGULATORY COMMITMENT</div>
              <h2 className="section-title">Standards & Verification</h2>
            </div>
            <p className="section-copy">
              PlotVista operates as an informational demo showcase adhering to the Real Estate
              (Regulation and Development) Act standards across Uttar Pradesh, Haryana, and Rajasthan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-card border border-line rounded-sm">
              <span className="demo-tag mb-2 inline-block">Title Due Diligence</span>
              <h4 className="font-semibold text-base mb-2">30-Year Revenue Search</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Full chain of ownership verified across revenue records, revenue maps (Khasra & Khatauni), and local registrar deeds.
              </p>
            </div>

            <div className="p-6 bg-card border border-line rounded-sm">
              <span className="demo-tag mb-2 inline-block">Infrastructure</span>
              <h4 className="font-semibold text-base mb-2">Sanctioned Utilities</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Underground electric conduit planning, water pipeline layout, and stormwater drainage sanctioned by local development authorities.
              </p>
            </div>

            <div className="p-6 bg-card border border-line rounded-sm">
              <span className="demo-tag mb-2 inline-block">Demarcation</span>
              <h4 className="font-semibold text-base mb-2">Physical Boundary Pegs</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Every listed plot features physical boundary markers surveyed by total-station instruments and cross-verified against GPS coordinates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

