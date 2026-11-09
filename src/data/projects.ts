import heroImage from "@/assets/plotvista-hero.jpg";
import valleyImage from "@/assets/plotvista-green-valley.jpg";
import meadowsImage from "@/assets/plotvista-urban-meadows.jpg";
import aerialImage from "@/assets/plotvista-aerial.jpg";
import streetFront from "@/assets/street-view-front.jpg";
import streetPorch from "@/assets/street-view-porch.jpg";
import streetLeft from "@/assets/street-view-left.jpg";
import streetRight from "@/assets/street-view-right.jpg";
import streetEast from "@/assets/street-view-east.jpg";
import streetRear from "@/assets/street-view-rear.jpg";
import streetWest from "@/assets/street-view-west.jpg";
import streetAerial from "@/assets/street-view-aerial.jpg";
import type { Plot, Project, ViewMode } from "@/types/plot";

export const images = {
  hero: { src: heroImage, alt: "A quiet, tree-lined residential road at Green Valley Residency" },
  greenValley: { src: valleyImage, alt: "Tree-lined plots and a residential avenue in Kanpur" },
  urbanMeadows: { src: meadowsImage, alt: "A landscaped residential street in Lucknow" },
  aerial: { src: aerialImage, alt: "Aerial view of a planned township with plots and a central park" },
  streetView: {
    front: streetFront,
    porch: streetPorch,
    left: streetLeft,
    right: streetRight,
    east: streetEast,
    rear: streetRear,
    west: streetWest,
    aerial: streetAerial,
  },
};

export const projects: Project[] = [
  { id: "green-valley-residency", name: "Green Valley Residency", city: "Kanpur", locality: "Bithoor Road", image: valleyImage, alt: images.greenValley.alt, plots: 86, size: "150–400 sq. yd.", status: "Now open", phase: "Phase 2", roadWidths: "9 m and 12 m", approval: "Demo registration: UP-RERA/2026/0417", possession: "Ready to build", coordinates: "26.5142° N · 80.2785° E", description: "A quieter kind of neighbourhood, set along a generous avenue with an open green at its heart." },
  { id: "urban-meadows", name: "The Urban Meadows", city: "Lucknow", locality: "Sultanpur Road", image: meadowsImage, alt: images.urbanMeadows.alt, plots: 124, size: "120–360 sq. yd.", status: "Phase 2", phase: "Phase 2", roadWidths: "9 m and 12 m", approval: "Demo registration: UP-RERA/2026/0821", possession: "In development", coordinates: "26.7421° N · 81.0048° E", description: "An easy-going street plan framed by established trees and small neighbourhood parks." },
  { id: "serenity-enclave", name: "Serenity Enclave", city: "Noida", locality: "Sector 150", image: aerialImage, alt: images.aerial.alt, plots: 72, size: "180–450 sq. yd.", status: "Few plots left", phase: "Final release", roadWidths: "12 m and 18 m", approval: "Demo registration: UP-RERA/2026/1160", possession: "Ready to build", coordinates: "28.4236° N · 77.4819° E", description: "A considered layout in a greener corner of the city, with a central park and wide approach roads." },
  { id: "oakwood-township", name: "Oakwood Township", city: "Jaipur", locality: "Ajmer Road", image: valleyImage, alt: "A landscaped road with plots in a residential township", plots: 98, size: "140–380 sq. yd.", status: "Now open", phase: "Phase 1", roadWidths: "9 m and 15 m", approval: "Demo registration: RJ-RERA/2026/0238", possession: "In development", coordinates: "26.8672° N · 75.6758° E", description: "A small collection of residential streets woven around a central green and garden walk." },
  { id: "riverstone-greens", name: "Riverstone Greens", city: "Prayagraj", locality: "Naini", image: aerialImage, alt: images.aerial.alt, plots: 110, size: "120–320 sq. yd.", status: "Now open", phase: "Phase 1", roadWidths: "9 m and 12 m", approval: "Demo registration: UP-RERA/2026/1324", possession: "Ready to build", coordinates: "25.3940° N · 81.8574° E", description: "Open plots and leafy streets in a connected, steadily growing part of Prayagraj." },
  { id: "the-courtyard", name: "The Courtyard", city: "Agra", locality: "Shamshabad Road", image: meadowsImage, alt: images.urbanMeadows.alt, plots: 64, size: "160–400 sq. yd.", status: "Phase 2", phase: "Phase 2", roadWidths: "9 m and 12 m", approval: "Demo registration: UP-RERA/2026/0906", possession: "In development", coordinates: "27.1461° N · 77.9705° E", description: "A quieter residential setting shaped around a shared garden and walkable internal roads." },
  { id: "cedar-park", name: "Cedar Park", city: "Gurugram", locality: "Sohna Road", image: valleyImage, alt: "A green residential avenue with open land", plots: 92, size: "180–500 sq. yd.", status: "Few plots left", phase: "Final release", roadWidths: "12 m and 18 m", approval: "Demo registration: HR-RERA/2026/0550", possession: "Ready to build", coordinates: "28.2475° N · 77.0656° E", description: "A garden-led layout where open space and quiet internal roads are close at hand." },
  { id: "meadowlane", name: "Meadowlane", city: "Varanasi", locality: "Rohania", image: aerialImage, alt: images.aerial.alt, plots: 78, size: "120–340 sq. yd.", status: "Now open", phase: "Phase 1", roadWidths: "9 m and 12 m", approval: "Demo registration: UP-RERA/2026/1418", possession: "In development", coordinates: "25.2812° N · 82.8891° E", description: "A compact residential neighbourhood with a clear layout and a leafy pace." },
];

export const featuredProjects = projects.slice(0, 4);
export const cities = [...new Set(projects.map((project) => project.city))];

export const plots: Plot[] = Array.from({ length: 24 }, (_, index) => {
  const column = index % 6;
  const row = Math.floor(index / 6);
  
  // Layout coordinates for luxury 970x640 architectural grid
  const x = 90 + column * 135;
  const y = row === 0 ? 50 : row === 1 ? 190 : row === 2 ? 360 : 500;
  const width = 110;
  const height = 90;

  const status = index % 9 === 4 ? "reserved" : index % 11 === 8 ? "sold" : "available";
  const cameraPresets: Record<ViewMode, { position: [number, number, number]; target: [number, number, number]; fov: number }> = {
    aerial: { position: [x + width / 2, 70, y + height / 2], target: [x + width / 2, 0, y + height / 2], fov: 48 },
    street: { position: [x + width / 2, 2, y - 15], target: [x + width / 2, 1, y + height / 2], fov: 68 },
    plot: { position: [x + 10, 2, y - 5], target: [x + width / 2, 0, y + height / 2], fov: 54 },
  };

  const facingList = ["North", "East", "South", "West"] as const;
  const facing = row === 0 || row === 2 ? "North" : "South";
  const corner = column === 0 || column === 5;
  const roadWidth = row === 1 || row === 2 ? 14 : 9;

  return {
    id: `plot-${index + 1}`,
    number: index + 1,
    polygon: [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
    ],
    area: 160 + ((index * 20) % 180),
    facing,
    corner,
    status,
    roadWidth,
    dimensions: corner ? "14 m × 18 m" : "12 m × 15 m",
    landmarks: [
      row === 1 || row === 2 ? "Direct Central Boulevard access" : "Quiet Internal Avenue",
      corner ? "Two-side open corner plot" : "Standard residential frontage",
      "Central Park green walk · 90 m",
      "Main security gate · 220 m",
    ],
    cameraPresets,
  };
});

export const viewModes: { id: ViewMode; label: string }[] = [
  { id: "aerial", label: "Aerial" },
  { id: "street", label: "Street" },
  { id: "plot", label: "Plot" },
];