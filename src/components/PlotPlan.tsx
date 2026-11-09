import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Maximize2,
  Trees,
  Navigation,
} from "lucide-react";
import { plots as initialPlots } from "@/data/projects";
import type { Plot } from "@/types/plot";

interface PlotPlanProps {
  projectId?: string;
  selectedPlotId?: string | null;
  onSelectPlot?: (plot: Plot) => void;
}

export function PlotPlan({
  projectId = "green-valley-residency",
  selectedPlotId: externalSelectedPlotId,
  onSelectPlot: externalOnSelectPlot,
}: PlotPlanProps) {
  const [internalSelectedPlotId, setInternalSelectedPlotId] = useState<string>("plot-12");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [facingFilter, setFacingFilter] = useState<string>("all");
  const [cornerOnly, setCornerOnly] = useState<boolean>(false);
  const [hoveredPlotId, setHoveredPlotId] = useState<string | null>(null);

  const selectedId =
    externalSelectedPlotId !== undefined ? externalSelectedPlotId : internalSelectedPlotId;
  const selectedPlot = initialPlots.find((p) => p.id === selectedId) || initialPlots[11] || initialPlots[0];

  const handlePlotClick = (plot: Plot) => {
    setInternalSelectedPlotId(plot.id);
    externalOnSelectPlot?.(plot);
  };

  const filteredPlots = initialPlots.filter((plot) => {
    if (statusFilter !== "all" && plot.status !== statusFilter) return false;
    if (facingFilter !== "all" && plot.facing !== facingFilter) return false;
    if (cornerOnly && !plot.corner) return false;
    return true;
  });

  const availableCount = initialPlots.filter((p) => p.status === "available").length;
  const reservedCount = initialPlots.filter((p) => p.status === "reserved").length;
  const soldCount = initialPlots.filter((p) => p.status === "sold").length;

  return (
    <div className="plan-component">
      {/* Clean Architectural Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-line">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-xs font-semibold text-muted-foreground mr-1 uppercase tracking-wider">
            Filter Layout:
          </span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select text-xs h-9 px-3 bg-card border border-line rounded-sm"
            aria-label="Filter by plot status"
          >
            <option value="all">All Units ({initialPlots.length})</option>
            <option value="available">Available Units ({availableCount})</option>
            <option value="reserved">Reserved Units ({reservedCount})</option>
            <option value="sold">Allocated ({soldCount})</option>
          </select>

          <select
            value={facingFilter}
            onChange={(e) => setFacingFilter(e.target.value)}
            className="filter-select text-xs h-9 px-3 bg-card border border-line rounded-sm"
            aria-label="Filter by facing direction"
          >
            <option value="all">All Orientations</option>
            <option value="North">North Facing (Vastu)</option>
            <option value="South">South Facing</option>
          </select>

          <label className="filter-check cursor-pointer select-none inline-flex items-center gap-2 ml-2 text-xs">
            <input
              type="checkbox"
              checked={cornerOnly}
              onChange={(e) => setCornerOnly(e.target.checked)}
              className="rounded border-line text-forest focus:ring-forest w-3.5 h-3.5"
            />
            <span className="text-foreground font-medium">Corner plots only</span>
          </label>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-800" />
            <span>Available ({availableCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-600" />
            <span>Reserved ({reservedCount})</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-stone-400" />
            <span>Sold ({soldCount})</span>
          </span>
        </div>
      </div>

      <div className="plan-layout">
        {/* SVG Interactive Architectural Map */}
        <div className="plot-map bg-[#FBFBFA] shadow-sm rounded-sm border border-line relative overflow-hidden">
          <svg
            viewBox="0 0 970 640"
            className="plot-map-svg w-full h-auto min-h-[480px]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Pattern for sold plots */}
              <pattern
                id="sold-architectural-hatch"
                width="6"
                height="6"
                patternTransform="rotate(45 0 0)"
                patternUnits="userSpaceOnUse"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="6"
                  stroke="oklch(0.6 0.02 150 / 40%)"
                  strokeWidth="1.2"
                />
              </pattern>

              {/* Blueprint Grid pattern */}
              <pattern id="cad-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="oklch(0.92 0.005 100)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>

            {/* Subtle background grid */}
            <rect width="100%" height="100%" fill="url(#cad-grid)" opacity="0.6" />

            {/* Boundary Framing Lines */}
            <rect
              x="20"
              y="20"
              width="930"
              height="600"
              fill="none"
              stroke="oklch(0.88 0.01 100)"
              strokeWidth="1.5"
              strokeDasharray="4,4"
              rx="4"
            />

            {/* Compass Rose (Top Right) */}
            <g transform="translate(910, 38)">
              <circle cx="0" cy="0" r="14" fill="white" stroke="var(--line)" strokeWidth="1" />
              <polygon points="0,-12 3,-2 0,0 -3,-2" fill="var(--forest)" />
              <polygon points="0,12 3,2 0,0 -3,2" fill="#999" />
              <text x="0" y="-15" textAnchor="middle" fontSize="8" fontWeight="600" fill="var(--forest)">
                N
              </text>
            </g>

            {/* ----------------- ROADWAYS (Clean, dedicated vertical bands) ----------------- */}

            {/* ROAD 1: 9M NORTH AVENUE (y: 148 to 182) */}
            <rect x="70" y="148" width="830" height="34" fill="#ECE9E2" rx="2" />
            {/* Center dashed line */}
            <line
              x1="75"
              y1="165"
              x2="895"
              y2="165"
              stroke="#D8D4CA"
              strokeWidth="1.5"
              strokeDasharray="8,6"
            />
            {/* Road Label */}
            <text
              x="485"
              y="168"
              textAnchor="middle"
              fill="#7A756B"
              fontSize="9"
              letterSpacing="0.16em"
              fontWeight="600"
              fontFamily="Manrope, sans-serif"
            >
              9M NORTH RESIDENTIAL AVENUE
            </text>

            {/* ROAD 2: 14M GRAND CENTRAL BOULEVARD (y: 288 to 352) */}
            <rect x="70" y="288" width="830" height="64" fill="#E4E0D7" rx="3" />
            {/* Tree median in boulevard */}
            <line
              x1="85"
              y1="320"
              x2="885"
              y2="320"
              stroke="#D0CBBF"
              strokeWidth="2"
              strokeDasharray="14,10"
            />
            {/* Tree symbols along median */}
            {[150, 280, 410, 560, 690, 820].map((treeX) => (
              <g key={`tree-${treeX}`} transform={`translate(${treeX}, 320)`}>
                <circle cx="0" cy="0" r="5" fill="oklch(0.55 0.06 145 / 45%)" />
                <circle cx="0" cy="0" r="2" fill="var(--forest)" />
              </g>
            ))}
            {/* Boulevard Label */}
            <text
              x="485"
              y="323"
              textAnchor="middle"
              fill="oklch(0.28 0.02 155)"
              fontSize="10"
              letterSpacing="0.18em"
              fontWeight="600"
              fontFamily="Manrope, sans-serif"
            >
              14M GRAND CENTRAL BOULEVARD · GREENWAY
            </text>

            {/* ROAD 3: 9M SOUTH AVENUE (y: 458 to 492) */}
            <rect x="70" y="458" width="830" height="34" fill="#ECE9E2" rx="2" />
            <line
              x1="75"
              y1="475"
              x2="895"
              y2="475"
              stroke="#D8D4CA"
              strokeWidth="1.5"
              strokeDasharray="8,6"
            />
            <text
              x="485"
              y="478"
              textAnchor="middle"
              fill="#7A756B"
              fontSize="9"
              letterSpacing="0.16em"
              fontWeight="600"
              fontFamily="Manrope, sans-serif"
            >
              9M SOUTH RESIDENTIAL AVENUE
            </text>

            {/* MAIN SECURITY GATE (Left side at Central Boulevard) */}
            <g transform="translate(30, 298)">
              <rect x="0" y="0" width="34" height="44" fill="white" stroke="var(--forest)" strokeWidth="1.2" rx="2" />
              <text x="17" y="18" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="var(--forest)">
                MAIN
              </text>
              <text x="17" y="27" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="var(--forest)">
                GATE
              </text>
              <text x="17" y="36" textAnchor="middle" fontSize="5.5" fill="#888">
                ENTRY
              </text>
            </g>

            {/* ----------------- RESIDENTIAL PLOTS (Exact 110 x 90 blocks) ----------------- */}
            {initialPlots.map((plot) => {
              const isFilteredIn = filteredPlots.some((p) => p.id === plot.id);
              const isSelected = plot.id === selectedId;
              const isHovered = hoveredPlotId === plot.id;

              const x = plot.polygon[0].x;
              const y = plot.polygon[0].y;
              const w = 110;
              const h = 90;
              const cx = x + w / 2;
              const cy = y + h / 2;

              let fillColor = "oklch(0.366 0.043 162.4 / 12%)";
              let strokeColor = "oklch(0.366 0.043 162.4 / 65%)";
              let strokeWidth = 1.2;
              let textColor = "oklch(0.24 0.02 155)";

              if (plot.status === "reserved") {
                fillColor = "oklch(0.88 0.03 80 / 45%)";
                strokeColor = "oklch(0.68 0.06 75)";
                textColor = "oklch(0.35 0.04 60)";
              } else if (plot.status === "sold") {
                fillColor = "url(#sold-architectural-hatch)";
                strokeColor = "oklch(0.7 0.01 150)";
                textColor = "oklch(0.5 0.01 150)";
              }

              if (isSelected) {
                fillColor = "var(--forest)";
                strokeColor = "oklch(0.18 0.02 155)";
                strokeWidth = 2.5;
                textColor = "#ffffff";
              } else if (isHovered && isFilteredIn) {
                strokeWidth = 2;
                if (plot.status === "available") {
                  fillColor = "oklch(0.366 0.043 162.4 / 22%)";
                }
              }

              return (
                <g
                  key={plot.id}
                  style={{
                    opacity: isFilteredIn ? 1 : 0.2,
                    cursor: isFilteredIn ? "pointer" : "not-allowed",
                    transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  onClick={() => isFilteredIn && handlePlotClick(plot)}
                  onMouseEnter={() => setHoveredPlotId(plot.id)}
                  onMouseLeave={() => setHoveredPlotId(null)}
                >
                  {/* Outer Plot Boundary */}
                  <rect
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    rx="3"
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    filter={isSelected ? "drop-shadow(0 4px 10px rgba(0,0,0,0.18))" : undefined}
                  />

                  {/* Inner Building Setback Line (Architectural Blueprint detail) */}
                  <rect
                    x={x + 7}
                    y={y + 7}
                    width={w - 14}
                    height={h - 14}
                    rx="2"
                    fill="none"
                    stroke={isSelected ? "rgba(255,255,255,0.3)" : strokeColor}
                    strokeWidth="0.8"
                    strokeDasharray="3,3"
                    opacity={isSelected ? 0.6 : 0.4}
                  />

                  {/* Corner Badge */}
                  {plot.corner && (
                    <g transform={`translate(${x + 10}, ${y + 11})`}>
                      <circle cx="0" cy="0" r="3" fill={isSelected ? "#FCD34D" : "#D97706"} />
                    </g>
                  )}

                  {/* Plot Number */}
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill={textColor}
                    fontSize="13"
                    fontWeight="700"
                    fontFamily="Manrope, sans-serif"
                    letterSpacing="0.04em"
                  >
                    PLOT #{plot.number}
                  </text>

                  {/* Area Measurement */}
                  <text
                    x={cx}
                    y={cy + 8}
                    textAnchor="middle"
                    fill={isSelected ? "rgba(255,255,255,0.9)" : textColor}
                    fontSize="10"
                    fontFamily="Inter, sans-serif"
                    fontWeight="500"
                    opacity={isSelected ? 1 : 0.85}
                  >
                    {plot.area} sq. yd.
                  </text>

                  {/* Dimensions & Facing */}
                  <text
                    x={cx}
                    y={cy + 23}
                    textAnchor="middle"
                    fill={isSelected ? "rgba(255,255,255,0.75)" : "#6B7280"}
                    fontSize="8.5"
                    fontFamily="Inter, sans-serif"
                  >
                    {plot.dimensions} · {plot.facing}
                  </text>
                </g>
              );
            })}

            {/* Bottom Scale & Registration Footer */}
            <g transform="translate(70, 615)">
              <text x="0" y="0" fontSize="9" fill="#999" fontFamily="Inter, sans-serif">
                SCALE 1:500 · ALL DIMENSIONS METRIC (UP-RERA SANCTIONED LAYOUT)
              </text>
              {/* Scale bar */}
              <line x1="500" y1="-3" x2="650" y2="-3" stroke="#999" strokeWidth="1.5" />
              <line x1="500" y1="-7" x2="500" y2="1" stroke="#999" strokeWidth="1.5" />
              <line x1="575" y1="-6" x2="575" y2="0" stroke="#999" strokeWidth="1" />
              <line x1="650" y1="-7" x2="650" y2="1" stroke="#999" strokeWidth="1.5" />
              <text x="500" y="10" fontSize="7.5" fill="#888" textAnchor="middle">0</text>
              <text x="575" y="10" fontSize="7.5" fill="#888" textAnchor="middle">25m</text>
              <text x="650" y="10" fontSize="7.5" fill="#888" textAnchor="middle">50m</text>
            </g>
          </svg>
        </div>

        {/* Selected Plot Luxury Details Dossier */}
        {selectedPlot ? (
          <aside
            className="flex flex-col justify-between bg-white border border-line rounded-lg shadow-sm p-4 sm:p-6"
            aria-label={`Details for Plot ${selectedPlot.number}`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-line">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest" />
                  <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                    SPECIFICATION DOSSIER
                  </span>
                </div>
                <span
                  className={`text-[10px] uppercase font-semibold px-2.5 py-1 rounded border tracking-wider ${
                    selectedPlot.status === "available"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : selectedPlot.status === "reserved"
                      ? "bg-amber-50 text-amber-800 border-amber-300"
                      : "bg-stone-100 text-stone-700 border-stone-300"
                  }`}
                >
                  {selectedPlot.status === "available"
                    ? "Available · Ready"
                    : selectedPlot.status === "reserved"
                    ? "Under Reservation"
                    : "Allocated / Sold"}
                </span>
              </div>

              {/* Title & Area Hero */}
              <div className="my-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-bold font-display text-foreground m-0 tracking-tight">
                    Plot #{selectedPlot.number}
                  </h3>
                  {selectedPlot.corner && (
                    <span className="text-[10px] font-semibold text-amber-900 bg-amber-100/80 border border-amber-300/70 px-2 py-0.5 rounded-full">
                      Corner Premium
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-xs mt-1.5 flex items-baseline gap-1.5">
                  <strong className="text-foreground text-base font-semibold">{selectedPlot.area} sq. yd.</strong>
                  <span>(approx. {(selectedPlot.area * 9).toLocaleString()} sq. ft.)</span>
                </p>
              </div>

              {/* Grid Specifications Box */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 p-4 bg-[#FAF9F5] border border-line rounded-md text-xs">
                <div>
                  <span className="text-[9.5px] uppercase tracking-wider text-muted-foreground block font-medium">
                    Plot Boundary
                  </span>
                  <strong className="text-foreground font-semibold block mt-0.5">
                    {selectedPlot.dimensions}
                  </strong>
                </div>
                <div>
                  <span className="text-[9.5px] uppercase tracking-wider text-muted-foreground block font-medium">
                    Facing Direction
                  </span>
                  <strong className="text-foreground font-semibold block mt-0.5">
                    {selectedPlot.facing} Facing
                  </strong>
                </div>
                <div>
                  <span className="text-[9.5px] uppercase tracking-wider text-muted-foreground block font-medium">
                    Approach Road
                  </span>
                  <strong className="text-foreground font-semibold block mt-0.5">
                    {selectedPlot.roadWidth}m Wide Avenue
                  </strong>
                </div>
                <div>
                  <span className="text-[9.5px] uppercase tracking-wider text-muted-foreground block font-medium">
                    Building Envelope
                  </span>
                  <strong className="text-foreground font-semibold block mt-0.5">
                    G + 2 Floors Permitted
                  </strong>
                </div>
              </div>

              {/* Key Amenities Proximity */}
              <div className="my-5">
                <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2.5 tracking-wider">
                  Township Proximity:
                </span>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {selectedPlot.landmarks.map((landmark, i) => (
                    <li key={i} className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-forest shrink-0" />
                      <span className="text-foreground/80">{landmark}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-line mt-2">
              <Link
                to="/virtual-tour/$id"
                params={{ id: projectId }}
                className="flex items-center justify-center gap-2 w-full h-11 px-4 rounded-md bg-forest text-white font-medium text-xs hover:opacity-90 transition-opacity shadow-sm"
              >
                <Compass className="w-4 h-4" />
                <span>View Plot #{selectedPlot.number} in 3D</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center justify-center w-full h-10 px-4 rounded-md border border-line bg-transparent text-foreground font-medium text-xs hover:bg-secondary transition-colors"
              >
                <span>Enquire About Plot #{selectedPlot.number}</span>
              </Link>
            </div>
          </aside>
        ) : (
          <div
            className="flex flex-col justify-center border border-line rounded-lg text-center bg-white p-6 sm:p-8"
          >
            <Compass className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground text-xs">
              Click any plot on the master plan to view exact dimensions, facing orientation, and approval dossier.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
