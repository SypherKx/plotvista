import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, CheckCircle, Send } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { cities } from "@/data/projects";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact PlotVista — Enquiries & Site Visits" },
      {
        name: "description",
        content:
          "Connect with our land advisory coordinators. Schedule guided on-site visits across Kanpur, Lucknow, Noida, and regional townships.",
      },
    ],
  }),
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Kanpur",
    subject: "Book a Site Visit",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
  };

  return (
    <SiteLayout>
      <div className="wrap">
        <div className="contact-layout">
          <div>
            <div className="eyebrow">GET IN TOUCH</div>
            <h1>Speak with our land advisors.</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mt-4">
              Whether you are evaluating a specific plot number or exploring township
              locations for future home construction, our advisory team provides complete
              document kits, boundary visits, and banking assistance.
            </p>

            <div className="contact-details">
              <div className="contact-line">
                <span>Central Advisory Office</span>
                <strong>PlotVista Towers, Sector 44, Gurugram, NCR — 122003</strong>
              </div>

              <div className="contact-line">
                <span>Telephone Advisory</span>
                <a href="tel:+918001234567">+91 (800) 123-4567</a>
              </div>

              <div className="contact-line">
                <span>Direct Enquiries</span>
                <a href="mailto:advisory@plotvista.demo">advisory@plotvista.demo</a>
              </div>

              <div className="contact-line">
                <span>Guided Visit Hours</span>
                <strong>Monday to Sunday · 9:00 AM – 6:30 PM IST</strong>
              </div>
            </div>

            <div className="contact-map">
              <div className="text-center p-4">
                <MapPin className="w-5 h-5 text-emerald-700 mx-auto mb-2" />
                <p className="font-semibold text-foreground text-xs">On-Site Helpdesks Active</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Available in Kanpur, Lucknow, Noida, Jaipur, Prayagraj, Agra, Gurugram & Varanasi
                </p>
              </div>
            </div>
          </div>

          <div>
            {submitted ? (
              <div className="p-8 bg-card border border-forest rounded-sm text-center">
                <CheckCircle className="w-12 h-12 text-forest mx-auto mb-3" />
                <h3 className="text-xl font-semibold text-foreground">Message Sent Successfully</h3>
                <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
                  Thank you, {formData.name}. Our dedicated coordinator for {formData.city} will reach out to you within 2 business hours on {formData.phone}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      city: "Kanpur",
                      subject: "Book a Site Visit",
                      message: "",
                    });
                  }}
                  className="mt-6 text-xs text-forest underline font-medium hover:opacity-80"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form className="enquiry-form bg-card p-8 border border-line rounded-sm" onSubmit={handleSubmit}>
                <div className="form-field">
                  <label htmlFor="contact-name">Full Name *</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-phone">Phone Number *</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="vikram@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="contact-city">City of Interest</label>
                  <select
                    id="contact-city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field full">
                  <label htmlFor="contact-subject">Inquiry Type</label>
                  <select
                    id="contact-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="Book a Site Visit">Book a Guided Site Visit</option>
                    <option value="RERA Documentation Request">Request RERA & Title Dossier</option>
                    <option value="Plot Pricing & Payment Plan">Plot Pricing & Payment Plan</option>
                    <option value="General Query">General Question</option>
                  </select>
                </div>

                <div className="form-field full">
                  <label htmlFor="contact-message">Message (Optional)</label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Tell us what size, orientation, or township you are considering..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <div className="form-field full">
                  <button type="submit" className="primary-link w-full justify-center">
                    <Send className="w-4 h-4 mr-2" />
                    <span>Send Message</span>
                  </button>
                  <p className="text-[11px] text-muted-foreground text-center mt-3">
                    PlotVista adheres to strict privacy standards. No promotional spam or unsolicited third-party calls.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

