import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Compass,
  ArrowLeft,
  Layers,
  Eye,
  Maximize2,
  Share2,
  Info,
  Check,
  RotateCcw,
  Sun,
  ShieldCheck,
  ChevronRight,
  Sliders,
} from "lucide-react";
import { PlotViewer3D } from "@/components/PlotViewer3D";
import { projects, plots } from "@/data/projects";
import type { Plot, ViewMode } from "@/types/plot";

export const Route = createFileRoute("/virtual-tour/$id")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.id === params.id) || projects[0];
    return { project };
  },
  component: VirtualTourPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.project
          ? `3D Virtual Tour: ${loaderData.project.name} — PlotVista`
          : "3D Virtual Tour — PlotVista",
      },
      {
        name: "description",
        content: "Interactive 3D aerial and street perspective walkthrough of planned residential plots.",
      },
    ],
  }),
});

function VirtualTourPage() {
  const { project } = Route.useLoaderData();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);
  const [selectedPlot, setSelectedPlot] = useState<Plot>(plots[0]);
  const [activeMode, setActiveMode] = useState<ViewMode>("street");
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showRoadLabels, setShowRoadLabels] = useState(true);
  const [showGreenery, setShowGreenery] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleProjectChange = (newProjectId: string) => {
    navigate({
      to: "/virtual-tour/$id",
      params: { id: newProjectId },
    });
  };

  return (
    <div className="tour-page">
      {/* Top Bar */}
      <header className="tour-topbar">
        <div className="tour-top-left">
          <Link
            to="/projects/$id"
            params={{ id: project.id }}
            className="tour-back hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Tour</span>
          </Link>

          <span className="text-white/30">|</span>

          <h1 className="tour-title">{project.name}</h1>
          <span className="demo-tag">3D Virtual Space</span>
        </div>

        <div className="tour-top-right">
          <label htmlFor="township-select" className="sr-only">
            Switch Township
          </label>
          <select
            id="township-select"
            value={project.id}
            onChange={(e) => handleProjectChange(e.target.value)}
            className="tour-select"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.city})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setMobileDetailsOpen(!mobileDetailsOpen)}
            className="tour-select cursor-pointer flex items-center gap-1.5 md:hidden text-emerald-300 border-emerald-500/40"
            title="Toggle Parcel Specs"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Plot #{selectedPlot.number}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `${project.name} 3D Tour`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Tour link copied to clipboard!");
              }
            }}
            className="tour-select cursor-pointer flex items-center gap-1.5"
            title="Share Tour"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* Main Tour Workspace */}
      <div className="tour-body">
        {/* Left Vertical Tool Rail */}
        <aside className="tour-rail" aria-label="Tour viewpoint navigation">
          <button
            type="button"
            aria-pressed={activeMode === "aerial"}
            onClick={() => setActiveMode("aerial")}
            title="Aerial Drone View"
          >
            <Compass className="w-4 h-4 mb-1" />
            <span>Aerial</span>
          </button>

          <button
            type="button"
            aria-pressed={activeMode === "street"}
            onClick={() => setActiveMode("street")}
            title="Street Eye-Level View"
          >
            <Eye className="w-4 h-4 mb-1" />
            <span>Street</span>
          </button>

          <button
            type="button"
            aria-pressed={activeMode === "plot"}
            onClick={() => setActiveMode("plot")}
            title="Plot Boundary Focus"
          >
            <Layers className="w-4 h-4 mb-1" />
            <span>Plot</span>
          </button>

          <div className="w-6 h-px bg-white/20 my-2" />

          <button
            type="button"
            onClick={() => setShowOnboarding(true)}
            title="How to use the 3D Tour"
          >
            <Info className="w-4 h-4" />
          </button>
        </aside>

        {/* Center 3D Viewport */}
        <main className="tour-main">
          <PlotViewer3D
            projectId={project.id}
            variant="full"
            initialMode={activeMode}
            selectedPlotId={selectedPlot.id}
            onSelectPlot={(plot) => setSelectedPlot(plot)}
          />

          {/* Loading Transition Overlay */}
          <div className={`tour-loading ${!isLoading ? "is-ready" : ""}`}>
            <div className="tour-loading-mark">
              <Compass className="w-8 h-8 text-emerald-400 mx-auto mb-3 animate-spin" />
              <div>Loading 3D Spatial Environment...</div>
              <div className="text-xs text-white/60 mt-1">{project.name} · Phase 2 Layout</div>
              <div className="tour-loading-line">
                <span />
              </div>
            </div>
          </div>

          {/* Onboarding Dialog */}
          {showOnboarding && (
            <div className="tour-onboarding" role="dialog" aria-modal="true">
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold uppercase">
                <Compass className="w-4 h-4" />
                <span>Interactive 3D Walkthrough</span>
              </div>
              <h2>Welcome to {project.name}</h2>
              <p>
                Use this spatial model to inspect road widths, park adjacency, and sun exposure across all 24 plots.
              </p>
              <ul className="text-xs space-y-1.5 my-3 text-muted-foreground">
                <li>• Click any numbered marker in the scene to inspect measurements.</li>
                <li>• Use the bottom mode bar to switch between Aerial and Street views.</li>
                <li>• Toggle the Sun tool in the top right to simulate day lighting.</li>
              </ul>
              <div className="tour-onboarding-actions">
                <button
                  type="button"
                  onClick={() => setShowOnboarding(false)}
                >
                  Dismiss
                </button>
                <button
                  type="button"
                  onClick={() => setShowOnboarding(false)}
                >
                  Start Exploring
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Details Panel */}
        <aside
          className={`tour-sidepanel ${mobileDetailsOpen ? "is-mobile-open" : ""}`}
          aria-label="Plot Details and Layers"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="demo-tag">Selected Parcel</span>
              <button
                type="button"
                onClick={() => setMobileDetailsOpen(false)}
                className="md:hidden text-white/60 hover:text-white text-xs px-2 py-0.5 rounded bg-white/15"
              >
                ✕ Close
              </button>
            </div>
            <span
              className={`text-[9px] uppercase font-semibold px-1.5 py-0.5 rounded ${
                selectedPlot.status === "available"
                  ? "bg-emerald-900/60 text-emerald-300 border border-emerald-500/40"
                  : selectedPlot.status === "reserved"
                  ? "bg-amber-900/60 text-amber-300 border border-amber-500/40"
                  : "bg-stone-800 text-stone-400"
              }`}
            >
              {selectedPlot.status}
            </span>
          </div>

          <h2>Plot #{selectedPlot.number}</h2>
          <p>
            {selectedPlot.area} sq. yd. · {selectedPlot.facing} Facing · {selectedPlot.roadWidth}m Avenue
          </p>

          <div className="detail-table mt-4">
            <div className="detail-cell">
              <span>Dimensions</span>
              <strong>{selectedPlot.dimensions}</strong>
            </div>
            <div className="detail-cell">
              <span>Type</span>
              <strong>{selectedPlot.corner ? "Corner (Two-Side Open)" : "Single Frontage"}</strong>
            </div>
            <div className="detail-cell">
              <span>Approach Road</span>
              <strong>{selectedPlot.roadWidth}m Paved Boulevard</strong>
            </div>
            <div className="detail-cell">
              <span>Estimated Area</span>
              <strong>{(selectedPlot.area * 9).toLocaleString()} sq. ft.</strong>
            </div>
          </div>

          <div className="detail-landmarks mt-4">
            <span className="block text-white/90 text-xs font-semibold mb-1">Surroundings:</span>
            <ul className="space-y-1 text-xs text-white/60">
              {selectedPlot.landmarks.map((landmark, i) => (
                <li key={i}>• {landmark}</li>
              ))}
            </ul>
          </div>

          {/* Action CTAs */}
          <Link
            to="/contact"
            className="primary-link block text-center"
          >
            Enquire for Plot #{selectedPlot.number}
          </Link>

          <Link
            to="/projects/$id"
            params={{ id: project.id }}
            className="outline-link block text-center"
          >
            View Township Overview
          </Link>

          {/* Map Layer Overlays */}
          <div className="tour-layer-list">
            <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold block mb-1">
              Visual Display Layers
            </span>
            <label>
              <input
                type="checkbox"
                checked={showBoundaries}
                onChange={(e) => setShowBoundaries(e.target.checked)}
                className="rounded border-white/30 text-emerald-600 focus:ring-0"
              />
              <span>Boundary Demarcation Pillars</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={showRoadLabels}
                onChange={(e) => setShowRoadLabels(e.target.checked)}
                className="rounded border-white/30 text-emerald-600 focus:ring-0"
              />
              <span>Avenue & Road Width Tags</span>
            </label>
            <label>
              <input
                type="checkbox"
                checked={showGreenery}
                onChange={(e) => setShowGreenery(e.target.checked)}
                className="rounded border-white/30 text-emerald-600 focus:ring-0"
              />
              <span>Central Green & Garden Walk</span>
            </label>
          </div>
        </aside>
      </div>
    </div>
  );
}

