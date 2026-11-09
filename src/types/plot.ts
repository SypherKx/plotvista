export type PlotStatus = "available" | "reserved" | "sold";
export type ViewMode = "aerial" | "street" | "plot";

export interface Plot {
  id: string;
  number: number;
  polygon: { x: number; y: number }[];
  area: number;
  facing: "North" | "South" | "East" | "West";
  corner: boolean;
  status: PlotStatus;
  roadWidth: number;
  dimensions: string;
  landmarks: string[];
  cameraPresets: Record<ViewMode, { position: [number, number, number]; target: [number, number, number]; fov: number }>;
}

export type Project = {
  id: string;
  name: string;
  city: string;
  locality: string;
  image: string;
  alt: string;
  plots: number;
  size: string;
  status: string;
  phase: string;
  roadWidths: string;
  approval: string;
  possession: string;
  coordinates: string;
  description: string;
};