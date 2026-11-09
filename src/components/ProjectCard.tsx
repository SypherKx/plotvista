import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Compass } from "lucide-react";
import type { Project } from "@/types/plot";

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className = "" }: ProjectCardProps) {
  return (
    <article className={`project-card ${className}`}>
      <Link
        to="/projects/$id"
        params={{ id: project.id }}
        className="project-image-link group"
        aria-label={`View details for ${project.name}`}
      >
        <img
          src={project.image}
          alt={project.alt || project.name}
          loading="lazy"
        />
        <div className="image-view-tag flex items-center gap-1.5 shadow-sm">
          <Compass className="w-3.5 h-3.5 text-emerald-700" />
          <span>Interactive 3D Available</span>
        </div>
      </Link>

      <div className="project-meta">
        <div>
          <span className="demo-tag">RERA DEMO</span>
          <h3 className="project-title">
            <Link to="/projects/$id" params={{ id: project.id }}>
              {project.name}
            </Link>
          </h3>
          <p className="project-location">
            {project.locality}, {project.city}
          </p>
        </div>
        <span className="status-badge">{project.status}</span>
      </div>

      <div className="project-facts">
        <span>{project.plots} plots</span>
        <span>•</span>
        <span>{project.size}</span>
        <span>•</span>
        <span>{project.roadWidths} roads</span>
      </div>

      <div className="line" />

      <div className="project-footer">
        <Link
          to="/virtual-tour/$id"
          params={{ id: project.id }}
          className="text-link font-semibold"
        >
          <Compass className="w-4 h-4 text-forest" />
          <span>Launch 3D Tour</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          to="/projects/$id"
          params={{ id: project.id }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Layout Specs →
        </Link>
      </div>
    </article>
  );
}

