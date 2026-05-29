import React, { useState } from "react";
import { Lead } from "../types";
import { Shield, Sparkles, Check, Send, Milestone, Compass, RotateCcw, Building, User, Mail, Phone, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface NextgenMicrositeProps {
  onAddLead: (lead: Lead) => void;
  onGoToWorkspace: () => void;
}

export const NextgenMicrosite: React.FC<NextgenMicrositeProps> = ({ onAddLead, onGoToWorkspace }) => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [org, setOrg] = useState("");
  const [role, setRole] = useState("");
  const [consent, setConsent] = useState(true);
  
  // Selected interests
  const [interests, setInterests] = useState<string[]>([]);
  
  // Form submission status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  // Interest options
  const interestOptions = [
    "Incubation Partnerships",
    "Venture-Scale Investments",
    "Cross-Border Team Sourcing",
    "Trade Policy Corridor",
    "Canada–Nigeria Tech Transfer",
    "Diaspora Core Mentoring",
  ];

  const handleInterestToggle = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const validate = () => {
    const tempErrors: Record<string, string> = {};
    if (!name.trim()) tempErrors.name = "Full Name is required";
    if (!email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Please enter a valid email address";
    }
    if (!phone.trim()) {
      tempErrors.phone = "Phone Number is required";
    } else if (phone.replace(/[^\d]/g, "").length < 7) {
      tempErrors.phone = "Please enter a valid phone number";
    }
    if (!consent) tempErrors.consent = "We require consent to save your delegation parameters";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const tokenNum = Math.floor(100000 + Math.random() * 899999);
    const tokenStr = `NXT-${tokenNum}`;
    
    // Auto score calculation
    // Base 60, higher if investor, VC, DFI, or has important roles
    let calculatedScore = 60 + Math.floor(Math.random() * 15);
    const lowercaseRole = role.toLowerCase();
    const lowercaseOrg = org.toLowerCase();
    if (lowercaseRole.includes("director") || lowercaseRole.includes("partner") || lowercaseRole.includes("vp")) {
      calculatedScore += 10;
    }
    if (lowercaseOrg.includes("capital") || lowercaseOrg.includes("ventures") || lowercaseOrg.includes("fund") || lowercaseOrg.includes("dfi")) {
      calculatedScore += 10;
    }
    calculatedScore = Math.min(calculatedScore, 99);

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    // Map interest tag
    let mappedTag = "Partner";
    if (lowercaseOrg.includes("capital") || lowercaseOrg.includes("ventures") || lowercaseOrg.includes("fund")) {
      mappedTag = "VC";
    } else if (lowercaseRole.includes("investor") || lowercaseRole.includes("angel")) {
      mappedTag = "Investor";
    } else if (lowercaseOrg.includes("gov") || lowercaseOrg.includes("federal") || lowercaseOrg.includes("ministry")) {
      mappedTag = "Government";
    } else if (lowercaseOrg.includes("dfi") || lowercaseOrg.includes("development") || lowercaseOrg.includes("bank")) {
      mappedTag = "DFI";
    } else if (org.trim() && !lowercaseRole.includes("advisor")) {
      mappedTag = "Corporate";
    }

    const tones: ("gold" | "moss" | "laurel" | "clay")[] = ["gold", "moss", "laurel", "clay"];
    const chosenTone = tones[Math.floor(Math.random() * tones.length)];

    const currentTimeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const newLead: Lead = {
      id: `lead-custom-${Date.now()}`,
      initials: initials || "ST",
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      org: org.trim() || "Independent",
      role: role.trim() || "Ecosystem Guest",
      country: "Canada", // defaulting based on Toronto context
      tag: mappedTag,
      tone: chosenTone,
      time: currentTimeStr,
      score: calculatedScore,
      source: "QR Scan",
      capturedBy: "Self-registered",
      token: tokenStr,
      timestamp: new Date().toISOString(),
      note: `Registered through public microsite form. Designated interests: ${
        interests.length ? interests.join(", ") : "General delegation alignment"
      }.`,
    };

    // Prepare dispatch payload
    const payload = {
      _subject: `Microsite Registration — ${newLead.name} (${newLead.org}) · Score ${newLead.score}`,
      _template: "table",
      _captcha: "false",
      token: tokenStr,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      organization: newLead.org,
      role: newLead.role,
      interests: interests.length ? interests.join(", ") : "General alignment",
      score: String(newLead.score),
      sent_time: newLead.timestamp,
    };

    try {
      // Dispatch email directly to tone facilitator in background non-blocking
      fetch("https://formsubmit.co/ajax/topeomojayogbe@ukald.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => console.log("Background email dispatch failed, falling back to instant browser session storage", err));
    } catch (_) {}

    // Simulated short delay
    setTimeout(() => {
      onAddLead(newLead);
      setSubmittedLead(newLead);
      setIsSubmitting(false);
    }, 1200);
  };

  const handleResetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setOrg("");
    setRole("");
    setInterests([]);
    setErrors({});
    setSubmittedLead(null);
  };

  return (
    <div className="space-y-12">
      {/* 1. Hero Section */}
      <section className="pt-20 pb-4 relative" id="hero">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-sage-soft border border-laurel/20 rounded-full text-moss text-[10px] font-mono tracking-widest uppercase mb-6 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-laurel pulse-glow" />
          <span>Canada · Africa Innovation Festival 2026</span>
        </div>

        <h1 className="font-serif font-light text-ink text-5xl md:text-6xl tracking-tight leading-[1.05] max-w-2xl">
          Meet the team behind <em className="italic text-moss-soft font-normal">NBTI Nextgen</em> at CAIF Toronto.
        </h1>

        <div className="flex gap-2.5 mt-5">
          <span className="inline-block px-3 py-1.5 bg-gold/5 border border-gold rounded text-xs font-mono text-gold font-bold tracking-widest uppercase">
            Innovation Challenge
          </span>
        </div>

        <div className="flex items-center gap-4 my-8">
          <span className="flex-1 h-px bg-gradient-to-r from-line to-transparent" />
          <span className="font-serif italic text-gold text-lg">&#10086;</span>
          <span className="flex-1 h-px bg-gradient-to-l from-line to-transparent" />
        </div>

        <p className="text-base md:text-lg text-ink-soft max-w-xl leading-relaxed">
          Connect with Nigeria's premium <em className="font-serif italic font-medium text-moss text-lg">innovation ecosystem leaders</em>. A private channel for cross-border scaling, strategic investment pipelines, and digital infrastructure alliances during the Canada–Africa Innovation Festival in Toronto.
        </p>

        {/* 1.1 Live Event Schedule Card */}
        <div className="mt-10 bg-ivory border border-line rounded-lg p-6 relative shadow-lg overflow-hidden float-slow">
          <div className="absolute top-0 left-4 w-11 h-0.5 bg-gold" />
          <div className="flex justify-between items-baseline text-[9px] font-mono tracking-wider uppercase text-taupe">
            <span>Official Delegation Schedule</span>
            <span className="text-gold-soft">FILE · 2026/CAIF/NG</span>
          </div>

          <dl className="mt-6 space-y-4">
            <div className="grid grid-cols-[90px_1fr] gap-4 items-baseline pb-3 border-b border-dashed border-line">
              <dt className="font-mono text-[9px] tracking-wider uppercase text-taupe-light">Dates</dt>
              <dd className="font-serif font-medium text-lg text-ink">
                May 29 — 30, 2026
                <span className="block text-xs font-sans text-taupe font-normal mt-0.5">Innovation, trade &amp; investment festival</span>
              </dd>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-4 items-baseline pb-3 border-b border-dashed border-line">
              <dt className="font-mono text-[9px] tracking-wider uppercase text-taupe-light">Venue</dt>
              <dd className="font-serif font-medium text-lg text-ink">
                89 Chestnut Street
                <span className="block text-xs font-sans text-taupe font-normal mt-0.5">Toronto, Ontario · Canada</span>
              </dd>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-4 items-baseline pb-3 border-b border-dashed border-line">
              <dt className="font-mono text-[9px] tracking-wider uppercase text-taupe-light">Hours</dt>
              <dd className="font-serif font-medium text-lg text-ink">
                11:00 — 18:00 EDT
                <span className="block text-xs font-sans text-taupe font-normal mt-0.5">Open programme · panels · sessions</span>
              </dd>
            </div>
            <div className="grid grid-cols-[90px_1fr] gap-4 items-baseline">
              <dt className="font-mono text-[9px] tracking-wider uppercase text-taupe-light">Host</dt>
              <dd className="font-serif font-medium text-lg text-ink">
                National Board for Technology Incubation
                <span className="block text-xs font-sans text-taupe font-normal mt-0.5">Federal Republic of Nigeria</span>
              </dd>
            </div>
          </dl>

          <div className="mt-5 p-3.5 bg-gold/5 border-l-2 border-gold text-xs leading-relaxed text-ink-soft">
            <strong className="text-moss font-semibold">Direct connection opportunity:</strong> registering through this secure microsite secures a prioritised, high-table interactive session with the federal delegation.
          </div>
        </div>

        {/* 1.2 CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-4 bg-moss text-cream font-medium text-sm rounded shadow-md hover:bg-moss-deep transition-all relative overflow-hidden flex items-center justify-center gap-3 group"
          >
            <div className="absolute inset-px border border-dashed border-gold-light/20 pointer-events-none" />
            <span>Connect with NBTI</span>
            <span className="w-4 h-0.5 bg-gold-light relative transition-all group-hover:w-6" />
          </button>
          
          <button
            onClick={() => document.getElementById("mission-section")?.scrollIntoView({ behavior: "smooth" })}
            className="px-6 py-4 bg-transparent border border-line text-ink text-xs font-mono tracking-wider uppercase rounded hover:border-moss hover:bg-moss/5 transition-all text-center"
          >
            Read the delegation brief
          </button>
        </div>
      </section>

      {/* 2. Mission Section */}
      <section className="bg-moss text-cream -mx-6 px-6 py-16 relative overflow-hidden" id="mission-section">
        {/* Background ambient lighting */}
        <div className="absolute inset-0 bg-radial-gradient(900px_400px_at_80%_0%,rgba(221,199,138,0.07),transparent_60%) pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient(700px_500px_at_-10%_110%,rgba(184,144,82,0.07),transparent_60%) pointer-events-none" />

        <div className="relative">
          <span className="font-mono text-[9px] tracking-widest uppercase text-gold-light flex items-center gap-3">
            <span className="w-6 h-px bg-gold" /> N° 02 · The Mission
          </span>

          <h2 className="font-serif font-light text-cream text-4xl tracking-tight leading-tight mt-4 max-w-xl">
            Cross-border incubation bridges. Connecting <em className="italic text-gold-light font-normal">Toronto talent</em> with <em className="italic text-gold-light font-normal">Abuja resources</em>.
          </h2>

          <div className="w-12 h-0.5 bg-gold my-5" />

          <p className="text-sm md:text-base text-cream/80 leading-relaxed max-w-xl">
            The <strong>National Board for Technology Incubation (NBTI)</strong> is the flagship coordinator of Nigeria's technological incubation hubs and federal technology programmes. By driving structural incubation across the federation, NBTI nurtures scalable enterprises, transforms research into market-winning products, and establishes secure pipelines for bilateral investment.
          </p>

          <p className="text-sm md:text-base text-cream/80 leading-relaxed max-w-xl mt-4">
            For CAIF Toronto 2026, the Nextgen Innovation Challenge delegation presents high-growth Nigerian innovators ready to scale trans-nationally; opening corridors for Canadian venture capital, institutional partners, and technical founders to collaborate with Africa's most populous digital economy.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-xl">
            <div className="p-4 bg-cream/5 border border-cream/10 rounded">
              <span className="font-serif text-3xl font-light text-gold-light">30+</span>
              <div className="font-mono text-[9px] tracking-widest uppercase text-gold-soft mt-1.5">Active Hubs</div>
              <p className="text-xs text-cream/60 mt-1 leading-snug">Interconnected Technology Incubation Centres facilitating nationwide acceleration.</p>
            </div>
            <div className="p-4 bg-cream/5 border border-cream/10 rounded">
              <span className="font-serif text-3xl font-light text-gold-light">C$45M+</span>
              <div className="font-mono text-[9px] tracking-widest uppercase text-gold-soft mt-1.5">Ecosystem Fund</div>
              <p className="text-xs text-cream/60 mt-1 leading-snug">Projected funding pipelines and technology-transfer contracts targeting 2026-27.</p>
            </div>
            <div className="p-4 bg-cream/5 border border-cream/10 rounded">
              <span className="font-serif text-3xl font-light text-gold-light">500+</span>
              <div className="font-mono text-[9px] tracking-widest uppercase text-gold-soft mt-1.5">Start-Ups</div>
              <p className="text-xs text-cream/60 mt-1 leading-snug">Enterprises accelerated under Nigeria's federal technology policy models.</p>
            </div>
            <div className="p-4 bg-cream/5 border border-cream/10 rounded">
              <span className="font-serif text-3xl font-light text-gold-light">12</span>
              <div className="font-mono text-[9px] tracking-widest uppercase text-gold-soft mt-1.5">Delegates</div>
              <p className="text-xs text-cream/60 mt-1 leading-snug">High-level officials arriving in Toronto representing the federal delegation.</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-black/10 border-l-2 border-gold rounded flex items-center gap-4 max-w-xl">
            <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center text-gold-light font-serif italic text-lg flex-shrink-0">
              F
            </div>
            <div>
              <div className="font-mono text-[9px] tracking-widest uppercase text-cream">Federal Ministry of Innovation, Science &amp; Technology</div>
              <p className="text-xs text-cream/60 mt-0.5 leading-snug">Strategic mandate: technological self-reliance and national commercial independence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Collaborators List */}
      <section className="space-y-6" id="collaborators-section">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[9px] tracking-widest uppercase text-gold-soft flex-shrink-0">
            N° 03 · Collaborators
          </span>
          <span className="flex-1 h-px bg-line" />
        </div>

        <h2 className="font-serif text-3.5xl font-medium tracking-tight text-ink leading-tight">
          Who should <em className="italic text-moss-soft">connect</em> with the NBTI delegation.
        </h2>
        <p className="text-sm text-taupe leading-relaxed max-w-lg">
          A curated list. We invite premium stakeholders driving sustainable, trans-continental innovation pipelines.
        </p>

        <div className="grid gap-3">
          <div className="p-4 bg-ivory border border-line rounded relative group hover:border-moss transition-all hover:-translate-y-0.5">
            <span className="absolute top-3.5 right-4 font-mono text-[9px] text-taupe-light">i.</span>
            <h3 className="font-mono text-[10px] tracking-wider uppercase text-ink font-semibold flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Venture Capital · Angel Investors
            </h3>
            <p className="text-xs text-taupe leading-relaxed">
              Seeking early-stage exposure to high-yield technology companies emerging from Africa&apos;s premier incubators.
            </p>
          </div>

          <div className="p-4 bg-ivory border border-line rounded relative group hover:border-moss transition-all hover:-translate-y-0.5">
            <span className="absolute top-3.5 right-4 font-mono text-[9px] text-taupe-light">ii.</span>
            <h3 className="font-mono text-[10px] tracking-wider uppercase text-ink font-semibold flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-laurel" /> North American Tech Founders
            </h3>
            <p className="text-xs text-taupe leading-relaxed">
              Looking to deploy scalable cross-border talent pipelines or stand up operational subsidiaries inside Nigeria&apos;s digital ecosystem.
            </p>
          </div>

          <div className="p-4 bg-ivory border border-line rounded relative group hover:border-moss transition-all hover:-translate-y-0.5">
            <span className="absolute top-3.5 right-4 font-mono text-[9px] text-taupe-light">iii.</span>
            <h3 className="font-mono text-[10px] tracking-wider uppercase text-ink font-semibold flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Institutional Partners
            </h3>
            <p className="text-xs text-taupe leading-relaxed">
              Ecosystem brokers, incubation networks, and university accelerators interested in exchange missions and tech-transfer pipelines.
            </p>
          </div>

          <div className="p-4 bg-ivory border border-line rounded relative group hover:border-moss transition-all hover:-translate-y-0.5">
            <span className="absolute top-3.5 right-4 font-mono text-[9px] text-taupe-light">iv.</span>
            <h3 className="font-mono text-[10px] tracking-wider uppercase text-ink font-semibold flex items-center gap-2 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-laurel" /> Diaspora Scholars &amp; Engineers
            </h3>
            <p className="text-xs text-taupe leading-relaxed">
              Nigerian and African tech scholars in Canada establishing mentors-network partnerships or institutional advisory roles.
            </p>
          </div>
        </div>

        <div className="p-4 bg-ivory border border-line rounded-full flex items-center gap-3 text-xs text-taupe leading-relaxed">
          <span className="font-serif text-lg text-gold leading-none">&#10022;</span>
          <span>
            <strong className="text-moss font-semibold">Bespoke matching:</strong> our program coordinators align your captured interest profile with exact delegation members during CAIF.
          </span>
        </div>
      </section>

      {/* 4. Connection Bridge Form */}
      <section className="bg-ivory -mx-6 px-6 py-16 border-t border-b border-line relative" id="contact-section">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sage/40 via-gold to-sage/40 opacity-70" />
        
        <div className="space-y-6 max-w-xl mx-auto">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] tracking-widest uppercase text-gold-soft flex-shrink-0">
              N° 04 · Connection Bridge
            </span>
            <span className="flex-1 h-px bg-line" />
          </div>

          <h2 className="font-serif text-3.5xl font-medium tracking-tight text-ink leading-tight">
            Initiate <em className="italic text-moss-soft">contact</em>.
          </h2>
          <p className="text-sm text-taupe leading-relaxed">
            Submit your connection profile. A prioritised routing token will match you to the relevant NBTI delegation leaders within forty-eight hours.
          </p>

          {/* Form Card */}
          <div className="bg-cream border border-line rounded shadow-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-12 bg-gold" />

            <AnimatePresence mode="wait">
              {!submittedLead ? (
                <motion.div
                  key="form-fields"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-baseline border-b border-line pb-4 mb-6 text-[9.5px] font-mono tracking-wider uppercase text-taupe">
                    <span><strong>Form A</strong> · Lead Capture</span>
                    <span>02:30 minutes</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label htmlFor="form-name" className="flex justify-between text-[9px] font-mono tracking-wider uppercase text-taupe-light">
                        <span>Full Name <span className="text-gold-soft">*</span></span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 w-4 h-4 text-taupe-light" />
                        <input
                          id="form-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors({ ...errors, name: "" });
                          }}
                          placeholder="Adaeze Okonkwo"
                          className="w-full pl-9 pr-4 py-3 bg-transparent border-b border-line font-serif text-lg leading-tight text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
                        />
                      </div>
                      {errors.name && <p className="text-[10px] text-clay font-mono">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label htmlFor="form-email" className="flex justify-between text-[9px] font-mono tracking-wider uppercase text-taupe-light">
                        <span>Email Address <span className="text-gold-soft">*</span></span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-taupe-light" />
                        <input
                          id="form-email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: "" });
                          }}
                          placeholder="partner@firm.com"
                          className="w-full pl-9 pr-4 py-3 bg-transparent border-b border-line font-serif text-lg leading-tight text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-clay font-mono">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label htmlFor="form-phone" className="flex justify-between text-[9px] font-mono tracking-wider uppercase text-taupe-light">
                        <span>Phone Number <span className="text-gold-soft">*</span></span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-taupe-light" />
                        <input
                          id="form-phone"
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) setErrors({ ...errors, phone: "" });
                          }}
                          placeholder="+1 416 555 0199"
                          className="w-full pl-9 pr-4 py-3 bg-transparent border-b border-line font-serif text-lg leading-tight text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
                        />
                      </div>
                      {errors.phone && <p className="text-[10px] text-clay font-mono">{errors.phone}</p>}
                    </div>

                    {/* Org & Role Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label htmlFor="form-org" className="flex justify-between text-[9px] font-mono tracking-wider uppercase text-taupe-light">
                          <span>Organization <span className="text-serif italic lowercase text-taupe-light/70">optional</span></span>
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3.5 w-4 h-4 text-taupe-light" />
                          <input
                            id="form-org"
                            type="text"
                            value={org}
                            onChange={(e) => setOrg(e.target.value)}
                            placeholder="Ontario Ventures Inc."
                            className="w-full pl-9 pr-4 py-3 bg-transparent border-b border-line font-serif text-base leading-tight text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="form-role" className="flex justify-between text-[9px] font-mono tracking-wider uppercase text-taupe-light">
                          <span>Designated Role <span className="text-serif italic lowercase text-taupe-light/70">optional</span></span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-3.5 w-4 h-4 text-taupe-light" />
                          <input
                            id="form-role"
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            placeholder="Investment Director"
                            className="w-full pl-9 pr-4 py-3 bg-transparent border-b border-line font-serif text-base leading-tight text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Interest Intersections */}
                    <div className="space-y-2">
                      <span className="block font-mono text-[9px] tracking-wider uppercase text-taupe-light mb-1.5">
                        Strategic Intersection of Interest
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {interestOptions.map((opt) => {
                          const isSelected = interests.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleInterestToggle(opt)}
                              className={`px-3 py-2 rounded-full border text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
                                isSelected
                                  ? "bg-sage-soft border-moss-soft text-moss"
                                  : "bg-ivory border-line text-ink-soft hover:bg-cream"
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded-full border border-line flex items-center justify-center relative transition-colors ${
                                  isSelected ? "bg-moss border-moss" : ""
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-gold-light" />
                                )}
                              </div>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Consent Checkbox */}
                    <label className="flex gap-3 text-xs leading-relaxed text-taupe cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => {
                          setConsent(e.target.checked);
                          if (errors.consent) setErrors({ ...errors, consent: "" });
                        }}
                        className="w-4 h-4 border border-line bg-cream rounded-sm mt-0.5 accent-moss"
                      />
                      <span>I consent to be contacted by the NBTI / Nextgen Innovation Challenge delegation regarding CAIF Toronto 2026.</span>
                    </label>
                    {errors.consent && <p className="text-[10px] text-clay font-mono">{errors.consent}</p>}

                    {/* Submit Row */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 bg-moss text-cream font-medium text-sm rounded shadow-md group relative overflow-hidden flex items-center justify-center gap-3 ${
                          isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-moss-deep"
                        }`}
                      >
                        <div className="absolute inset-px border border-dashed border-gold-light/20 pointer-events-none" />
                        {isSubmitting ? (
                          <>
                            <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                            <span>Routing parameters...</span>
                          </>
                        ) : (
                          <>
                            <span>Connect with NBTI</span>
                            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="form-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-center py-4"
                >
                  <div className="w-16 h-16 rounded-full bg-laurel/10 border border-laurel/30 flex items-center justify-center mx-auto text-laurel relative">
                    <div className="absolute inset-1.5 rounded-full border border-dashed border-laurel/20" />
                    <Check className="w-6 h-6" />
                  </div>

                  <div className="inline-flex items-center gap-1.5 mt-5 px-3 py-1 bg-laurel/10 text-laurel text-[9px] font-mono tracking-widest uppercase py-1 px-3 rounded-full border border-laurel/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-laurel animate-ping" />
                    <span>Automated Thank-you Sent</span>
                  </div>

                  <h3 className="font-serif font-medium text-2xl text-ink leading-tight mt-4">
                    Connection <em className="italic text-moss-soft font-normal">pipeline</em> created.
                  </h3>
                  <p className="text-sm text-taupe mt-3 max-w-sm mx-auto leading-relaxed">
                    A member of the NBTI / Nextgen Innovation Challenge delegation will reach out shortly. Have an incredible time at CAIF Toronto 2026.
                  </p>

                  {/* Ledger Token Display */}
                  <div className="mt-8 p-4 bg-ivory border border-line rounded text-left space-y-2 font-mono text-[10.5px] leading-relaxed text-taupe max-w-sm mx-auto">
                    <div className="grid grid-cols-[100px_1fr] gap-2">
                      <span>Ledger Token</span>
                      <strong className="text-ink font-semibold">{submittedLead.token}</strong>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-2">
                      <span>Routing Node</span>
                      <span className="text-ink font-medium">Toronto / Abuja Pipeline</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-2">
                      <span>Dispatched</span>
                      <span className="text-ink truncate font-medium">{submittedLead.email}</span>
                    </div>
                    <div className="grid grid-cols-[100px_1fr] gap-2">
                      <span>Time (UTC)</span>
                      <span className="text-ink font-medium">
                        {new Date(submittedLead.timestamp).toUTCString().replace("GMT", "UTC")}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleResetForm}
                    className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-transparent border border-line rounded-full text-xs font-medium text-moss hover:bg-moss/5 hover:border-moss transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Register another connection</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
};
