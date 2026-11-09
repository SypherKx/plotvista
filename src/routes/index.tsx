import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Eye,
  Layers,
  MapPin,
  CheckCircle2,
  Search,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProjectCard } from "@/components/ProjectCard";
import { PlotViewer3D } from "@/components/PlotViewer3D";
import { PlotPlan } from "@/components/PlotPlan";
import { featuredProjects, cities, images } from "@/data/projects";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "PlotVista — Transparent Residential Plots & 3D Virtual Tours" },
      {
        name: "description",
        content:
          "Explore verified residential plots with interactive 3D street & aerial previews, transparent master plans, and clear titles across Northern India.",
      },
    ],
  }),
});

function HomePage() {
  const navigate = Route.useNavigate();
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/explore",
      search: {
        city: selectedCity !== "all" ? selectedCity : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
      },
    });
  };

  return (
    <SiteLayout isHero={true}>
      {/* Hero Section */}
      <section className="hero">
        <img
          src={images.hero.src}
          alt={images.hero.alt}
          className="hero-image"
          priority-hint="high"
        />

        <div className="hero-content">
          <div className="eyebrow hero-eyebrow">
            INDIA'S FIRST 3D VIRTUAL LAND PLATFORM
          </div>
          <h1 className="hero-title">
            Tour residential plots in true 3D. <span>Before setting foot on ground.</span>
          </h1>
          <p className="hero-copy">
            Walk down 12m wide residential boulevards, test sunlight & shadow angles across seasons,
            and inspect exact boundary demarcations in full 360° virtual space. No blind site visits,
            no guessing from flat 2D maps.
          </p>

          <div className="hero-actions">
            <Link
              to="/virtual-tour/$id"
              params={{ id: "green-valley-residency" }}
              className="primary-link"
            >
              <Compass className="w-4 h-4 mr-1 text-emerald-800" />
              <span>Launch 3D Virtual Walkthrough</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/explore" className="outline-link hero-secondary">
              <span>View All 3D Master Plans</span>
            </Link>
          </div>
        </div>

        {/* Hero Search Bar */}
        <div className="hero-search-wrap">
          <form className="hero-search" onSubmit={handleHeroSearch}>
            <div className="search-field">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search township with 3D virtual tour..."
                name="q"
                aria-label="Search township name"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="search-select"
              aria-label="Filter by city"
            >
              <option value="all">All Cities ({cities.length})</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="search-select"
              aria-label="Filter by status"
            >
              <option value="all">Any Status</option>
              <option value="Now open">Now Open</option>
              <option value="Phase 2">Phase 2</option>
              <option value="Few plots left">Few Plots Left</option>
            </select>

            <button type="submit" className="search-submit">
              Explore 3D Plots
            </button>
          </form>
          <div className="hero-search-note flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive 360° street & drone previews live for all 8 townships</span>
          </div>
        </div>

        <div className="hero-verified-pill">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>360° Virtual Walkthrough Active</span>
        </div>
      </section>

      {/* Value Strip Focused on 3D Spatial Advantage */}
      <section className="value-strip">
        <div className="wrap-wide">
          <div className="value-grid">
            <div className="value-item">
              <Eye className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <strong>Eye-Level 3D Street Walk</strong>
                <p className="text-xs text-muted-foreground mt-0.5">Stand at 1.8m pedestrian perspective and examine road widths</p>
              </div>
            </div>

            <div className="value-item">
              <Compass className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <strong>360° Drone Aerial View</strong>
                <p className="text-xs text-muted-foreground mt-0.5">Fly at 85m altitude to assess green buffers and main gates</p>
              </div>
            </div>

            <div className="value-item">
              <Layers className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <strong>Real-Time Sun & Vastu Study</strong>
                <p className="text-xs text-muted-foreground mt-0.5">Simulate daylight and shadow angles across morning and dusk</p>
              </div>
            </div>

            <div className="value-item">
              <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <strong>GPS-Matched Demarcation</strong>
                <p className="text-xs text-muted-foreground mt-0.5">Every 3D boundary matches physical surveyed corner pegs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="featured-section">
        <div className="wrap-wide">
          <div className="featured-head">
            <div>
              <div className="eyebrow">CURATED LOCATIONS</div>
              <h2 className="section-title">
                Townships shaped around open green spaces.
              </h2>
            </div>
            <div>
              <p className="section-copy">
                Each project is situated in a high-growth corridor with planned internal
                avenues, dedicated parks, and clear freehold ownership.
              </p>
              <div className="mt-4">
                <Link to="/explore" className="text-link">
                  <span>Browse all 8 projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="project-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <p className="demo-footnote">
            * All project names, dimensions, and visual assets are displayed as a demo representation of PlotVista's spatial layout technology.
          </p>
        </div>
      </section>

      {/* Immersive 3D Section */}
      <section className="immersive-section">
        <div className="wrap-wide">
          <div className="immersive-grid">
            <div className="immersive-copy">
              <div className="eyebrow">LIVE 3D SPATIAL SIMULATION</div>
              <h2>Walk the avenues before setting foot on ground.</h2>
              <p>
                Evaluate sunlight orientation, distance to the township gate, and street
                widths directly from your browser. Our 3D viewer gives you complete spatial
                clarity before booking a physical site visit.
              </p>

              <div className="benefit-list">
                <div className="benefit-row">
                  <span>01</span>
                  <div>
                    <strong>1.8m Human Eye-Level Walkthrough</strong>
                    <p className="text-xs opacity-75 mt-0.5">Step onto 12m paved boulevards, inspect private driveways, and walk side gardens</p>
                  </div>
                </div>

                <div className="benefit-row">
                  <span>02</span>
                  <div>
                    <strong>Interactive Demarcation Hotspots</strong>
                    <p className="text-xs opacity-75 mt-0.5">Inspect GPS survey pillars, Vastu-aligned gates, and exact plot frontages</p>
                  </div>
                </div>

                <div className="benefit-row">
                  <span>03</span>
                  <div>
                    <strong>Sun Position & Lighting Studies</strong>
                    <p className="text-xs opacity-75 mt-0.5">Toggle morning, afternoon, and golden hour lighting to verify Vastu compliance</p>
                  </div>
                </div>
              </div>

              <div>
                <Link
                  to="/virtual-tour/$id"
                  params={{ id: "green-valley-residency" }}
                  className="primary-link"
                  style={{ background: "white", color: "var(--foreground)", borderColor: "white" }}
                >
                  <Compass className="w-4 h-4 text-emerald-800" />
                  <span>Enter Fullscreen 3D Walkthrough</span>
                </Link>
              </div>
              <p className="viewer-note">Runs smoothly on all modern mobile, tablet, and desktop browsers with zero install.</p>
            </div>

            <div>
              <PlotViewer3D
                projectId="green-valley-residency"
                variant="preview"
                initialMode="street"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="steps-section">
        <div className="wrap">
          <div className="steps-head">
            <div>
              <div className="eyebrow">THE 3D DISCOVERY PROCESS</div>
              <h2 className="section-title">From virtual inspection to physical handover.</h2>
            </div>
            <p className="section-copy">
              We replaced blind site visits and speculative brokers with interactive 3D
              walkthroughs, transparent measurements, and verified RERA dossiers.
            </p>
          </div>

          <div className="steps-grid">
            <div className="step-item">
              <div className="step-dot" />
              <div className="step-num">01</div>
              <h3>Explore 3D Master Plans</h3>
              <p>
                Browse satellite-mapped layouts across Northern India's top corridors.
                Inspect township arterial connectivity and road networks.
              </p>
            </div>

            <div className="step-item">
              <div className="step-dot" />
              <div className="step-num">02</div>
              <h3>Walk the Streets in 3D</h3>
              <p>
                Switch to pedestrian mode. Walk the 12m boulevard, inspect avenue tree
                spacing, and test sun exposure.
              </p>
            </div>

            <div className="step-item">
              <div className="step-dot" />
              <div className="step-num">03</div>
              <h3>Select Exact Plot Boundary</h3>
              <p>
                Click any numbered plot to inspect setbacks, corner advantages,
                and instant sq. yd. area calculations.
              </p>
            </div>

            <div className="step-item">
              <div className="step-dot" />
              <div className="step-num">04</div>
              <h3>Targeted On-Site Visit</h3>
              <p>
                Arrive on ground knowing the exact plot location and legal dossier
                in advance. Fast, transparent token reservation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Master Plan Section */}
      <section className="plan-section">
        <div className="wrap">
          <div className="plan-head">
            <div>
              <div className="eyebrow">INTERACTIVE MASTER PLAN</div>
              <h2 className="section-title">
                Green Valley Residency — Phase 2 Layout
              </h2>
            </div>
            <p className="section-copy">
              Explore the 24 residential plots mapped along the central boulevard.
              Click any plot to reveal dimensions, orientation, and reservation status.
            </p>
          </div>

          <PlotPlan projectId="green-valley-residency" />
        </div>
      </section>

      {/* Trust & Proof Section */}
      <section className="trust-section">
        <div className="wrap">
          <div className="trust-grid">
            <div>
              <div className="eyebrow">VERIFIED CREDIBILITY</div>
              <h2 className="trust-quote">
                “Every boundary measured. Every approval on record.”
              </h2>

              <div className="stats-row">
                <div>
                  <div className="stat-number">8</div>
                  <div className="stat-label">Townships Listed</div>
                  <span className="stat-demo">All RERA demo-registered</span>
                </div>
                <div>
                  <div className="stat-number">720+</div>
                  <div className="stat-label">Planned Plots</div>
                  <span className="stat-demo">120 to 500 sq. yd.</span>
                </div>
                <div>
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Clear Demarcation</div>
                  <span className="stat-demo">Boundary pillars installed</span>
                </div>
              </div>
            </div>

            <div className="trust-list">
              <div className="trust-item">
                <span>01</span>
                <div>
                  <strong>Government Approved Layout Plans</strong>
                  <p>
                    Every township is registered with respective state authorities (UP-RERA, HR-RERA, RJ-RERA) with approved layout sanction orders.
                  </p>
                </div>
              </div>

              <div className="trust-item">
                <span>02</span>
                <div>
                  <strong>Underground Electrical & Water Conduits</strong>
                  <p>
                    Clean, clutter-free streets without hanging cables. Paved pedestrian pathways and solar avenue lighting.
                  </p>
                </div>
              </div>

              <div className="trust-item">
                <span>03</span>
                <div>
                  <strong>Transparent Documentation</strong>
                  <p>
                    Complete 30-year title search reports and revenue records available for inspection before token reservation.
                  </p>
                </div>
              </div>

              <div className="trust-item">
                <span>04</span>
                <div>
                  <strong>Direct Developer Connection</strong>
                  <p>
                    Zero intermediary markups. You negotiate and execute transactions directly with verified township developers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="closing-cta">
        <img
          src={images.greenValley.src}
          alt="Tree lined avenue at sunset"
          loading="lazy"
        />
        <div className="closing-content">
          <div className="eyebrow">START YOUR SEARCH</div>
          <h2>Find the plot that fits your future home.</h2>
          <div className="flex flex-wrap gap-4 mt-6">
            <Link to="/explore" className="primary-link">
              <span>View All 8 Townships</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/virtual-tour/$id"
              params={{ id: "green-valley-residency" }}
              className="outline-link"
            >
              <Compass className="w-4 h-4" />
              <span>Launch 3D Virtual Tour</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
