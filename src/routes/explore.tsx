import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, Compass, MapPin, Grid, Map as MapIcon, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { ProjectCard } from "@/components/ProjectCard";
import { projects, cities, images } from "@/data/projects";
import type { Project } from "@/types/plot";

export const Route = createFileRoute("/explore")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      q: (search.q as string) || "",
      city: (search.city as string) || "all",
      status: (search.status as string) || "all",
    };
  },
  component: ExplorePage,
  head: () => ({
    meta: [
      { title: "Explore Residential Townships & Plots — PlotVista" },
      {
        name: "description",
        content:
          "Browse all 8 verified residential townships across Northern India. Filter by city, status, and inspect master plans and 3D virtual tours.",
      },
    ],
  }),
});

function ExplorePage() {
  const searchParams = useSearch({ from: "/explore" });
  const [searchTerm, setSearchTerm] = useState(searchParams.q || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.city || "all");
  const [selectedStatus, setSelectedStatus] = useState(searchParams.status || "all");
  const [sortBy, setSortBy] = useState<"featured" | "plots" | "name">("featured");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [activePinProject, setActivePinProject] = useState<Project>(projects[0]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        if (
          searchTerm.trim() &&
          !project.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !project.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !project.locality.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          return false;
        }
        if (selectedCity !== "all" && project.city !== selectedCity) {
          return false;
        }
        if (selectedStatus !== "all" && project.status !== selectedStatus) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "plots") return b.plots - a.plots;
        if (sortBy === "name") return a.name.localeCompare(b.name);
        return 0; // featured order
      });
  }, [searchTerm, selectedCity, selectedStatus, sortBy]);

  return (
    <SiteLayout>
      <div className="page-intro explore-hero">
        <div className="wrap">
          <div className="eyebrow">RESIDENTIAL MASTER PLANS</div>
          <h1>Explore Townships</h1>
          <p>
            Filter across Northern India's high-growth corridors. Each layout features
            clear demarcations, government approvals, and full 3D street walkthroughs.
          </p>

          {/* Quick Search */}
          <div className="explore-search">
            <input
              type="text"
              placeholder="Search by project name, locality, or landmark..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search projects"
            />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Filter by city"
            >
              <option value="all">All Cities ({cities.length})</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {}}
              className="flex items-center justify-center gap-1.5 font-medium text-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Filter Toolbar */}
      <div className="explore-toolbar">
        <div className="explore-filters">
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground mr-1" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            aria-label="Filter by project status"
          >
            <option value="all">All Statuses</option>
            <option value="Now open">Now open</option>
            <option value="Phase 2">Phase 2</option>
            <option value="Few plots left">Few plots left</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "featured" | "plots" | "name")}
            aria-label="Sort projects"
          >
            <option value="featured">Sort: Featured</option>
            <option value="plots">Sort: Number of Plots</option>
            <option value="name">Sort: Alphabetical</option>
          </select>

          {(searchTerm || selectedCity !== "all" || selectedStatus !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("all");
                setSelectedStatus("all");
              }}
              className="text-xs text-emerald-800 underline hover:text-emerald-950 ml-2"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="view-toggle">
          <button
            type="button"
            aria-pressed={viewMode === "grid"}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <Grid className="w-3.5 h-3.5 inline mr-1" />
            Grid
          </button>
          <button
            type="button"
            aria-pressed={viewMode === "map"}
            onClick={() => setViewMode("map")}
            aria-label="Map view"
          >
            <MapIcon className="w-3.5 h-3.5 inline mr-1" />
            Map
          </button>
        </div>
      </div>

      <div className="wrap">
        <div className="results-bar">
          <span>Showing {filteredProjects.length} of {projects.length} planned townships</span>
          <span>Northern India · RERA Demo Certified</span>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="empty-state text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No townships match your criteria</h3>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
              Try adjusting your city filter or searching for a different locality name like "Bithoor", "Sultanpur", or "Noida".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("all");
                setSelectedStatus("all");
              }}
              className="primary-link"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="results-grid">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="map-results">
            {/* Interactive Map Panel */}
            <div className="map-panel relative rounded-sm shadow-inner">
              <img
                src={images.aerial.src}
                alt="Overview map of planned regions"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px]" />

              {/* Geographical Plot Vista Pins */}
              {filteredProjects.map((proj, idx) => {
                const posX = 15 + (idx * 21) % 70;
                const posY = 20 + ((idx * 33) % 60);
                const isActive = activePinProject.id === proj.id;

                return (
                  <button
                    key={proj.id}
                    type="button"
                    onClick={() => setActivePinProject(proj)}
                    className="map-pin cursor-pointer transition-transform hover:scale-125"
                    style={{
                      left: `${posX}%`,
                      top: `${posY}%`,
                      background: isActive ? "var(--forest)" : "oklch(0.2 0.01 155)",
                      transform: isActive ? "rotate(-45deg) scale(1.3)" : "rotate(-45deg)",
                    }}
                    title={`${proj.name} (${proj.city})`}
                  >
                    <span>{idx + 1}</span>
                  </button>
                );
              })}

              <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md p-4 rounded border border-line">
                <span className="demo-tag mb-1 inline-block">Selected on Map</span>
                <h4 className="font-semibold text-sm">{activePinProject.name}</h4>
                <p className="text-xs text-muted-foreground">{activePinProject.locality}, {activePinProject.city}</p>
                <div className="flex gap-3 mt-3">
                  <Link
                    to="/projects/$id"
                    params={{ id: activePinProject.id }}
                    className="text-xs text-emerald-800 font-medium hover:underline"
                  >
                    View Project Details →
                  </Link>
                  <Link
                    to="/virtual-tour/$id"
                    params={{ id: activePinProject.id }}
                    className="text-xs text-emerald-800 font-medium hover:underline"
                  >
                    Open 3D Virtual Tour →
                  </Link>
                </div>
              </div>
            </div>

            {/* List side */}
            <div className="map-results-list">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onMouseEnter={() => setActivePinProject(project)}
                  className={`p-4 rounded border transition-colors ${
                    activePinProject.id === project.id
                      ? "border-emerald-700 bg-card/80"
                      : "border-line bg-card/40"
                  }`}
                >
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}

