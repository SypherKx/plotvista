import { useState, useId, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import {
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Navigation,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Info,
  MapPin,
  CheckCircle,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  Move,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Share2,
} from "lucide-react";
import { plots, images } from "@/data/projects";
import type { Plot, ViewMode } from "@/types/plot";

export type StreetViewWaypoint =
  | "front"
  | "porch"
  | "right"
  | "east"
  | "rear"
  | "west"
  | "left";

interface Hotspot {
  id: string;
  title: string;
  label: string;
  position: { lon: number; lat: number }; // Spherical coordinates on the 360 sphere
  screenPos?: { left: string; top: string };
  details: string;
  specs: string;
}

interface WaypointConfig {
  id: StreetViewWaypoint;
  address: string;
  roadName: string;
  subLocation: string;
  initialLon: number;
  initialLat: number;
  radar: { x: number; y: number }; // Percentage on minimap
  image: string;
  connections: {
    target: StreetViewWaypoint;
    label: string;
    roadHeading: number;
    distanceText: string;
    chevronStyle: { left: string; top: string; rotation: number };
  }[];
  hotspots: Hotspot[];
}

interface PlotViewer3DProps {
  projectId?: string;
  selectedPlotId?: string | null;
  onSelectPlot?: (plot: Plot) => void;
  variant?: "preview" | "full";
  initialMode?: ViewMode;
}

export function PlotViewer3D({
  selectedPlotId = null,
  onSelectPlot,
  variant = "preview",
  initialMode = "street",
}: PlotViewer3DProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [waypoint, setWaypoint] = useState<StreetViewWaypoint>("front");
  const [lighting, setLighting] = useState<"morning" | "noon" | "golden">("golden");
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isWarping, setIsWarping] = useState(false);
  const [isMinimapExpanded, setIsMinimapExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentFov, setCurrentFov] = useState(72);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const compassNeedleRef = useRef<HTMLDivElement>(null);
  const pegmanConeRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);
  const textureLoaderRef = useRef<THREE.TextureLoader | null>(null);
  const texturesCacheRef = useRef<Map<string, THREE.Texture>>(new Map());

  // Camera angles (Spherical coordinates)
  const lonRef = useRef<number>(0);
  const latRef = useRef<number>(0);
  const targetLonRef = useRef<number>(0);
  const targetLatRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);
  const pointerStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pointerLonStartRef = useRef<number>(0);
  const pointerLatStartRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activePlot = plots.find((p) => p.id === selectedPlotId) || plots[11] || plots[0];

  // 8 Complete Street View Network Waypoints matching Google Maps schema
  const waypoints: Record<StreetViewWaypoint, WaypointConfig> = {
    front: {
      id: "front",
      roadName: "12M Grand Central Boulevard",
      address: "Plot #12, Phase 2, Green Valley Residency",
      subLocation: "Bithoor Road, Kanpur, UP · 208017",
      initialLon: 0,
      initialLat: -2,
      radar: { x: 48, y: 22 },
      image: images.streetView.front,
      connections: [
        {
          target: "porch",
          label: "Driveway & Porch",
          roadHeading: 0,
          distanceText: "6m ahead",
          chevronStyle: { left: "50%", top: "72%", rotation: 0 },
        },
        {
          target: "right",
          label: "12M Boulevard East",
          roadHeading: 55,
          distanceText: "25m ahead",
          chevronStyle: { left: "74%", top: "70%", rotation: 40 },
        },
        {
          target: "left",
          label: "West Corner Avenue",
          roadHeading: 315,
          distanceText: "20m left",
          chevronStyle: { left: "26%", top: "70%", rotation: -40 },
        },
      ],
      hotspots: [
        {
          id: "demarcation-pillar",
          title: "GPS Demarcation Pillar #12",
          label: "Survey Marker",
          position: { lon: -28, lat: -14 },
          screenPos: { left: "28%", top: "66%" },
          details: "Survey-grade concrete monument with embedded brass survey nail aligned with UP-RERA master plan.",
          specs: "Frontage: 14.0m · Depth: 18.0m · 252 sq. yd.",
        },
        {
          id: "vastu-gate",
          title: "Main Vehicular Entrance Gate",
          label: "Vastu North 0°",
          position: { lon: -2, lat: -4 },
          screenPos: { left: "50%", top: "52%" },
          details: "Motorized architectural teak louvers sliding gate with biometric access control.",
          specs: "Clear Entrance Width: 6.0 Meters",
        },
        {
          id: "boulevard-curb",
          title: "12M Heavy-Duty Interlocking Boulevard",
          label: "Paved Avenue",
          position: { lon: 26, lat: -22 },
          screenPos: { left: "76%", top: "76%" },
          details: "M40 grade interlocking concrete pavers with concealed stormwater drainage channels and 150mm stone kerbs.",
          specs: "12m Clear Width · Dual Vehicle Passing",
        },
      ],
    },
    porch: {
      id: "porch",
      roadName: "Private Driveway & Covered Car Porch",
      address: "Plot #12 Entrance Porch, Green Valley Residency",
      subLocation: "Bithoor Road, Kanpur, UP",
      initialLon: 0,
      initialLat: 2,
      radar: { x: 48, y: 35 },
      image: images.streetView.porch,
      connections: [
        {
          target: "front",
          label: "12M Grand Central Boulevard",
          roadHeading: 180,
          distanceText: "Step back",
          chevronStyle: { left: "50%", top: "82%", rotation: 180 },
        },
        {
          target: "east",
          label: "East Garden Setback",
          roadHeading: 90,
          distanceText: "12m east",
          chevronStyle: { left: "76%", top: "68%", rotation: 50 },
        },
        {
          target: "west",
          label: "West Perimeter Walk",
          roadHeading: 270,
          distanceText: "12m west",
          chevronStyle: { left: "24%", top: "68%", rotation: -50 },
        },
      ],
      hotspots: [
        {
          id: "unit-plaque",
          title: "Cast Brass Unit Plate 'Plot 12'",
          label: "Official Plot ID",
          position: { lon: -16, lat: -4 },
          screenPos: { left: "36%", top: "58%" },
          details: "Official municipal and RERA sanctioned residential allotment plaque on sand-blasted teak pillar.",
          specs: "Deed Lot #12 / Sanctioned G+2",
        },
        {
          id: "car-porch",
          title: "Cantilevered Weatherproof Car Porch",
          label: "Covered Parking",
          position: { lon: 8, lat: 14 },
          screenPos: { left: "64%", top: "44%" },
          details: "RCC architectural cantilevered canopy with warm recessed spot lighting and EV home charging point.",
          specs: "Dual SUV Covered Parking",
        },
      ],
    },
    right: {
      id: "right",
      roadName: "12M Grand Central Boulevard (East Approach)",
      address: "Intersection East Boulevard, Green Valley Residency",
      subLocation: "Facing West toward Plot #12 Villa",
      initialLon: 0,
      initialLat: 0,
      radar: { x: 74, y: 18 },
      image: images.streetView.right,
      connections: [
        {
          target: "front",
          label: "Plot #12 Front Gate",
          roadHeading: -15,
          distanceText: "25m ahead",
          chevronStyle: { left: "32%", top: "72%", rotation: -30 },
        },
        {
          target: "east",
          label: "9M East Residential Avenue",
          roadHeading: 20,
          distanceText: "15m left",
          chevronStyle: { left: "74%", top: "72%", rotation: 40 },
        },
      ],
      hotspots: [
        {
          id: "east-boulevard",
          title: "East Boulevard Tree-Lined Corridor",
          label: "Township Parkway",
          position: { lon: -12, lat: -8 },
          screenPos: { left: "38%", top: "62%" },
          details: "Lush neem and ashoka tree corridor leading toward the 1.5-acre Central Park entrance.",
          specs: "100% Underground Cabling",
        },
        {
          id: "plot-11",
          title: "Adjacent Demarcated Plot #11",
          label: "Available Unit",
          position: { lon: 32, lat: -10 },
          screenPos: { left: "74%", top: "66%" },
          details: "Clear freehold residential parcel with surveyed boundary stones and immediate registry.",
          specs: "180 sq. yd. · South Facing",
        },
      ],
    },
    east: {
      id: "east",
      roadName: "9M East Residential Avenue",
      address: "East Perimeter of Plot #12, Green Valley Residency",
      subLocation: "Side Garden & Pedestrian Setback",
      initialLon: 0,
      initialLat: 0,
      radar: { x: 78, y: 48 },
      image: images.streetView.east,
      connections: [
        {
          target: "rear",
          label: "9M South Backyard Lane",
          roadHeading: 0,
          distanceText: "20m south",
          chevronStyle: { left: "50%", top: "76%", rotation: 0 },
        },
        {
          target: "right",
          label: "12M Grand Central Boulevard",
          roadHeading: -20,
          distanceText: "15m north",
          chevronStyle: { left: "28%", top: "68%", rotation: -50 },
        },
      ],
      hotspots: [
        {
          id: "east-setback",
          title: "3M Side Landscaped Setback",
          label: "Side Garden",
          position: { lon: -18, lat: -12 },
          screenPos: { left: "34%", top: "64%" },
          details: "Mandatory architectural setback landscaped with frangipani trees, ensuring 270° natural ventilation.",
          specs: "3.0m Clear Side Setback",
        },
        {
          id: "rainwater-pit",
          title: "Underground Rainwater Percolation Pit",
          label: "Eco Conduit",
          position: { lon: 18, lat: -26 },
          screenPos: { left: "72%", top: "76%" },
          details: "Groundwater recharge chamber compliant with UP Ground Water Conservation norms.",
          specs: "50,000L Percolation Capacity",
        },
      ],
    },
    rear: {
      id: "rear",
      roadName: "9M South Residential Lane",
      address: "Rear Lane, Behind Plot #12, Green Valley Residency",
      subLocation: "Backyard Lawn & Terrace Pergola Access",
      initialLon: 0,
      initialLat: 0,
      radar: { x: 50, y: 80 },
      image: images.streetView.rear,
      connections: [
        {
          target: "west",
          label: "9M West Side Avenue",
          roadHeading: -20,
          distanceText: "20m west",
          chevronStyle: { left: "28%", top: "72%", rotation: -40 },
        },
        {
          target: "east",
          label: "9M East Side Avenue",
          roadHeading: 20,
          distanceText: "20m east",
          chevronStyle: { left: "72%", top: "72%", rotation: 40 },
        },
        {
          target: "front",
          label: "Return to Front Boulevard",
          roadHeading: 0,
          distanceText: "Circuit loop",
          chevronStyle: { left: "50%", top: "82%", rotation: 180 },
        },
      ],
      hotspots: [
        {
          id: "backyard-lawn",
          title: "Private Enclosed Backyard Lawn",
          label: "Rear Garden",
          position: { lon: -6, lat: -10 },
          screenPos: { left: "42%", top: "68%" },
          details: "Quiet south-facing backyard garden with sliding glass terrace doors and warm perimeter uplighting.",
          specs: "6m Depth Rear Garden",
        },
        {
          id: "balcony-pergola",
          title: "Upper Floor Terrace Pergola",
          label: "Balcony Deck",
          position: { lon: 4, lat: 20 },
          screenPos: { left: "58%", top: "38%" },
          details: "Black architectural metal pergola providing natural shade to the second-floor master suite.",
          specs: "G+2 Sanctioned Height",
        },
      ],
    },
    west: {
      id: "west",
      roadName: "9M West Side Avenue",
      address: "West Perimeter of Plot #12, Green Valley Residency",
      subLocation: "Western Sun Louvers & Corner Lawn",
      initialLon: 0,
      initialLat: 0,
      radar: { x: 22, y: 48 },
      image: images.streetView.west,
      connections: [
        {
          target: "left",
          label: "Front-West Corner Lawn",
          roadHeading: 20,
          distanceText: "20m north",
          chevronStyle: { left: "68%", top: "72%", rotation: 40 },
        },
        {
          target: "rear",
          label: "9M South Backyard Lane",
          roadHeading: -20,
          distanceText: "20m south",
          chevronStyle: { left: "32%", top: "76%", rotation: -40 },
        },
      ],
      hotspots: [
        {
          id: "teak-louvers",
          title: "Vertical Teak Sun Louvers",
          label: "Passive Solar Shield",
          position: { lon: -12, lat: 10 },
          screenPos: { left: "38%", top: "46%" },
          details: "Precision-angled teak wood vertical louvers engineered to deflect harsh western summer afternoon heat.",
          specs: "44°C Peak Sun Heat Deflection",
        },
        {
          id: "lighting-curb",
          title: "Embedded Architectural Curb Lights",
          label: "Night Illumination",
          position: { lon: 18, lat: -20 },
          screenPos: { left: "74%", top: "76%" },
          details: "Warm LED low-glare pathway lights along stone curbing for clear pedestrian navigation at night.",
          specs: "3000K Warm White Architectural LEDs",
        },
      ],
    },
    left: {
      id: "left",
      roadName: "West Corner Avenue Intersection",
      address: "Corner Plot #12, Green Valley Residency",
      subLocation: "Two-Side Open Dual Road Frontage",
      initialLon: 0,
      initialLat: 0,
      radar: { x: 24, y: 20 },
      image: images.streetView.left,
      connections: [
        {
          target: "front",
          label: "12M Grand Central Boulevard",
          roadHeading: 20,
          distanceText: "18m right",
          chevronStyle: { left: "72%", top: "70%", rotation: 40 },
        },
        {
          target: "west",
          label: "9M West Side Avenue",
          roadHeading: -20,
          distanceText: "20m south",
          chevronStyle: { left: "28%", top: "72%", rotation: -40 },
        },
      ],
      hotspots: [
        {
          id: "corner-lawn",
          title: "Two-Side Open Corner Plot Advantage",
          label: "270° Openness",
          position: { lon: -16, lat: -12 },
          screenPos: { left: "42%", top: "64%" },
          details: "Dual-road frontage providing exceptional natural light, ventilation, and private garden privacy.",
          specs: "14m x 18m Dual Frontage",
        },
      ],
    },
  };

  const currentConfig = waypoints[waypoint] || waypoints.front;

  // Initialize Three.js WebGL Photosphere Scene
  useEffect(() => {
    if (typeof window === "undefined" || !isMounted || !canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 520;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(currentFov, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // 4. Curved Cylindrical Panoramic Arc Screen (Zero Seam, Zero Distortion)
    const radius = 500;
    const arcAngle = (155 * Math.PI) / 180; // 155 degree field of view arc
    const aspect = 1376 / 768; // 1.791667 natural photo aspect ratio
    const cylinderHeight = (radius * arcAngle) / aspect;

    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      cylinderHeight,
      64,
      1,
      true,
      -arcAngle / 2,
      arcAngle
    );

    const textureLoader = new THREE.TextureLoader();
    textureLoaderRef.current = textureLoader;

    // Load initial texture
    const initialTexture = textureLoader.load(currentConfig.image);
    initialTexture.colorSpace = THREE.SRGBColorSpace;
    texturesCacheRef.current.set(currentConfig.image, initialTexture);

    const material = new THREE.MeshBasicMaterial({
      map: initialTexture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 1,
    });
    const cylinderMesh = new THREE.Mesh(geometry, material);
    scene.add(cylinderMesh);
    sphereMeshRef.current = cylinderMesh;

    // Initialize camera position
    lonRef.current = currentConfig.initialLon || 0;
    latRef.current = currentConfig.initialLat || 0;
    targetLonRef.current = currentConfig.initialLon || 0;
    targetLatRef.current = currentConfig.initialLat || 0;

    // 5. Render Loop with Inertia / Damping & Clamped Panoramic Bounds
    const MAX_PAN_LON = 38;
    const MAX_PITCH_LAT = 15;

    const render = () => {
      animFrameIdRef.current = requestAnimationFrame(render);

      // Clamp target rotation within panoramic arc to guarantee NO seams or border clipping
      targetLonRef.current = Math.max(-MAX_PAN_LON, Math.min(MAX_PAN_LON, targetLonRef.current));
      targetLatRef.current = Math.max(-MAX_PITCH_LAT, Math.min(MAX_PITCH_LAT, targetLatRef.current));

      // Smooth camera interpolation (Inertia damping)
      lonRef.current += (targetLonRef.current - lonRef.current) * 0.14;
      latRef.current += (targetLatRef.current - latRef.current) * 0.14;

      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      camera.target.x = 500 * Math.sin(theta) * Math.sin(phi);
      camera.target.y = 500 * Math.cos(phi);
      camera.target.z = 500 * Math.cos(theta) * Math.sin(phi);
      camera.lookAt(camera.target);

      // Update compass needle and pegman cone via direct DOM refs (Zero React re-renders)
      const compassAngle = -lonRef.current;
      if (compassNeedleRef.current) {
        compassNeedleRef.current.style.transform = `rotate(${compassAngle}deg)`;
      }
      if (pegmanConeRef.current) {
        pegmanConeRef.current.style.transform = `translate(-50%, -50%) rotate(${compassAngle}deg)`;
      }

      renderer.render(scene, camera);
    };

    render();

    // Resize Observer
    const resizeObserver = new ResizeObserver(() => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      cameraRef.current.aspect = newW / newH;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newW, newH);
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [isMounted]);

  // Update Photosphere Texture on Waypoint Change with Google Street View Warp Zoom
  useEffect(() => {
    if (!sphereMeshRef.current || !textureLoaderRef.current) return;

    let targetTexture = texturesCacheRef.current.get(currentConfig.image);
    if (!targetTexture) {
      targetTexture = textureLoaderRef.current.load(currentConfig.image);
      targetTexture.colorSpace = THREE.SRGBColorSpace;
      texturesCacheRef.current.set(currentConfig.image, targetTexture);
    }

    const material = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
    material.map = targetTexture;
    material.needsUpdate = true;

    // Reset heading towards initial perspective of that node
    targetLonRef.current = currentConfig.initialLon;
    targetLatRef.current = currentConfig.initialLat;
  }, [waypoint]);

  // Google Street View Warp Transition Function
  const travelToWaypoint = (newWaypoint: StreetViewWaypoint, roadHeading: number = 0) => {
    setIsWarping(true);
    setActiveHotspot(null);

    // 1. Orient camera towards travel direction
    targetLonRef.current = Math.max(-25, Math.min(25, roadHeading));
    targetLatRef.current = 0;

    // 2. Camera warp forward animation
    if (cameraRef.current) {
      const origFov = cameraRef.current.fov;
      cameraRef.current.fov = Math.max(45, origFov - 18);
      cameraRef.current.updateProjectionMatrix();

      setTimeout(() => {
        setWaypoint(newWaypoint);
        if (cameraRef.current) {
          cameraRef.current.fov = origFov;
          cameraRef.current.updateProjectionMatrix();
        }
        setIsWarping(false);
      }, 240);
    } else {
      setTimeout(() => {
        setWaypoint(newWaypoint);
        setIsWarping(false);
      }, 240);
    }
  };

  // 360° Mouse / Touch Pan Controls
  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    pointerLonStartRef.current = targetLonRef.current;
    pointerLatStartRef.current = targetLatRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const factor = 0.14; // Sensitivity
    const deltaX = (e.clientX - pointerStartRef.current.x) * factor;
    const deltaY = (e.clientY - pointerStartRef.current.y) * factor;

    const MAX_PAN_LON = 38;
    const MAX_PITCH_LAT = 15;

    targetLonRef.current = Math.max(-MAX_PAN_LON, Math.min(MAX_PAN_LON, pointerLonStartRef.current - deltaX));
    targetLatRef.current = Math.max(-MAX_PITCH_LAT, Math.min(MAX_PITCH_LAT, pointerLatStartRef.current + deltaY));
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
  };

  // Zoom Controls (FOV)
  const handleZoom = (delta: number) => {
    if (!cameraRef.current) return;
    const newFov = Math.max(35, Math.min(95, cameraRef.current.fov + delta));
    cameraRef.current.fov = newFov;
    cameraRef.current.updateProjectionMatrix();
    setCurrentFov(newFov);
  };

  // Reset to North 0°
  const handleResetNorth = () => {
    targetLonRef.current = 0;
    targetLatRef.current = 0;
    if (cameraRef.current) {
      cameraRef.current.fov = 72;
      cameraRef.current.updateProjectionMatrix();
      setCurrentFov(72);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`street-view-container relative select-none rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black font-sans touch-pan-y ${
        isFullscreen
          ? "fixed inset-0 z-50 rounded-none w-screen h-screen"
          : variant === "full"
          ? "w-full h-[76vh] min-h-[480px] sm:h-[680px]"
          : "w-full h-[420px] sm:h-[540px]"
      }`}
    >
      {/* Three.js 360° WebGL Canvas or Static SSR Preview */}
      {isMounted ? (
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-full cursor-grab active:cursor-grabbing block"
        />
      ) : (
        <img
          src={currentConfig.image}
          alt={currentConfig.roadName}
          className="w-full h-full object-cover block"
        />
      )}

      {/* Google Street View Motion Warp Flash Effect */}
      {isWarping && (
        <div className="absolute inset-0 bg-white/30 backdrop-blur-md pointer-events-none transition-opacity duration-200 z-30 animate-pulse" />
      )}

      {/* ----------------- GOOGLE STREET VIEW AUTHENTIC CHROME ----------------- */}

      {/* TOP LEFT: Google Street View Address Card */}
      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 z-20 flex items-start gap-2 max-w-[calc(100%-115px)] sm:max-w-md pointer-events-none">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => travelToWaypoint("front", 0)}
          className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/90 hover:bg-slate-800 text-white flex items-center justify-center shadow-lg border border-white/20 transition-all hover:scale-105 shrink-0 cursor-pointer"
          title="Return to 12M Front Boulevard"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        {/* Address & Township Card */}
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-md border border-white/20 rounded-lg p-2 sm:p-2.5 px-3 sm:px-3.5 shadow-2xl text-white">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <h2 className="text-xs sm:text-sm font-semibold tracking-tight text-white line-clamp-1">
              {currentConfig.roadName}
            </h2>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-0.5 line-clamp-1">
            {currentConfig.address}
          </p>
          <div className="hidden sm:flex items-center gap-2 mt-1 pt-1 border-t border-white/10 text-[9.5px] font-mono text-slate-400">
            <span className="text-emerald-400 font-bold">Street View — Nov 2026</span>
            <span>·</span>
            <span>UP-RERA Verified</span>
          </div>
        </div>
      </div>

      {/* TOP RIGHT: Google Street View Compass & Daylight Controls */}
      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
        {/* Sun Angle Simulator */}
        <button
          type="button"
          onClick={() =>
            setLighting((prev) =>
              prev === "golden" ? "morning" : prev === "morning" ? "noon" : "golden"
            )
          }
          className="h-8 sm:h-9 px-2 sm:px-3 rounded-md bg-slate-950/80 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-[11px] font-medium flex items-center gap-1 sm:gap-1.5 hover:bg-slate-900 transition-colors shadow-lg cursor-pointer"
          title="Toggle Solar Study (Morning / Noon / Golden Hour)"
        >
          <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
          <span className="hidden sm:inline capitalize">{lighting} Hour</span>
        </button>

        {/* Authentic Google Maps North Compass Widget */}
        <button
          type="button"
          onClick={handleResetNorth}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/25 shadow-xl flex items-center justify-center hover:bg-slate-900 transition-all cursor-pointer group"
          title="Align to True North (0°)"
        >
          <div
            ref={compassNeedleRef}
            className="w-6 h-6 sm:w-7 sm:h-7 relative flex items-center justify-center transition-transform duration-75"
            style={{ transform: "rotate(0deg)" }}
          >
            {/* Red needle pointing North */}
            <div className="w-0 h-0 border-l-[3.5px] sm:border-l-[4px] border-l-transparent border-r-[3.5px] sm:border-r-[4px] border-r-transparent border-b-[10px] sm:border-b-[12px] border-b-rose-500 absolute -top-1" />
            {/* White/grey needle pointing South */}
            <div className="w-0 h-0 border-l-[3.5px] sm:border-l-[4px] border-l-transparent border-r-[3.5px] sm:border-r-[4px] border-r-transparent border-t-[10px] sm:border-t-[12px] border-t-slate-300 absolute -bottom-1" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white border border-slate-700 absolute" />
          </div>
        </button>

        {/* Fullscreen Toggle */}
        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/25 shadow-xl flex items-center justify-center text-white hover:bg-slate-900 transition-all cursor-pointer"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen 360 View"}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
        </button>
      </div>

      {/* ----------------- GOOGLE STREET VIEW GROUND NAVIGATION DISCS (CHEVRONS) ----------------- */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {currentConfig.connections.map((conn) => (
          <div
            key={conn.target}
            className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: conn.chevronStyle.left, top: conn.chevronStyle.top }}
          >
            <button
              type="button"
              onClick={() => travelToWaypoint(conn.target, conn.roadHeading)}
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
              title={`Walk towards ${conn.label} (${conn.distanceText})`}
            >
              {/* Google Maps Style Flat Pavement Ring & Chevron Arrow */}
              <div
                className="relative w-20 h-20 flex items-center justify-center transition-all duration-300 group-hover:scale-125"
                style={{
                  transform: `perspective(300px) rotateX(65deg) rotate(${conn.chevronStyle.rotation}deg)`,
                }}
              >
                {/* Outer pulsing ring on asphalt */}
                <div className="absolute inset-0 rounded-full border-2 border-white/80 bg-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.6)] group-hover:bg-emerald-400/50 group-hover:border-white transition-all animate-pulse" />
                {/* Inner Street View Directional Chevron */}
                <div className="w-10 h-10 rounded-full bg-emerald-700/90 border border-white text-white flex items-center justify-center shadow-2xl">
                  <ArrowUp className="w-6 h-6 text-white stroke-[2.5]" />
                </div>
              </div>

              {/* Road Target Floating Tooltip */}
              <div className="px-2.5 py-1 rounded-md bg-slate-950/90 backdrop-blur-md border border-emerald-400/60 text-white text-[10.5px] font-semibold whitespace-nowrap shadow-2xl flex items-center gap-1.5 -mt-2 group-hover:bg-emerald-950 transition-colors">
                <span>{conn.label}</span>
                <span className="text-[9px] text-emerald-300 font-mono">({conn.distanceText})</span>
              </div>
            </button>
          </div>
        ))}

        {/* In-Scene Architectural Hotspots */}
        {currentConfig.hotspots.map((spotData) => (
          <div
            key={spotData.id}
            className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: spotData.screenPos?.left || "50%", top: spotData.screenPos?.top || "50%" }}
          >
            <button
              type="button"
              onClick={() => setActiveHotspot(activeHotspot?.id === spotData.id ? null : spotData)}
              className="relative group cursor-pointer focus:outline-none"
              aria-label={spotData.title}
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl border-2 border-white group-hover:scale-125 transition-transform">
                <MapPin className="w-3.5 h-3.5 fill-current" />
              </div>
              <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping pointer-events-none" />
              <div className="absolute left-1/2 -bottom-6 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-950/90 text-[9px] text-white border border-white/30 whitespace-nowrap group-hover:bg-emerald-950">
                {spotData.label}
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Hotspot Inspection Modal / Card */}
      {activeHotspot && (
        <div className="absolute top-24 left-6 z-30 max-w-[290px] p-4 rounded-xl bg-slate-950/95 backdrop-blur-md border border-emerald-500/60 text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/20">
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-bold font-mono">
              SPATIAL GROUND METRIC
            </span>
            <button
              type="button"
              onClick={() => setActiveHotspot(null)}
              className="text-white/60 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
          <h4 className="text-sm font-semibold mt-2">{activeHotspot.title}</h4>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">{activeHotspot.details}</p>
          <div className="mt-3 p-2 bg-emerald-950/70 rounded-lg border border-emerald-500/40">
            <span className="text-[9px] text-emerald-300 block uppercase font-bold font-mono">Verified Metric:</span>
            <strong className="text-xs text-emerald-100">{activeHotspot.specs}</strong>
          </div>
        </div>
      )}

      {/* ----------------- BOTTOM LEFT: GOOGLE STREET VIEW EXPANDABLE MINIMAP & PEGMAN ----------------- */}
      {/* Mobile Radar Toggle Button */}
      {!isMinimapExpanded && (
        <button
          type="button"
          onClick={() => setIsMinimapExpanded(true)}
          className="sm:hidden absolute bottom-16 left-3 z-20 h-8 px-2.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/25 text-white text-[10.5px] font-semibold flex items-center gap-1.5 shadow-xl pointer-events-auto cursor-pointer"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Radar Map</span>
        </button>
      )}

      <div
        className={`transition-all duration-300 pointer-events-auto rounded-xl overflow-hidden border border-white/30 bg-slate-950/90 backdrop-blur-md shadow-2xl p-2.5 ${
          isMinimapExpanded
            ? "absolute bottom-16 sm:bottom-4 left-3 sm:left-4 z-30 w-[calc(100%-24px)] max-w-xs sm:w-72 h-56 sm:h-64"
            : "hidden sm:block absolute bottom-4 left-4 z-20 w-40 h-36"
        }`}
      >
        <div className="flex items-center justify-between text-[8px] text-white/80 uppercase font-bold tracking-wider mb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Township Radar</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMinimapExpanded(!isMinimapExpanded)}
            className="text-[9px] text-emerald-400 hover:text-emerald-300 font-mono cursor-pointer"
          >
            {isMinimapExpanded ? "Close" : "Expand"}
          </button>
        </div>

        {/* Radar Graphic Map */}
        <div className="relative w-full h-[calc(100%-20px)] bg-slate-900/95 rounded-lg border border-white/10 overflow-hidden">
          {/* North Road (12m Main Boulevard) */}
          <div className="absolute top-2 left-0 right-0 h-4 bg-stone-700/60 flex items-center justify-center">
            <span className="text-[5.5px] text-white/60 tracking-widest font-mono">12M BOULEVARD</span>
          </div>
          {/* East Road */}
          <div className="absolute top-0 bottom-0 right-1 w-3.5 bg-stone-700/60" />
          {/* West Road */}
          <div className="absolute top-0 bottom-0 left-1 w-3.5 bg-stone-700/60" />
          {/* South Road */}
          <div className="absolute bottom-2 left-0 right-0 h-3.5 bg-stone-700/60 flex items-center justify-center">
            <span className="text-[5px] text-white/60 tracking-widest font-mono">9M SOUTH LANE</span>
          </div>

          {/* Plot #12 Villa Footprint */}
          <div className="absolute top-[28%] left-[26%] right-[26%] bottom-[28%] border border-emerald-400 bg-emerald-950/80 rounded-xs flex flex-col items-center justify-center">
            <span className="text-[7.5px] text-emerald-300 font-bold font-mono">PLOT #12</span>
            <span className="text-[5px] text-emerald-400/80">VILLA</span>
          </div>

          {/* Clickable Waypoint Nodes */}
          {(Object.keys(waypoints) as StreetViewWaypoint[]).map((wpKey) => {
            const wp = waypoints[wpKey];
            const isActive = waypoint === wpKey;
            return (
              <button
                key={wpKey}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  travelToWaypoint(wpKey, 0);
                }}
                className={`absolute w-3 h-3 -ml-[6px] -mt-[6px] rounded-full flex items-center justify-center transition-transform hover:scale-150 cursor-pointer ${
                  isActive
                    ? "bg-amber-400 border border-white z-20 scale-125 shadow-md"
                    : "bg-emerald-400/70 hover:bg-emerald-300 z-10"
                }`}
                style={{ left: `${wp.radar.x}%`, top: `${wp.radar.y}%` }}
                title={`Jump to ${wp.roadName}`}
              />
            );
          })}

          {/* Yellow Google Pegman Figure with Vision Cone Beam */}
          <div
            ref={pegmanConeRef}
            className="absolute transition-all duration-300 pointer-events-none"
            style={{
              left: `${currentConfig.radar.x}%`,
              top: `${currentConfig.radar.y}%`,
              transform: "translate(-50%, -50%) rotate(0deg)",
            }}
          >
            <div className="w-14 h-14 -ml-7 -mt-7 relative flex items-center justify-center">
              {/* Field of View Vision Flashlight Cone */}
              <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-amber-400/50 -mt-3.5" />
              {/* Yellow Pegman Dot */}
              <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow-xl absolute" />
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- BOTTOM RIGHT: GOOGLE ZOOM & FOOTNOTE CONTROLS ----------------- */}
      <div className="absolute bottom-16 sm:bottom-4 right-3 sm:right-4 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Zoom In / Zoom Out Controls */}
        <div className="flex flex-col rounded-lg overflow-hidden bg-slate-950/90 backdrop-blur-md border border-white/20 shadow-2xl">
          <button
            type="button"
            onClick={() => handleZoom(-10)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-white hover:bg-slate-800 transition-colors border-b border-white/15 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(10)}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Google Style Map Footnote */}
        <div className="hidden sm:block text-[9px] font-mono text-white/50 bg-slate-950/60 px-2 py-0.5 rounded backdrop-blur-xs">
          Imagery © 2026 PlotVista · UP-RERA Survey Coordinates Verified
        </div>
      </div>

      {/* ----------------- BOTTOM CENTER: GOOGLE STREET VIEW LOCATION SELECTOR RIBBON ----------------- */}
      <div className="absolute left-2.5 right-2.5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 bottom-2.5 sm:bottom-4 z-20 flex items-center gap-1.5 p-1 rounded-full bg-slate-950/90 backdrop-blur-md border border-white/20 shadow-2xl overflow-x-auto max-w-[calc(100%-20px)] sm:max-w-none scrollbar-none pointer-events-auto">
        {(Object.keys(waypoints) as StreetViewWaypoint[]).map((wpKey) => {
          const wp = waypoints[wpKey];
          const isActive = waypoint === wpKey;
          const labels: Record<StreetViewWaypoint, { icon: string; label: string }> = {
            front: { icon: "🚶", label: "12M Front Blvd" },
            porch: { icon: "🚪", label: "Driveway & Porch" },
            right: { icon: "📍", label: "Boulevard East" },
            east: { icon: "🌿", label: "East Side Garden" },
            rear: { icon: "🏡", label: "South Backyard" },
            west: { icon: "📐", label: "West Sun Louvers" },
            left: { icon: "🔄", label: "Corner Crossing" },
          };
          const item = labels[wpKey] || { icon: "📍", label: wp.roadName };
          return (
            <button
              key={wpKey}
              type="button"
              onClick={() => travelToWaypoint(wpKey, 0)}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/60 font-bold"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
