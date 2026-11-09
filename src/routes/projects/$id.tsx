import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Calendar,
  Layers,
  Ruler,
  FileText,
  CheckCircle,
  Phone,
  Mail,
  Send,
} from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { PlotPlan } from "@/components/PlotPlan";
import { projects, images } from "@/data/projects";

export const Route = createFileRoute("/projects/$id")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.id === params.id);
    if (!project) {
      throw notFound();
    }
    return { project };
  },
  component: ProjectDetailPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.project
          ? `${loaderData.project.name} (${loaderData.project.city}) — PlotVista`
          : "Project Details — PlotVista",
      },
      {
        name: "description",
        content: loaderData?.project?.description || "Project details and interactive plot layout.",
      },
    ],
  }),
});

function ProjectDetailPage() {
  const { project } = Route.useLoaderData();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    plotPreference: "150-250 sq. yd.",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSubmitted(true);
  };

  const distances = [
    { name: "National Highway Access", distance: "1.2 km", percent: 15 },
    { name: "Nearest Metro / Railway Hub", distance: "4.8 km", percent: 45 },
    { name: "Major Multispeciality Hospital", distance: "3.5 km", percent: 35 },
    { name: "International School Campus", distance: "2.1 km", percent: 22 },
    { name: "City Commercial Centre", distance: "8.0 km", percent: 75 },
    { name: "Regional Airport Terminal", distance: "18.5 km", percent: 90 },
  ];

  return (
    <SiteLayout isHero={true}>
      {/* Project Hero Banner */}
      <section className="project-hero">
        <img
          src={project.image}
          alt={project.alt || project.name}
          className="w-full h-full object-cover"
        />

        <div className="project-hero-content wrap">
          <div className="eyebrow">
            {project.city} · {project.locality}
          </div>
          <h1>{project.name}</h1>

          <div className="project-hero-bottom">
            <div>
              <p>{project.description}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-white/80">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Coordinates: {project.coordinates}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto mt-4 sm:mt-0">
              <Link
                to="/virtual-tour/$id"
                params={{ id: project.id }}
                className="primary-link w-full sm:w-auto justify-center"
                style={{ background: "white", color: "var(--foreground)", borderColor: "white" }}
              >
                <Compass className="w-4 h-4 text-emerald-800" />
                <span>3D Virtual Tour</span>
              </Link>
              <a href="#enquiry" className="outline-link w-full sm:w-auto justify-center">
                <span>Request Callback</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Sub-nav */}
      <nav className="project-subnav" aria-label="Project section navigation">
        <a href="#overview">Overview & Specs</a>
        <a href="#master-plan">Master Plan Layout</a>
        <a href="#surroundings">Connectivity & Distances</a>
        <a href="#gallery">Township Gallery</a>
        <a href="#enquiry">Book Site Visit</a>
      </nav>

      {/* Overview Section */}
      <section id="overview" className="project-section">
        <div className="wrap">
          <div className="project-overview-grid">
            <div>
              <div className="eyebrow">LAYOUT SPECIFICATIONS</div>
              <h2>Designed for spacious living and lasting value.</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mt-4">
                {project.name} combines serene residential tranquility with direct arterial connectivity.
                Featuring wide 9m and 12m paved boulevards, dedicated green buffer corridors, and underground
                drainage and electric lines, the township provides immediate readiness for home construction.
              </p>

              <div className="mt-8 flex items-center gap-3 p-4 bg-emerald-50 text-emerald-950 rounded border border-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <strong className="text-xs font-semibold block">Official RERA Registration</strong>
                  <span className="text-xs text-emerald-800">{project.approval}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="project-facts-table">
                <div className="fact-row">
                  <span>Total Planned Plots</span>
                  <strong>{project.plots} Units</strong>
                </div>
                <div className="fact-row">
                  <span>Plot Size Range</span>
                  <strong>{project.size}</strong>
                </div>
                <div className="fact-row">
                  <span>Development Phase</span>
                  <strong>{project.phase}</strong>
                </div>
                <div className="fact-row">
                  <span>Internal Road Widths</span>
                  <strong>{project.roadWidths}</strong>
                </div>
                <div className="fact-row">
                  <span>Possession Status</span>
                  <strong>{project.possession}</strong>
                </div>
                <div className="fact-row">
                  <span>Title Verification</span>
                  <strong>Clear Freehold / 30-Year Search Complete</strong>
                </div>
                <div className="fact-row">
                  <span>Utilities Planned</span>
                  <strong>Underground Electricity, Rainwater Harvesting</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Master Plan Section */}
      <section id="master-plan" className="project-section alt">
        <div className="wrap">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="eyebrow">INTERACTIVE LAYOUT</div>
              <h2 className="text-3xl font-semibold mt-2">Master Plan & Plot Availability</h2>
            </div>
            <Link
              to="/virtual-tour/$id"
              params={{ id: project.id }}
              className="text-link"
            >
              <span>Explore in 3D Mode</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="project-plan-wrap">
            <PlotPlan projectId={project.id} />
          </div>
        </div>
      </section>

      {/* Connectivity & Surroundings */}
      <section id="surroundings" className="project-section">
        <div className="wrap">
          <div className="surroundings-grid">
            <div>
              <div className="eyebrow">CONNECTIVITY & INFRASTRUCTURE</div>
              <h2 className="text-3xl font-semibold mt-2">Strategic location in a high-growth sector.</h2>
              <p className="text-muted-foreground text-sm mt-4">
                Situated close to key transit spines, leading academic campuses, and healthcare centres.
                Future metro expansion and highway widening projects provide strong long-term appreciation.
              </p>
            </div>

            <div>
              <div className="distance-list">
                {distances.map((item, idx) => (
                  <div key={idx} className="distance-row">
                    <span>{item.name}</span>
                    <div className="distance-track">
                      <span style={{ width: `${item.percent}%` }} />
                    </div>
                    <strong className="text-right">{item.distance}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="project-section alt">
        <div className="wrap">
          <div className="eyebrow">VISUAL SHOWCASE</div>
          <h2 className="text-3xl font-semibold mt-2">Township Perspectives</h2>

          <div className="gallery-grid">
            <img
              src={project.image}
              alt={`${project.name} primary boulevard`}
              className="rounded-sm"
            />
            <div className="gallery-stack">
              <img
                src={images.aerial.src}
                alt={`${project.name} planned green corridors`}
                className="rounded-sm"
              />
              <img
                src={images.hero.src}
                alt={`${project.name} tree lined street`}
                className="rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Enquiry Form Section */}
      <section id="enquiry" className="project-section">
        <div className="wrap">
          <div className="enquiry-layout">
            <div>
              <div className="eyebrow">SCHEDULE A VISIT</div>
              <h2 className="text-3xl font-semibold mt-2">Reserve a plot or request a private site visit.</h2>
              <p className="text-muted-foreground text-sm mt-4">
                Our local township coordinators are available on-site Monday through Sunday.
                We provide complete document verification kits, boundary demarcations, and assistance with home-loan approvals.
              </p>

              <div className="mt-8 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-700" />
                  <span>Direct Site Helpdesk: +91 (800) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-emerald-700" />
                  <span>site-enquiries@plotvista.demo</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>Guided Visits: 9:30 AM – 6:00 PM Daily</span>
                </div>
              </div>
            </div>

            <div>
              {formSubmitted ? (
                <div className="p-8 bg-emerald-50 border border-emerald-300 rounded text-center">
                  <CheckCircle className="w-12 h-12 text-emerald-700 mx-auto mb-3" />
                  <h3 className="text-xl font-semibold text-emerald-950">Enquiry Received</h3>
                  <p className="text-emerald-800 text-sm mt-2 max-w-sm mx-auto">
                    Thank you, {formData.name}. Our township coordinator for {project.name} will contact you within 2 business hours with the legal dossier and plot layout map.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormSubmitted(false);
                      setFormData({ name: "", phone: "", email: "", plotPreference: "150-250 sq. yd.", message: "" });
                    }}
                    className="mt-6 text-xs text-emerald-900 underline hover:text-emerald-950 font-medium"
                  >
                    Submit another enquiry
                  </button>
                </div>
              ) : (
                <form className="enquiry-form" onSubmit={handleSubmit}>
                  <div className="form-field">
                    <label htmlFor="name">Your Full Name *</label>
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      id="phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="rahul@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="preference">Preferred Plot Size</label>
                    <select
                      id="preference"
                      value={formData.plotPreference}
                      onChange={(e) => setFormData({ ...formData, plotPreference: e.target.value })}
                    >
                      <option value="120-180 sq. yd.">120 – 180 sq. yd. (Compact)</option>
                      <option value="180-250 sq. yd.">180 – 250 sq. yd. (Medium)</option>
                      <option value="250-400 sq. yd.">250 – 400 sq. yd. (Spacious)</option>
                      <option value="Corner Plot Only">Corner Plot Only</option>
                    </select>
                  </div>

                  <div className="form-field full">
                    <label htmlFor="message">Message or Questions (Optional)</label>
                    <textarea
                      id="message"
                      rows={3}
                      placeholder="Mention your preferred facing direction or planned construction date..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <div className="form-field full">
                    <button type="submit" className="primary-link w-full justify-center">
                      <Send className="w-4 h-4 mr-2" />
                      <span>Submit Request for {project.name}</span>
                    </button>
                    <p className="text-[11px] text-muted-foreground text-center mt-2">
                      Zero brokerage · We respect your privacy and never share phone numbers.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

