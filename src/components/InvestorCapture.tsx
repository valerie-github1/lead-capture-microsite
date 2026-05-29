import React, { useState } from "react";
import { Lead, Meeting, ExportHistoryItem } from "../types";
import { Search, Calendar, FileText, BarChart2, Check, Download, Layers, ShieldCheck, Flame, Compass, BadgeAlert, PlusCircle, CheckCircle, Mail, RotateCw, ExternalLink, Sparkles, TrendingUp, Activity as ActivityIcon, Clock, Filter, Users, Tag, Printer, Eye, Sliders, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface InvestorCaptureProps {
  leads: Lead[];
  meetings: Meeting[];
  exportsList: ExportHistoryItem[];
  currentTab: string;
  onTabChange: (tab: string) => void;
  onAddLead: (lead: Lead) => void;
  onAddMeeting: (meeting: Meeting) => void;
  onAddExport: (item: ExportHistoryItem) => void;
  onSelectItem: (lead: Lead) => void;
}

const getHourlyDataForLeads = (targetLeads: Lead[]) => {
  // Event festival hours default to 08:00 (8 AM) through 20:00 (8 PM)
  let minHour = 8;
  let maxHour = 20;

  const parsedLeads = targetLeads
    .map((l) => {
      let hourVal = -1;
      if (l.time && l.time.includes(":")) {
        const parts = l.time.split(":");
        hourVal = parseInt(parts[0], 10);
      }
      return { ...l, hourVal };
    })
    .filter((l) => l.hourVal >= 0 && l.hourVal <= 23);

  // Auto expand boundaries if some captures are outside standard 8am-8pm range
  parsedLeads.forEach((l) => {
    if (l.hourVal < minHour) minHour = l.hourVal;
    if (l.hourVal > maxHour) maxHour = l.hourVal;
  });

  const data = [];
  for (let h = minHour; h <= maxHour; h++) {
    const count = parsedLeads.filter((l) => l.hourVal === h).length;
    let hourLabel = "";
    if (h === 0) hourLabel = "12 AM";
    else if (h === 12) hourLabel = "12 PM";
    else if (h < 12) hourLabel = `${h} AM`;
    else hourLabel = `${h - 12} PM`;

    data.push({
      hourValue: h,
      hourLabel,
      timeString: `${h.toString().padStart(2, "0")}:00`,
      count,
    });
  }
  return data;
};

// Premium sound synthesizer using browser Web Audio API to play an elegant, warm chime
const playPremiumNotificationSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const playTone = (freq: number, startTime: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);

      // Elegant exponential decay envelope
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    // Elegant warm major chord bell chime sound
    // Note 1: G#5 (830.61 Hz)
    playTone(830.61, now, 0.4, 0.12);
    // Note 2: D#6 (1244.51 Hz) slightly staggered
    playTone(1244.51, now + 0.06, 0.6, 0.08);
  } catch (err) {
    console.warn("Audio Context not supported or requires gesture activation:", err);
  }
};

const AnalyticTooltip: React.FC<{
  title: string;
  purpose: string;
  necessity: string;
  align?: "left" | "right";
}> = ({ title, purpose, necessity, align = "left" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block ml-2 align-middle z-40">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="w-4 h-4 rounded-full flex items-center justify-center bg-moss/5 border border-moss/10 hover:bg-moss/10 hover:border-moss/30 text-moss transition-all cursor-pointer focus:outline-hidden"
        aria-label={`About ${title}`}
      >
        <Info className="w-2.5 h-2.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 mt-2 w-72 md:w-80 p-4 bg-cream border border-line rounded-lg shadow-xl text-ink font-sans text-xs pointer-events-auto normal-case tracking-normal font-normal ${
              align === "left" ? "left-0" : "right-0"
            }`}
          >
            {/* Background design pointer arrow */}
            <div className={`absolute top-0 w-2 h-2 bg-cream border-t border-l border-line -mt-1 transform rotate-45 ${
              align === "left" ? "left-4" : "right-4"
            }`} />
            
            <h4 className="font-serif font-bold text-sm text-ink mb-2">
              {title}
            </h4>
            
            <div className="space-y-2.5">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-moss-deep block font-bold">Purpose</span>
                <p className="text-taupe text-[11px] leading-relaxed mt-0.5">{purpose}</p>
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-gold-soft block font-bold">Delegation Success Fit</span>
                <p className="text-taupe text-[11px] leading-relaxed mt-0.5">{necessity}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const InvestorCapture: React.FC<InvestorCaptureProps> = ({
  leads,
  meetings,
  exportsList,
  currentTab,
  onTabChange,
  onAddLead,
  onAddMeeting,
  onAddExport,
  onSelectItem,
}) => {
  // Local state for cap-form
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formOrg, setFormOrg] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formTag, setFormTag] = useState("Investor");
  const [formNotes, setFormNotes] = useState("");
  const [formCapturedBy, setFormCapturedBy] = useState("Amaka Obi");
  const [formSource, setFormSource] = useState("QR Scan");

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Search and filter states
  const [leadsSearch, setLeadsSearch] = useState("");
  const [leadsFilter, setLeadsFilter] = useState("all");

  // Activity filter states
  const [actClassification, setActClassification] = useState("all");
  const [actStaff, setActStaff] = useState("all");
  const [actSource, setActSource] = useState("all");
  const [actScore, setActScore] = useState("all");

  // Export Confirmation Modal states
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<"CSV" | "PDF" | "Salesforce" | "HubSpot" | null>(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  const toggleLeadSelection = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleToggleAllLeads = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map((l) => l.id));
    }
  };

  // Detailed Printable PDF Report states
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [printSortBy, setPrintSortBy] = useState<"chronological" | "alphabetical" | "score">("chronological");
  const [printShowNotes, setPrintShowNotes] = useState(true);
  const [printShowScores, setPrintShowScores] = useState(true);
  const [printShowTimes, setPrintShowTimes] = useState(true);
  const [printLayout, setPrintLayout] = useState<"cards" | "table">("cards");

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTimer, setToastTimer] = useState<any>(null);

  const showToast = (msg: string, duration = 3000) => {
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    setToastMessage(msg);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, duration);
    setToastTimer(timer);
  };

  const getToneFromTag = (tag: string): "gold" | "moss" | "laurel" | "clay" => {
    switch (tag) {
      case "Investor":
      case "VC":
        return "gold";
      case "Corporate":
        return "moss";
      case "Government":
      case "DFI":
        return "laurel";
      default:
        return "clay";
    }
  };

  const handleCaptureSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formName.trim()) errors.name = "Full Name is required";
    if (!formEmail.trim() || !/\S+@\S+\.\S+/.test(formEmail)) errors.email = "Valid email is required";
    if (!formPhone.trim() || formPhone.replace(/[^\d]/g, "").length < 6) errors.phone = "Valid phone is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Please check the form coordinates");
      return;
    }

    setFormSubmitting(true);
    const tokenNum = Math.floor(100000 + Math.random() * 899999);
    const tokenStr = `NXT-${tokenNum}`;
    const initials = formName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    // Auto scoring calculation
    let baseScore = 65 + Math.floor(Math.random() * 15);
    const uppercaseTag = formTag.toUpperCase();
    if (uppercaseTag === "INVESTOR" || uppercaseTag === "VC" || uppercaseTag === "DFI") {
      baseScore += 8;
    }
    const lowercaseRole = formRole.toLowerCase();
    if (lowercaseRole.includes("director") || lowercaseRole.includes("managing") || lowercaseRole.includes("partner")) {
      baseScore += 10;
    }
    baseScore = Math.min(baseScore, 99);

    const currentTimeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const newLead: Lead = {
      id: `lead-user-${Date.now()}`,
      initials: initials || "ST",
      name: formName.trim(),
      email: formEmail.trim(),
      phone: formPhone.trim(),
      org: formOrg.trim() || "Independent",
      role: formRole.trim() || "Director",
      country: formTag === "Government" ? "Nigeria" : "Canada", // smart defaulted
      tag: formTag,
      tone: getToneFromTag(formTag),
      time: currentTimeStr,
      score: baseScore,
      source: formSource,
      capturedBy: formCapturedBy,
      token: tokenStr,
      timestamp: new Date().toISOString(),
      note: formNotes.trim() || "Captured live on the CAIF festival floor.",
    };

    // Prepare dispatch payload
    const payload = {
      _subject: `Active Capture — ${newLead.name} (${newLead.org}) · Score ${newLead.score}`,
      _template: "table",
      _captcha: "false",
      token: tokenStr,
      name: newLead.name,
      email: newLead.email,
      phone: newLead.phone,
      organization: newLead.org,
      role: newLead.role,
      interests: "Captured live on CAIF floor",
      score: String(newLead.score),
      sent_time: newLead.timestamp,
    };

    try {
      // Background non-blocking dispatch
      fetch("https://formsubmit.co/ajax/topeomojayogbe@ukald.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch (_) {}

    setTimeout(() => {
      onAddLead(newLead);
      setFormSubmitting(false);
      showToast(`Lead captured! Assigned token ${tokenStr}`);
      
      // Reset form
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormOrg("");
      setFormRole("");
      setFormTag("Investor");
      setFormNotes("");
      setFormErrors({});

      // automatically swap to Leads tab to inspect details
      onTabChange("leads");
    }, 1000);
  };

  const handleExportCSV = () => {
    setExportType("CSV");
    setSelectedLeadIds(leads.map((l) => l.id));
    setExportModalOpen(true);
  };

  const executeExportCSV = () => {
    setExportModalOpen(false);
    showToast("Generating spreadsheet export...");
    const leadsToExport = leads.filter((l) => selectedLeadIds.includes(l.id));
    setTimeout(() => {
      const excelTemplate = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head>
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>NBTI CAIF Leads</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
          <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
          <style>
            table { border-collapse: collapse; font-family: 'Segoe UI', Arial, sans-serif; }
            th { background-color: #2e5543; color: #ffffff; font-weight: bold; border: 0.5pt solid #cccccc; padding: 6px; }
            td { border: 0.5pt solid #cccccc; padding: 6px; vertical-align: top; }
          </style>
        </head>
        <body>
          <table>
            <thead>
              <tr>
                <th>Token</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Organization</th>
                <th>Role</th>
                <th>Country</th>
                <th>Tag</th>
                <th>Score</th>
                <th>Time</th>
                <th>Captured By</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              ${leadsToExport
                .map(
                  (l) => `
                <tr>
                  <td>${l.token || ""}</td>
                  <td>${l.name || ""}</td>
                  <td>${l.email || ""}</td>
                  <td>${l.phone || ""}</td>
                  <td>${l.org || ""}</td>
                  <td>${l.role || ""}</td>
                  <td>${l.country || ""}</td>
                  <td>${l.tag || ""}</td>
                  <td>${l.score || ""}</td>
                  <td>${l.time || ""}</td>
                  <td>${l.capturedBy || ""}</td>
                  <td>${(l.note || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `;

      const blob = new Blob(["\ufeff" + excelTemplate], { type: "application/vnd.ms-excel;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `nbti_caif_leads_export_${Date.now()}.xls`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // add log
      onAddExport({
        id: `ex-${Date.now()}`,
        fileName: `nbti_caif_leads_export_${Date.now()}.xls`,
        fileType: "CSV",
        dateStr: "Just now · Fri 29 May",
        recordCount: leadsToExport.length,
      });
      playPremiumNotificationSound();
      showToast("Leads list downloaded!");
    }, 1000);
  };

  const handleExportPDF = () => {
    setExportType("PDF");
    setSelectedLeadIds(leads.map((l) => l.id));
    setExportModalOpen(true);
  };

  const executeExportPDF = () => {
    setExportModalOpen(false);
    const leadsToExport = leads.filter((l) => selectedLeadIds.includes(l.id));
    showToast("Compiling PDF Dossier...");
    setTimeout(() => {
      onAddExport({
        id: `ex-pdf-${Date.now()}`,
        fileName: `nbti_caif_dossier_compilation_${Date.now()}.pdf`,
        fileType: "PDF",
        dateStr: "Just now · Fri 29 May",
        recordCount: leadsToExport.length,
      });
      setIsPrintPreviewOpen(true);
      playPremiumNotificationSound();
      showToast("PDF booklet compiled! Opened in Print Dossier Room.");
    }, 1500);
  };

  const handleCRMIntegration = (sys: "Salesforce" | "HubSpot") => {
    setExportType(sys);
    setSelectedLeadIds(leads.map((l) => l.id));
    setExportModalOpen(true);
  };

  const executeCRMIntegration = (sys: "Salesforce" | "HubSpot") => {
    setExportModalOpen(false);
    const leadsToExport = leads.filter((l) => selectedLeadIds.includes(l.id));
    showToast(`Initiating background sync to ${sys} servers...`, 2000);
    setTimeout(() => {
      onAddExport({
        id: `ex-crm-${Date.now()}`,
        fileName: `nbti_workspace_${sys.toLowerCase()}_sync_batch_002`,
        fileType: sys === "Salesforce" ? "Salesforce sync" : "HubSpot sync",
        dateStr: "Just now · Fri 29 May",
        recordCount: leadsToExport.length,
      });
      
      const successMessage = sys === "Salesforce"
        ? `✓ Salesforce CRM Connected: Successfully synced ${leadsToExport.length} delegates from NCBA 2026 registry. All customized lead scoring indicators, structural tags, and field notes mapped correctly to production accounts.`
        : `✓ HubSpot Sync Successful: Unified CRM integration finalized. Merged ${leadsToExport.length} contact records into 'NCBA Toronto Delegation'. Lead activity records and priority status indexes successfully synchronized.`;

      playPremiumNotificationSound();
      showToast(successMessage, 5500);
    }, 1800);
  };

  // Filter calculations
  const filteredLeads = leads.filter((l) => {
    const term = leadsSearch.toLowerCase().trim();
    const tagMatch = leadsFilter === "all" || l.tag.toLowerCase() === leadsFilter.toLowerCase();
    
    if (!term) return tagMatch;
    
    const termMatch =
      l.name.toLowerCase().includes(term) ||
      l.email.toLowerCase().includes(term) ||
      l.org.toLowerCase().includes(term) ||
      l.country.toLowerCase().includes(term) ||
      l.tag.toLowerCase().includes(term);

    return tagMatch && termMatch;
  });

  // KPI aggregates
  const totalCapturesCount = leads.length;
  const highScoringProspects = leads.filter((l) => l.score >= 90).length;
  // Countries calculation
  const uniqueCountries = new Set(leads.map((l) => l.country));
  
  // Stakeholder counts
  const investorCount = leads.filter((l) => l.tag === "Investor").length;
  const vcCount = leads.filter((l) => l.tag === "VC").length;
  const corporateCount = leads.filter((l) => l.tag === "Corporate").length;
  const govCount = leads.filter((l) => l.tag === "Government").length;
  const dfiCount = leads.filter((l) => l.tag === "DFI").length;
  const partnerCount = leads.filter((l) => l.tag === "Partner").length;

  return (
    <div className="space-y-6">
      {/* 2. TAB CONTROL SUB-NAVIGATION */}
      <div className="flex border-b border-line pb-0.5 space-x-6 overflow-x-auto scrollbar-none -mx-6 px-6">
        {["overview", "capture", "leads", "activity", "analytics", "meetings", "exports"].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`font-mono text-[9.5px] tracking-widest uppercase pb-3 border-b-2 font-medium whitespace-nowrap cursor-pointer transition-all ${
              currentTab === tab
                ? "border-gold text-moss scale-102"
                : "border-transparent text-taupe-light hover:text-moss"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 3. SUB-MODULE ROUTING */}

      {/* OVERVIEW MODULE */}
      {currentTab === "overview" && (
        <motion.div key="overview-view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Quick Stats banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-ivory border border-line rounded">
              <span className="font-mono text-[8px] tracking-widest uppercase text-taupe-light block">Floor Captures</span>
              <span className="font-serif text-3xl font-medium text-ink block mt-1.5">{totalCapturesCount}</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-laurel font-mono">
                <CheckCircle className="w-3 h-3" />
                <span>Active Ledger</span>
              </div>
            </div>

            <div className="p-4 bg-ivory border border-line rounded">
              <span className="font-mono text-[8px] tracking-widest uppercase text-taupe-light block">Hot Prospects</span>
              <span className="font-serif text-3xl font-medium text-ink block mt-1.5">{highScoringProspects}</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-gold font-mono">
                <Flame className="w-3 h-3 text-gold" />
                <span>Score Over 90</span>
              </div>
            </div>

            <div className="p-4 bg-ivory border border-line rounded">
              <span className="font-mono text-[8px] tracking-widest uppercase text-taupe-light block">Bilateral Countries</span>
              <span className="font-serif text-3xl font-medium text-ink block mt-1.5">{uniqueCountries.size}</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-taupe font-mono">
                <Compass className="w-3 h-3 text-gold-soft" />
                <span>Bilateral Corridors</span>
              </div>
            </div>

            <div className="p-4 bg-ivory border border-line rounded">
              <span className="font-mono text-[8px] tracking-widest uppercase text-taupe-light block">Facilitator Emails</span>
              <span className="font-serif text-3xl font-medium text-ink block mt-1.5">100%</span>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-laurel font-mono">
                <ShieldCheck className="w-3 h-3 text-laurel" />
                <span>No-Backend Relay</span>
              </div>
            </div>
          </div>

          {/* Quick Hourly Activity and Lead Mix charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-ivory border border-line rounded-lg">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="font-serif font-medium text-base text-ink">Hourly Activity Trend</h3>
                <span className="font-mono text-[8.5px] tracking-widest text-taupe-light uppercase font-medium">Capture Peak</span>
              </div>
              <div className="flex items-end gap-2.5 h-24 pt-2">
                <div className="flex-1 bg-moss/70 rounded-t-xs h-[18%]" title="08:00" />
                <div className="flex-1 bg-moss/70 rounded-t-xs h-[26%]" title="09:00" />
                <div className="flex-1 bg-moss/70 rounded-t-xs h-[38%]" title="10:00" />
                <div className="flex-1 bg-moss/70 rounded-t-xs h-[54%]" title="11:00" />
                <div className="flex-1 bg-moss/70 rounded-t-xs h-[48%]" title="12:00" />
                <div className="flex-1 bg-moss/70 rounded-t-xs h-[58%]" title="13:00" />
                <div className="flex-1 bg-moss/70 rounded-t-xs h-[70%]" title="14:00" />
                <div className="flex-1 bg-moss/70 rounded-t-xs h-[82%]" title="15:00" />
                <div className="flex-1 bg-gold rounded-t-xs h-[96%]" title="16:00 (Peak)" />
                <div className="flex-1 bg-laurel rounded-t-xs h-[64%] shadow-[0_0_0_1px_rgba(91,122,93,0.4)]" title="17:00 (Active)" />
                <div className="flex-1 bg-moss/10 rounded-t-xs h-[10%]" title="18:00" />
                <div className="flex-1 bg-moss/10 rounded-t-xs h-[5%]" title="19:00" />
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono tracking-wider uppercase text-taupe-light mt-4">
                <span>08:00 AM</span>
                <span>Active 17:00</span>
                <span>20:00 PM</span>
              </div>
            </div>

            <div className="p-5 bg-ivory border border-line rounded-lg">
              <div className="flex justify-between items-baseline mb-4">
                <h3 className="font-serif font-medium text-base text-ink">Capture Mix</h3>
                <span className="font-mono text-[8.5px] tracking-widest text-taupe-light uppercase font-medium">By Stakeholder</span>
              </div>
              <div className="space-y-2.5">
                {[
                  { tag: "Investor / VC", length: investorCount + vcCount, pct: Math.round(((investorCount + vcCount) / totalCapturesCount) * 100) || 0, color: "bg-gold" },
                  { tag: "Corporate", length: corporateCount, pct: Math.round((corporateCount / totalCapturesCount) * 100) || 0, color: "bg-moss" },
                  { tag: "Government / DFI", length: govCount + dfiCount, pct: Math.round(((govCount + dfiCount) / totalCapturesCount) * 100) || 0, color: "bg-laurel" },
                  { tag: "Partner / Incubator", length: partnerCount, pct: Math.round((partnerCount / totalCapturesCount) * 100) || 0, color: "bg-clay" },
                ].map((item) => (
                  <div key={item.tag} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-ink-soft">
                      <span>{item.tag}</span>
                      <span className="font-mono text-[10px] text-taupe">
                        <strong>{item.length}</strong> · {item.pct}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-cream border border-line/40 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick List stream */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif font-medium text-xl text-ink">Recent Capture Stream</h3>
                <p className="font-mono text-[9px] text-gold-soft tracking-wider uppercase mt-1">Live capturing floor list</p>
              </div>
              <button
                onClick={() => onTabChange("capture")}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-moss text-cream font-medium text-[10px] font-mono tracking-widest uppercase rounded hover:bg-moss-deep transition-all shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5 text-gold-light" />
                <span>Capture Lead</span>
              </button>
            </div>

            <div className="grid gap-3">
              {leads.slice(0, 5).map((L) => (
                <div
                  key={L.id}
                  onClick={() => onSelectItem(L)}
                  className={`grid grid-cols-[auto_1fr_auto] gap-4 p-3.5 bg-ivory border border-line rounded cursor-pointer relative hover:border-moss transition-all group hover:translate-x-0.5`}
                >
                  <div className={`absolute top-3 bottom-3 left-0 w-0.5 rounded-full ${L.tone === "gold" ? "bg-gold" : L.tone === "moss" ? "bg-moss" : L.tone === "laurel" ? "bg-laurel" : "bg-clay"} `} />
                  <div className="w-10 h-10 rounded-full bg-moss text-gold-light flex items-center justify-center font-serif italic text-base font-semibold border border-dashed border-gold-soft/20 group-hover:bg-moss-deep transition-colors">
                    {L.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <h4 className="font-serif font-medium text-base text-ink line-clamp-1">{L.name}</h4>
                      <span className={`text-[8.5px] font-mono uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border bg-sage-soft ${L.tone === "gold" ? "border-gold-soft text-gold bg-gold-light/5" : "border-line text-taupe"} `}>
                        {L.tag}
                      </span>
                      {L.score >= 90 && (
                        <span className="flex items-center gap-0.5 text-[8.5px] font-mono uppercase tracking-widest text-gold font-bold">
                          <Flame className="w-3 h-3 text-gold fill-gold" /> Critical
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-taupe mt-1 truncate">
                      <strong>{L.org}</strong> — {L.country}
                    </p>
                  </div>
                  <div className="text-right flex flex-col justify-between items-end">
                    <span className="text-[10px] text-taupe font-mono uppercase font-semibold text-gold-soft bg-gold-light/10 border border-gold-soft/10 px-1.5 py-0.5 rounded">
                      Score {L.score}
                    </span>
                    <span className="text-[9px] text-taupe-light font-mono italic mt-1">{L.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-ivory/60 border border-line border-dashed rounded text-center">
              <button
                onClick={() => onTabChange("leads")}
                className="text-xs font-mono tracking-widest uppercase text-moss font-semibold hover:text-gold transition-colors inline-flex items-center gap-1.5"
              >
                <span>View Full Captured Registry ({leads.length})</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* CAPTURE MODULE */}
      {currentTab === "capture" && (
        <motion.div key="capture-view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="border-b border-line pb-4">
            <span className="font-mono text-[9px] tracking-widest uppercase text-gold-soft">Ecosystem Floor capturing</span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink mt-1">Live Capture Interface</h2>
            <p className="text-sm text-taupe mt-1 leading-relaxed">
              Optimized, single-hand interface to enroll investors and institutional stakeholders immediately on the CAIF festival floor. Zero lag, real-time analytics.
            </p>
          </div>

          <form onSubmit={handleCaptureSubmit} className="bg-ivory border border-line rounded-lg p-5 shadow-sm space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="cap-name" className="block font-mono text-[9px] tracking-widest uppercase text-taupe-light">
                Full Name <span className="text-gold-soft">*</span>
              </label>
              <input
                id="cap-name"
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Marcus Beaumont"
                className="w-full bg-cream border border-line rounded px-4 py-3 font-serif text-lg leading-tight text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
              />
              {formErrors.name && <p className="text-[10px] text-clay font-mono">{formErrors.name}</p>}
            </div>

            {/* Email & Phone grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="cap-email" className="block font-mono text-[9px] tracking-widest uppercase text-taupe-light">
                  Email Coordinates <span className="text-gold-soft">*</span>
                </label>
                <input
                  id="cap-email"
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="mbeaumont@quanta.fund"
                  className="w-full bg-cream border border-line rounded px-4 py-3 font-serif text-lg leading-tight text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
                />
                {formErrors.email && <p className="text-[10px] text-clay font-mono">{formErrors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cap-phone" className="block font-mono text-[9px] tracking-widest uppercase text-taupe-light">
                  Contact Line <span className="text-gold-soft">*</span>
                </label>
                <input
                  id="cap-phone"
                  type="tel"
                  required
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+44 207 555 0188"
                  className="w-full bg-cream border border-line rounded px-4 py-3 font-serif text-lg leading-tight text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
                />
                {formErrors.phone && <p className="text-[10px] text-clay font-mono">{formErrors.phone}</p>}
              </div>
            </div>

            {/* Org & Role grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="cap-org" className="block font-mono text-[9px] tracking-widest uppercase text-taupe-light">
                  Organisation
                </label>
                <input
                  id="cap-org"
                  type="text"
                  value={formOrg}
                  onChange={(e) => setFormOrg(e.target.value)}
                  placeholder="Quanta Capital"
                  className="w-full bg-cream border border-line rounded px-4 py-3 font-serif text-lg leading-tight text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cap-role" className="block font-mono text-[9px] tracking-widest uppercase text-taupe-light">
                  Designated Role
                </label>
                <input
                  id="cap-role"
                  type="text"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                  placeholder="Managing Partner"
                  className="w-full bg-cream border border-line rounded px-4 py-3 font-serif text-lg leading-tight text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
                />
              </div>
            </div>

            {/* Stakeholder Tag Buttons */}
            <div className="space-y-2">
              <span className="block font-mono text-[9px] tracking-widest uppercase text-taupe-light">
                Stakeholder classification
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {["Investor", "VC", "Corporate", "Government", "DFI", "Partner"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFormTag(tag)}
                    className={`py-3 rounded border text-xs font-semibold uppercase tracking-wide cursor-pointer transition-all ${
                      formTag === tag
                        ? "bg-moss text-cream border-moss shadow-sm"
                        : "bg-cream border-line text-ink-soft hover:bg-cream-deep/60"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Context parameters (Simulator inputs) */}
            <div className="grid grid-cols-2 gap-4 border-t border-line-soft pt-4">
              <div className="space-y-1">
                <label htmlFor="cap-source" className="block font-mono text-[8px] tracking-widest uppercase text-taupe-light">
                  Input Source
                </label>
                <select
                  id="cap-source"
                  value={formSource}
                  onChange={(e) => setFormSource(e.target.value)}
                  className="w-full bg-cream border border-line rounded p-2 text-xs font-mono tracking-widest text-ink focus:outline-hidden"
                >
                  <option value="QR Scan">QR Scan</option>
                  <option value="Manual">Manual Entry</option>
                  <option value="Business Card">Business Card</option>
                </select>
              </div>

              <div className="space-y-1">
                <label htmlFor="cap-by" className="block font-mono text-[8px] tracking-widest uppercase text-taupe-light">
                  Staff Assisting
                </label>
                <select
                  id="cap-by"
                  value={formCapturedBy}
                  onChange={(e) => setFormCapturedBy(e.target.value)}
                  className="w-full bg-cream border border-line rounded p-2 text-xs font-mono tracking-widest text-ink focus:outline-hidden"
                >
                  <option value="Amaka Obi">Amaka Obi</option>
                  <option value="Tunde Yusuf">Tunde Yusuf</option>
                  <option value="Tope Omojayogbe">Tope Omojayogbe</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label htmlFor="cap-notes" className="block font-mono text-[9px] tracking-widest uppercase text-taupe-light">
                Staff Field Notes
              </label>
              <textarea
                id="cap-notes"
                rows={3}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="E.g., high interest in co-sponsoring early incubation tracks. Requesting Lagos follow-up."
                className="w-full bg-cream border border-line rounded px-4 py-3 font-serif text-base text-ink focus:outline-hidden focus:border-moss placeholder:font-serif placeholder:italic placeholder:text-mist/70"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={formSubmitting}
                className={`w-full py-4 bg-moss text-cream font-medium text-sm rounded shadow-md group relative overflow-hidden flex items-center justify-center gap-3 transition-colors ${
                  formSubmitting ? "opacity-75 cursor-not-allowed" : "hover:bg-moss-deep"
                }`}
              >
                <div className="absolute inset-px border border-dashed border-gold-light/20 pointer-events-none" />
                {formSubmitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                    <span>Synchronizing floor token...</span>
                  </>
                ) : (
                  <>
                    <span>Enroll Captured Lead</span>
                    <PlusCircle className="w-4 h-4 text-gold-light" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ALL LEADS MODULE */}
      {currentTab === "leads" && (
        <motion.div key="leads-view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="border-b border-line pb-4">
            <span className="font-mono text-[9px] tracking-widest uppercase text-gold-soft">Ecosystem database portal</span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink mt-1">Delegation Leads Registry</h2>
            <p className="text-sm text-taupe mt-1 leading-relaxed">
              Full list with real-time searching capabilities. Scroll and open matching cards to review scoring profiles and trigger dispatch processes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex-1 flex items-center gap-2 px-4 py-3 bg-ivory border border-line rounded-full font-sans text-sm text-taupe focus-within:border-moss">
              <Search className="w-4 h-4 text-taupe flex-shrink-0" />
              <input
                type="text"
                placeholder="Search leads..."
                value={leadsSearch}
                onChange={(e) => setLeadsSearch(e.target.value)}
                className="flex-1 bg-transparent border-0 outline-hidden text-ink placeholder:text-taupe-light"
              />
            </label>

            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
              {["all", "Investor", "VC", "Corporate", "Government", "DFI", "Partner"].map((f) => (
                <button
                  key={f}
                  onClick={() => setLeadsFilter(f)}
                  type="button"
                  className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all ${
                    leadsFilter === f
                      ? "bg-moss text-cream border-moss shadow-xs"
                      : "bg-ivory border-line text-ink-soft hover:bg-cream"
                  }`}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Counter */}
          <p className="font-mono text-[8.5px] uppercase tracking-wider text-taupe">
            Showing <strong className="text-ink">{filteredLeads.length}</strong> of {leads.length} recorded leads
          </p>

          {/* Lead List Cards Grid */}
          <div className="grid gap-3">
            {filteredLeads.map((L) => (
              <div
                key={L.id}
                onClick={() => onSelectItem(L)}
                className={`grid grid-cols-[auto_1fr_auto] gap-4 p-4 bg-ivory border border-line rounded cursor-pointer relative hover:border-moss transition-all group hover:translate-x-0.5`}
              >
                <div className={`absolute top-4 bottom-4 left-0 w-0.5 rounded-full ${L.tone === "gold" ? "bg-gold" : L.tone === "moss" ? "bg-moss" : L.tone === "laurel" ? "bg-laurel" : "bg-clay"} `} />
                <div className="w-11 h-11 rounded-full bg-moss text-gold-light flex items-center justify-center font-serif italic text-lg font-semibold border border-dashed border-gold-soft/20 group-hover:bg-moss-deep transition-colors">
                  {L.initials}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h4 className="font-serif font-medium text-base text-ink line-clamp-1">{L.name}</h4>
                    <span className={`text-[8.5px] font-mono uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border bg-sage-soft ${L.tone === "gold" ? "border-gold-soft text-gold bg-gold-light/5" : "border-line text-taupe"} `}>
                      {L.tag}
                    </span>
                    {L.score >= 90 && (
                      <span className="flex items-center gap-0.5 text-[8.5px] font-mono uppercase tracking-widest text-gold font-bold">
                        <Flame className="w-3 h-3 text-gold fill-gold" /> High Match
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-taupe mt-1 truncate">
                    <strong>{L.org}</strong> — {L.country}
                  </p>
                  <div className="mt-2.5 flex flex-col gap-1 text-[11px] text-taupe-light font-mono">
                    <span className="truncate">{L.email}</span>
                    <span>{L.phone}</span>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between items-end">
                  <span className="text-[10px] text-taupe font-mono uppercase font-semibold text-gold-soft bg-gold-light/10 border border-gold-soft/10 px-2 py-1 rounded">
                    Score {L.score}
                  </span>
                  <span className="text-[9px] text-taupe-light font-mono italic mt-1">{L.time}</span>
                </div>
              </div>
            ))}

            {filteredLeads.length === 0 && (
              <div className="p-10 bg-ivory border border-line border-dashed rounded text-center">
                <BadgeAlert className="w-8 h-8 text-gold mx-auto mb-2" />
                <h4 className="font-serif font-medium text-lg text-ink">Ecosystem lead not found</h4>
                <p className="text-xs text-taupe mt-1">Please test with a separate spelling or toggle the classify pills.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ACTIVITY MODULE */}
      {currentTab === "activity" && (
        <motion.div key="activity-view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="border-b border-line pb-4">
            <span className="font-mono text-[9px] tracking-widest uppercase text-gold-soft">Ecosystem flow metrics</span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink mt-1">Capture Activity Stream</h2>
            <p className="text-sm text-taupe mt-1 leading-relaxed border-t border-line pt-2">
              Bespoke hourly capture tracking designed to reveal peak engagement blocks and help coordinate staff assistance times across the delegation floor.
            </p>
          </div>

          {/* Quick Filters Block */}
          <div className="p-4 bg-ivory border border-line rounded-lg space-y-4 shadow-xs">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-moss font-mono text-[9px] tracking-widest uppercase font-semibold">
                <Filter className="w-3.5 h-3.5 text-moss" />
                <span>Filter trends in real-time</span>
              </div>
              <div className="flex justify-between items-center text-[9px] text-taupe font-mono">
                {(actClassification !== "all" || actStaff !== "all" || actSource !== "all" || actScore !== "all") ? (
                  <button 
                    onClick={() => {
                      setActClassification("all");
                      setActStaff("all");
                      setActSource("all");
                      setActScore("all");
                    }}
                    className="text-moss hover:text-moss-deep transition-colors font-bold cursor-pointer underline decoration-dotted underline-offset-2 bg-transparent border-0 outline-hidden"
                  >
                    Reset Filters ✕
                  </button>
                ) : (
                  <span className="opacity-60">All indicators active</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {/* Classification filter */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[8.5px] uppercase tracking-widest text-taupe-light font-medium">Stakeholder Class</label>
                <select
                  value={actClassification}
                  onChange={(e) => setActClassification(e.target.value)}
                  className="w-full bg-cream border border-line rounded p-2.5 text-xs text-ink font-sans focus:outline-hidden focus:border-moss"
                >
                  <option value="all">All Classifications</option>
                  <option value="Investor">Investor</option>
                  <option value="VC">VC</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Government">Government</option>
                  <option value="DFI">DFI</option>
                  <option value="Partner">Partner</option>
                </select>
              </div>

              {/* Staff Assisting filter */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[8.5px] uppercase tracking-widest text-taupe-light font-medium">Staff Assisting</label>
                <select
                  value={actStaff}
                  onChange={(e) => setActStaff(e.target.value)}
                  className="w-full bg-cream border border-line rounded p-2.5 text-xs text-ink font-sans focus:outline-hidden focus:border-moss"
                >
                  <option value="all">All Staff Facilitators</option>
                  <option value="Amaka Obi">Amaka Obi</option>
                  <option value="Tunde Yusuf">Tunde Yusuf</option>
                  <option value="Tope Omojayogbe">Tope Omojayogbe</option>
                </select>
              </div>

              {/* Input Source filter */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[8.5px] uppercase tracking-widest text-taupe-light font-medium">Capture Source</label>
                <select
                  value={actSource}
                  onChange={(e) => setActSource(e.target.value)}
                  className="w-full bg-cream border border-line rounded p-2.5 text-xs text-ink font-sans focus:outline-hidden focus:border-moss"
                >
                  <option value="all">All Sources</option>
                  <option value="qr">QR Scan</option>
                  <option value="manual">Manual Entry</option>
                  <option value="card">Business Card</option>
                </select>
              </div>

              {/* Score Match filter */}
              <div className="space-y-1.5">
                <label className="block font-mono text-[8.5px] uppercase tracking-widest text-taupe-light font-medium">Match Priority</label>
                <select
                  value={actScore}
                  onChange={(e) => setActScore(e.target.value)}
                  className="w-full bg-cream border border-line rounded p-2.5 text-xs text-ink font-sans focus:outline-hidden focus:border-moss"
                >
                  <option value="all">All Profiles</option>
                  <option value="high">Critical Match (≥ 90)</option>
                  <option value="medium">Medium Alignment (70-89)</option>
                  <option value="standard">Standard Potential (&lt; 70)</option>
                </select>
              </div>
            </div>
          </div>

          {/* KPI Mini Widget Indicators */}
          {(() => {
            const filtered = leads.filter((l) => {
              if (actClassification !== "all" && l.tag.toLowerCase() !== actClassification.toLowerCase()) return false;
              if (actStaff !== "all" && l.capturedBy.toLowerCase() !== actStaff.toLowerCase()) return false;
              if (actSource !== "all") {
                const s = l.source.toLowerCase();
                if (actSource === "qr" && !s.includes("qr")) return false;
                if (actSource === "manual" && !s.includes("manual")) return false;
                if (actSource === "card" && !s.includes("card")) return false;
              }
              if (actScore !== "all") {
                if (actScore === "high" && l.score < 90) return false;
                if (actScore === "medium" && (l.score < 70 || l.score >= 90)) return false;
                if (actScore === "standard" && l.score >= 70) return false;
              }
              return true;
            });

            const hourlyData = getHourlyDataForLeads(filtered);
            let peakHourLabel = "None";
            let peakHourCount = 0;
            hourlyData.forEach((d) => {
              if (d.count > peakHourCount) {
                peakHourCount = d.count;
                peakHourLabel = d.hourLabel;
              }
            });

            // Calculate active hours (count > 0)
            const activeHours = hourlyData.filter(d => d.count > 0);
            const activeHoursCount = activeHours.length;
            const avgLeadsPerHour = activeHoursCount > 0 ? (filtered.length / activeHoursCount).toFixed(1) : "0.0";
            const peakHourRange = activeHoursCount > 0 
              ? `${activeHours[0].hourLabel} — ${activeHours[activeHours.length - 1].hourLabel}` 
              : "No matches";

            return (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-4 bg-ivory border border-line rounded">
                    <span className="font-mono text-[8px] tracking-widest uppercase text-taupe-light block">Filter Count</span>
                    <span className="font-serif text-2xl font-semibold text-ink block mt-1">{filtered.length} leads</span>
                    <span className="font-mono text-[9px] text-taupe/80 block mt-1">Within active filters</span>
                  </div>

                  <div className="p-4 bg-ivory border border-line rounded">
                    <span className="font-mono text-[8px] tracking-widest uppercase text-taupe-light block">Peak Hour</span>
                    <span className="font-serif text-2xl font-semibold text-ink block mt-1">
                      {peakHourCount > 0 ? peakHourLabel : "N/A"}
                    </span>
                    <span className="font-mono text-[9px] text-moss block mt-1 font-semibold flex items-center gap-1 font-mono">
                      <Flame className="w-3.5 h-3.5 inline" /> {peakHourCount > 0 ? `${peakHourCount} captured` : "No captures"}
                    </span>
                  </div>

                  <div className="p-4 bg-ivory border border-line rounded">
                    <span className="font-mono text-[8px] tracking-widest uppercase text-taupe-light block">Active Hour Window</span>
                    <span className="font-serif text-xl font-medium text-ink block mt-1.5 truncate">
                      {peakHourRange}
                    </span>
                    <span className="font-mono text-[9px] text-taupe/80 block mt-1">{activeHoursCount} active hours</span>
                  </div>

                  <div className="p-4 bg-ivory border border-line rounded">
                    <span className="font-mono text-[8px] tracking-widest uppercase text-taupe-light block">Engagement Average</span>
                    <span className="font-serif text-2xl font-semibold text-ink block mt-1">
                      {avgLeadsPerHour} <span className="text-xs text-taupe font-mono font-normal">/ hr</span>
                    </span>
                    <span className="font-mono text-[9px] text-taupe/80 block mt-1">Relative to team shift active blocks</span>
                  </div>
                </div>

                {/* Main Graph Content */}
                <div className="p-5 bg-ivory border border-line rounded-lg space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-line-soft">
                    <div>
                      <h3 className="font-serif font-medium text-lg text-ink">Peak Floor Capture Velocity</h3>
                      <p className="text-[10px] text-taupe font-mono uppercase tracking-wider mt-0.5">Statistical hourly distribution</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-block w-2.5 h-2.5 bg-moss rounded-full" />
                      <span className="font-mono text-[9px] tracking-widest uppercase text-ink-soft">Leads Captured</span>
                    </div>
                  </div>

                  {filtered.length === 0 ? (
                    <div className="py-24 text-center border border-dashed border-line rounded-md bg-cream/50">
                      <ActivityIcon className="w-8 h-8 text-taupe-light mx-auto mb-2 opacity-40 animate-pulse" />
                      <h4 className="font-serif font-medium text-base text-ink">No metrics aligned with the filters</h4>
                      <p className="text-xs text-taupe mt-1.5">Adjust your facilitators, matching thresholds, or source dropdowns.</p>
                      <button
                        onClick={() => {
                          setActClassification("all");
                          setActStaff("all");
                          setActSource("all");
                          setActScore("all");
                        }}
                        className="mt-4 px-4 py-2 bg-moss text-cream font-mono text-[9.5px] tracking-widest uppercase rounded hover:bg-moss-deep transition-colors cursor-pointer border-0"
                      >
                        Reset indicators ✕
                      </button>
                    </div>
                  ) : (
                    <div className="w-full pt-4">
                      {/* Recharts responsive content */}
                      <div className="h-[320px] w-full font-mono bg-cream shadow-xs p-3 rounded border border-line/40">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={hourlyData}
                            margin={{ top: 20, right: 35, left: -20, bottom: 10 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E4E1D7" opacity={0.6} />
                            <XAxis 
                              dataKey="hourLabel" 
                              stroke="#7A7874" 
                              fontSize={10} 
                              fontStyle="italic"
                              tickLine={false}
                              axisLine={{ stroke: '#E4E1D7' }}
                            />
                            <YAxis 
                              stroke="#7A7874" 
                              fontSize={10} 
                              allowDecimals={false}
                              tickLine={false}
                              axisLine={{ stroke: '#E4E1D7' }}
                            />
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-cream-deep border border-mist p-3 rounded shadow-md text-left font-mono">
                                      <p className="text-moss font-serif font-bold text-xs">{label}</p>
                                      <p className="text-[11px] text-ink font-mono mt-1 font-semibold">
                                        Captures: {payload[0].value}
                                      </p>
                                      <p className="text-[9px] text-taupe-light font-sans font-normal mt-0.5 max-w-[160px] leading-tight">
                                        Matched against active parameters
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="#C15C3D"
                              strokeWidth={3.5}
                              dot={{ r: 5, fill: "#1E352F", stroke: "#F5F3EC", strokeWidth: 1.5 }}
                              activeDot={{ r: 7.5, fill: "#C15C3D", stroke: "#1E352F", strokeWidth: 2 }}
                              animationDuration={600}
                              name="Leads"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}
                </div>

                {/* List of matched items in active filters */}
                <div className="space-y-3.5">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-serif font-medium text-lg text-ink">Matched Filter Leads</h4>
                      <p className="font-mono text-[9px] text-gold-soft tracking-wider uppercase mt-0.5">Leads inside active selection</p>
                    </div>
                    <span className="font-mono text-[9.5px] uppercase text-taupe text-[10px]">
                      {filtered.length} Leads
                    </span>
                  </div>

                  <div className="grid gap-3.5">
                    {filtered.slice(0, 4).map((L) => (
                      <div
                        key={L.id}
                        onClick={() => onSelectItem(L)}
                        className="grid grid-cols-[auto_1fr_auto] gap-4 p-3.5 bg-ivory border border-line rounded cursor-pointer relative hover:border-moss transition-all group hover:translate-x-0.5 text-left"
                      >
                        <div className={`absolute top-3.5 bottom-3.5 left-0 w-0.5 rounded-full ${L.tone === "gold" ? "bg-gold" : L.tone === "moss" ? "bg-moss" : L.tone === "laurel" ? "bg-laurel" : "bg-clay"}`} />
                        <div className="w-10 h-10 rounded-full bg-moss text-gold-light flex items-center justify-center font-serif italic text-base font-semibold border border-dashed border-gold-soft/20 group-hover:bg-moss-deep transition-colors flex-shrink-0">
                          {L.initials}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap text-left">
                            <h5 className="font-serif font-medium text-base text-ink line-clamp-1">{L.name}</h5>
                            <span className="text-[8.5px] font-mono uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full border bg-sage-soft">
                              {L.tag}
                            </span>
                          </div>
                          <p className="text-xs text-taupe mt-1 truncate">
                            <strong>{L.org}</strong> · {L.capturedBy} assisting
                          </p>
                        </div>
                        <div className="text-right flex flex-col justify-between items-end flex-shrink-0">
                          <span className="text-[10px] text-taupe font-mono uppercase font-semibold text-gold-soft bg-gold-light/10 border border-gold-soft/10 px-1.5 py-0.5 rounded">
                            Score {L.score}
                          </span>
                          <span className="text-[9px] text-taupe-light font-mono mt-1 font-bold">{L.time}</span>
                        </div>
                      </div>
                    ))}
                    {filtered.length > 4 && (
                      <div className="p-3 bg-ivory/40 border border-line border-dashed rounded text-center">
                        <button
                          onClick={() => {
                            setLeadsFilter("all");
                            onTabChange("leads");
                          }}
                          className="text-xs font-mono tracking-widest uppercase text-moss font-semibold hover:text-gold transition-all inline-flex items-center gap-1.5 cursor-pointer bg-transparent border-0 outline-hidden"
                        >
                          <span>Review all {filtered.length} matched registrations in registry portal</span>
                          <span>→</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            );
          })()}
        </motion.div>
      )}

      {/* ANALYTICS MODULE */}
      {currentTab === "analytics" && (
        <motion.div key="analytics-view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="border-b border-line pb-4">
            <span className="font-mono text-[9px] tracking-widest uppercase text-gold-soft">Ecosystem Intelligence</span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink mt-1">Ecosystem Analytics</h2>
            <p className="text-sm text-taupe mt-1 leading-relaxed">
              Dossier metrics covering capture sources, regional pipelines, conversion channels, and team followups performance.
            </p>
          </div>

          {/* Funnel chart */}
          <div className="p-5 bg-ivory border border-line rounded-lg">
            <div className="flex justify-between items-baseline mb-4 p-1">
              <h3 className="font-serif font-medium text-base text-ink flex items-center">
                Capture Funnel Ratio
                <AnalyticTooltip 
                  title="Capture Funnel Ratio"
                  purpose="Tracks transition efficiency of floor interactions from initial registration, through digital micro-confirmations and active follow-ups, to confirmed physical or virtual B2B meetings."
                  necessity="Ensures no premium contact falls through the cracks. Live monitoring of drop-off rates empowers the delegation to actively re-engage potential high-value partners before they exit the festival."
                />
              </h3>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-taupe">May 29, 2026</span>
            </div>
            <div className="space-y-3.5">
              {(() => {
                const floorCaptured = totalCapturesCount;
                const micrositeConfirmed = Math.min(floorCaptured, leads.filter(l => l.source === "QR Scan" || l.capturedBy === "Self-registered" || l.confirmed || l.score >= 70 || l.followUpSent || meetings.some(m => m.leadId === l.id)).length);
                const followUpOpened = Math.min(micrositeConfirmed, leads.filter(l => l.followUpSent || l.score >= 80 || meetings.some(m => m.leadId === l.id)).length);
                const meetingsScheduled = Math.min(followUpOpened, leads.filter(l => meetings.some(m => m.leadId === l.id)).length);

                return [
                  { step: "Floor Captured", count: floorCaptured, pct: 100 },
                  { step: "Microsite Confirmed", count: micrositeConfirmed, pct: floorCaptured > 0 ? Math.round((micrositeConfirmed / floorCaptured) * 100) : 0 },
                  { step: "Follow-up Opened", count: followUpOpened, pct: floorCaptured > 0 ? Math.round((followUpOpened / floorCaptured) * 100) : 0 },
                  { step: "Bilateral Meetings Scheduled", count: meetingsScheduled, pct: floorCaptured > 0 ? Math.round((meetingsScheduled / floorCaptured) * 100) : 0 },
                ].map((item) => (
                  <div key={item.step} className="relative overflow-hidden p-4 rounded bg-cream border border-line-soft shadow-sm hover:border-moss transition-all group">
                    {/* Visually descriptive color-accented progress track gauge in background */}
                    <div 
                      className="absolute top-0 bottom-0 left-0 bg-gold-light/20 transition-all duration-1000 group-hover:bg-gold-light/30"
                      style={{ width: `${item.pct}%` }}
                    />
                    <div className="relative flex justify-between items-center z-10">
                      <div>
                        <h5 className="font-sans font-semibold text-xs text-ink">{item.step}</h5>
                        <span className="font-mono text-[9px] text-taupe-light uppercase tracking-wider">Conversion Ratio: {item.pct}%</span>
                      </div>
                      <div className="text-right">
                        <strong className="font-serif font-bold text-lg text-moss block leading-none">{item.count}</strong>
                        <span className="text-[8px] font-mono text-taupe-light uppercase block mt-0.5">Leads Mapped</span>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Regional distribution */}
          <div className="p-5 bg-ivory border border-line rounded-lg">
            <div className="flex justify-between items-baseline mb-4 p-1">
              <h3 className="font-serif font-medium text-base text-ink flex items-center">
                Bilateral Regional Interest
                <AnalyticTooltip 
                  title="Bilateral Regional Interest"
                  purpose="Maps real-time geographic registration density, highlighting which key trade and technology corridors are generating the highest bilateral engagement momentum."
                  necessity="Enables accurate alignment of trade portfolios and localized pitches. Leverages spatial momentum data to prioritize ministerial resources for high-converting international delegations."
                />
              </h3>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-taupe">Geographic Distribution</span>
            </div>
            <div className="space-y-4">
              {[
                { name: "Canada Corridors", count: leads.filter((l) => l.country === "Canada").length },
                { name: "Nigeria Hub Corridor", count: leads.filter((l) => l.country === "Nigeria").length },
                { name: "United Kingdom Markets", count: leads.filter((l) => l.country === "United Kingdom").length },
                { name: "Kenya Hub Connections", count: leads.filter((l) => l.country === "Kenya").length },
                { name: "Sweden Tech Transfer", count: leads.filter((l) => l.country === "Sweden").length },
              ].map((item) => {
                const pct = leads.length > 0 ? Math.round((item.count / leads.length) * 100) : 0;
                return (
                  <div key={item.name} className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full border border-line bg-cream font-serif italic font-semibold text-xs flex items-center justify-center text-moss">
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs font-semibold text-ink-soft mb-1">
                        <span>{item.name}</span>
                        <strong className="font-mono text-[10px] text-taupe">{item.count} Cap</strong>
                      </div>
                      <div className="h-1 bg-cream border border-line/45 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-moss to-gold rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategic Priority Alignment Breakdown */}
          <div className="p-5 bg-ivory border border-line rounded-lg">
            <div className="flex justify-between items-baseline mb-4 p-1">
              <h3 className="font-serif font-medium text-base text-ink flex items-center">
                Stakeholder Strategic Score Breakdown
                <AnalyticTooltip 
                  title="Stakeholder Strategic Score"
                  purpose="Calculates the average alignment priority score indexed across different stakeholder classifications, mapping engagement interest depth."
                  necessity="Allows organizers to direct key trade delegates to sectors with the highest interested investor pool, maximizing the conversion rate of bilateral project agreements."
                  align="right"
                />
              </h3>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-taupe block">Alignment index</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
              {[
                { 
                  label: "Investors / VCs", 
                  count: leads.filter(l => l.tag === "Investor" || l.tag === "VC").length, 
                  score: Math.round(leads.filter(l => l.tag === "Investor" || l.tag === "VC").reduce((acc, current) => acc + current.score, 0) / Math.max(1, leads.filter(l => l.tag === "Investor" || l.tag === "VC").length)) || 0
                },
                { 
                  label: "Corporates & Partners", 
                  count: leads.filter(l => l.tag === "Corporate" || l.tag === "Partner").length, 
                  score: Math.round(leads.filter(l => l.tag === "Corporate" || l.tag === "Partner").reduce((acc, current) => acc + current.score, 0) / Math.max(1, leads.filter(l => l.tag === "Corporate" || l.tag === "Partner").length)) || 0
                },
                { 
                  label: "Government & DFIs", 
                  count: leads.filter(l => l.tag === "Government" || l.tag === "DFI").length, 
                  score: Math.round(leads.filter(l => l.tag === "Government" || l.tag === "DFI").reduce((acc, current) => acc + current.score, 0) / Math.max(1, leads.filter(l => l.tag === "Government" || l.tag === "DFI").length)) || 0
                },
              ].map((pill, i) => (
                <div key={i} className="p-4 bg-cream border border-line-soft rounded shadow-sm hover:border-moss transition-all group">
                  <div className="flex justify-between items-baseline">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-taupe-light block">{pill.label}</span>
                    <strong className="text-moss font-mono text-xs">{pill.count} Leads</strong>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="font-serif text-3xl font-medium text-ink">{pill.score}</span>
                    <span className="font-mono text-[9px] text-taupe-light">AVG SCORE</span>
                  </div>
                  <span className="text-[10px] font-sans text-taupe block mt-2">
                    {pill.score >= 80 ? "✓ High strategic intent mapped" : "✓ Active screening ongoing"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* MEETINGS MODULE */}
      {currentTab === "meetings" && (
        <motion.div key="meetings-view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="border-b border-line pb-4">
            <span className="font-mono text-[9px] tracking-widest uppercase text-gold-soft">Ecosystem calendars</span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink mt-1">Calendar Follow-ups</h2>
            <p className="text-sm text-taupe mt-1 leading-relaxed">
              Review delegation schedule blockings. Direct physical appointments take place on delegation floor structures, virtual syncs are mapped to workspace relays.
            </p>
          </div>

          <div className="space-y-6">
            {/* Days group */}
            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] tracking-widest uppercase text-gold-soft mb-4">
                <span>Active Today · Fri 29 May</span>
                <span className="flex-1 h-px bg-line" />
              </div>

              <div className="space-y-2.5">
                {meetings.filter(m => m.dateStr.includes("Today")).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      const associatedLead = leads.find(l => l.id === m.leadId);
                      if (associatedLead) onSelectItem(associatedLead);
                    }}
                    className={`grid grid-cols-[56px_1fr_auto] gap-4 p-4 bg-ivory border border-line rounded cursor-pointer relative hover:border-moss transition-all group`}
                  >
                    <div className={`absolute top-4 bottom-4 left-0 w-0.5 rounded-full ${m.isVirtual ? "bg-laurel" : "bg-gold"} `} />
                    <div className="text-center flex flex-col justify-center leading-none text-ink pr-1 border-r border-line-soft select-none">
                      <span className="font-serif font-semibold text-[22px] tracking-tighter">{m.time}</span>
                      <span className="font-mono text-[8px] tracking-widest text-taupe-light mt-1.5 uppercase">{m.period}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-medium text-base text-ink truncate">{m.leadName}</h4>
                      <p className="text-xs text-taupe mt-0.5 truncate">{m.orgName}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gold font-mono uppercase tracking-wider font-semibold">
                        <span className={`px-2 py-0.5 rounded-full ${m.isVirtual ? "bg-laurel/10 text-laurel" : "bg-gold/10 text-gold"} `}>
                          {m.isVirtual ? "Virtual" : "Floor Venue"}
                        </span>
                        <span className="text-taupe-light font-normal text-[9px]">{m.location}</span>
                      </div>
                    </div>
                    <div className="self-center">
                      <div className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-taupe group-hover:text-moss group-hover:border-moss transition-all">
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 font-mono text-[9px] tracking-widest uppercase text-gold-soft mb-4">
                <span>Subsequent Followups · Mon 1 Jun</span>
                <span className="flex-1 h-px bg-line" />
              </div>

              <div className="space-y-2.5">
                {meetings.filter(m => !m.dateStr.includes("Today")).map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      const associatedLead = leads.find(l => l.id === m.leadId);
                      if (associatedLead) onSelectItem(associatedLead);
                    }}
                    className={`grid grid-cols-[56px_1fr_auto] gap-4 p-4 bg-ivory border border-line rounded cursor-pointer relative hover:border-moss transition-all group`}
                  >
                    <div className={`absolute top-4 bottom-4 left-0 w-0.5 rounded-full ${m.isVirtual ? "bg-laurel" : "bg-gold"} `} />
                    <div className="text-center flex flex-col justify-center leading-none text-ink pr-1 border-r border-line-soft select-none">
                      <span className="font-serif font-semibold text-[22px] tracking-tighter">{m.time}</span>
                      <span className="font-mono text-[8px] tracking-widest text-taupe-light mt-1.5 uppercase">{m.period}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-serif font-medium text-base text-ink truncate">{m.leadName}</h4>
                      <p className="text-xs text-taupe mt-0.5 truncate">{m.orgName}</p>
                      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gold font-mono uppercase tracking-wider font-semibold">
                        <span className={`px-2 py-0.5 rounded-full ${m.isVirtual ? "bg-laurel/10 text-laurel" : "bg-gold/10 text-gold"} `}>
                          {m.isVirtual ? "Virtual" : "Floor Venue"}
                        </span>
                        <span className="text-taupe-light font-normal text-[9px]">{m.location}</span>
                      </div>
                    </div>
                    <div className="self-center">
                      <div className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-taupe group-hover:text-moss group-hover:border-moss transition-all">
                        <span>→</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* EXPORTS MODULE */}
      {currentTab === "exports" && (
        <motion.div key="exports-view" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="border-b border-line pb-4">
            <span className="font-mono text-[9px] tracking-widest uppercase text-gold-soft">Ecosystem Sync Portal</span>
            <h2 className="font-serif text-3xl font-medium tracking-tight text-ink mt-1">Data Exports Compilation</h2>
            <p className="text-sm text-taupe mt-1 leading-relaxed">
              Package leads into unified spreadsheets, printed briefing dossier formats, or execute OAuth pipelines with Salesforce Hubspot structures on the floor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <div
              onClick={handleExportCSV}
              className="p-5 bg-ivory border border-line rounded-lg cursor-pointer transition-all hover:border-moss hover:bg-cream hover:-translate-y-0.5 relative group"
            >
              <div className="w-10 h-10 rounded-full border border-gold bg-gold/10 flex items-center justify-center text-gold mb-3 transition-colors group-hover:bg-moss group-hover:text-cream group-hover:border-moss">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-medium text-lg text-ink">CSV Spreadsheet Package</h4>
              <p className="text-xs text-taupe mt-1 dẫn-relaxed">
                Compiles all captured fields into a unified comma-separated sheet. Immediate download. Fully compatible with Excel and CRM upload grids.
              </p>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-gold-soft block mt-3">~ 48 KB · Auto structure</span>
            </div>

            <div
              onClick={() => setIsPrintPreviewOpen(true)}
              className="p-5 bg-ivory border border-line rounded-lg cursor-pointer transition-all hover:border-moss hover:bg-cream hover:-translate-y-0.5 relative group"
            >
              <div className="w-10 h-10 rounded-full border border-gold bg-gold/10 flex items-center justify-center text-gold mb-3 transition-colors group-hover:bg-moss group-hover:text-cream group-hover:border-moss">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-medium text-lg text-ink">Facilitar Briefing PDF</h4>
              <p className="text-xs text-taupe mt-1 leading-relaxed">
                Formatted booklet dossier compiling each captured prospect with score indicator, team field notes, and timeline stats. Beautifully designed catalog.
              </p>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-gold-soft block mt-3">~ 2.4 MB · Print formatted</span>
            </div>

            <div
              onClick={() => handleCRMIntegration("Salesforce")}
              className="p-5 bg-ivory border border-line rounded-lg cursor-pointer transition-all hover:border-moss hover:bg-cream hover:-translate-y-0.5 relative group"
            >
              <div className="w-10 h-10 rounded-full border border-gold bg-gold/10 flex items-center justify-center text-gold mb-3 transition-colors group-hover:bg-moss group-hover:text-cream group-hover:border-moss">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-medium text-lg text-ink">Salesforce Core Sync</h4>
              <p className="text-xs text-taupe mt-1 leading-relaxed">
                Appends captured investor structures to connected NBTI server databases. Generates formal lead profiles automatically on corporate instances.
              </p>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-gold-soft block mt-3">Active Integration · OAuth Ready</span>
            </div>

            <div
              onClick={() => handleCRMIntegration("HubSpot")}
              className="p-5 bg-ivory border border-line rounded-lg cursor-pointer transition-all hover:border-moss hover:bg-cream hover:-translate-y-0.5 relative group"
            >
              <div className="w-10 h-10 rounded-full border border-gold bg-gold/10 flex items-center justify-center text-gold mb-3 transition-colors group-hover:bg-moss group-hover:text-cream group-hover:border-moss">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-medium text-lg text-ink">HubSpot Pipeline Sync</h4>
              <p className="text-xs text-taupe mt-1 leading-relaxed">
                Migrates active prospects into HubSpot CRM contact categories with custom delegation tracking variables and score thresholds.
              </p>
              <span className="font-mono text-[8.5px] uppercase tracking-wider text-gold-soft block mt-3">Focal API key needed</span>
            </div>
          </div>

          {/* Executive PDF Report Generator Panel */}
          <div className="p-6 bg-cream border border-line rounded-lg space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold/15 flex items-center justify-center text-gold select-none">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif font-medium text-base text-ink">Executive PDF Dossier Compiler</h4>
                  <p className="text-xs text-taupe leading-relaxed">Configure and generate a formal, print-friendly compilation booklet of the current leads registry.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              {/* Sort selector */}
              <div className="space-y-1.5">
                <label className="block text-[9.5px] uppercase font-mono tracking-widest text-taupe font-bold">Sort Order</label>
                <select
                  value={printSortBy}
                  onChange={(e) => setPrintSortBy(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-ivory border border-line rounded focus:outline-none focus:border-moss"
                >
                  <option value="chronological">Chronological (Newest)</option>
                  <option value="score">Lead Score (Highest)</option>
                  <option value="alphabetical">Organization (A-Z)</option>
                </select>
              </div>

              {/* Layout format */}
              <div className="space-y-1.5">
                <label className="block text-[9.5px] uppercase font-mono tracking-widest text-taupe font-bold">Report Layout Style</label>
                <select
                  value={printLayout}
                  onChange={(e) => setPrintLayout(e.target.value as any)}
                  className="w-full text-xs p-2.5 bg-ivory border border-line rounded focus:outline-none focus:border-moss"
                >
                  <option value="cards">Detailed Briefing Cards</option>
                  <option value="table">Dense Executive Table</option>
                </select>
              </div>

              {/* Toggles */}
              <div className="sm:col-span-2 grid grid-cols-3 gap-2 self-end pb-1.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={printShowNotes}
                    onChange={(e) => setPrintShowNotes(e.target.checked)}
                    className="w-4 h-4 accent-moss rounded border-line cursor-pointer"
                  />
                  <span className="text-[11px] text-taupe font-semibold">Include Notes</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={printShowScores}
                    onChange={(e) => setPrintShowScores(e.target.checked)}
                    className="w-4 h-4 accent-moss rounded border-line cursor-pointer"
                  />
                  <span className="text-[11px] text-taupe font-semibold">Show Scores</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={printShowTimes}
                    onChange={(e) => setPrintShowTimes(e.target.checked)}
                    className="w-4 h-4 accent-moss rounded border-line cursor-pointer"
                  />
                  <span className="text-[11px] text-taupe font-semibold">Show Capture Times</span>
                </label>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsPrintPreviewOpen(true)}
                className="w-full sm:w-auto py-2.5 px-6 bg-moss hover:bg-moss-deep text-cream font-mono text-xs tracking-widest uppercase rounded flex items-center justify-center gap-2.5 transition-colors font-bold shadow-sm"
              >
                <Printer className="w-4 h-4" />
                Generate PDF Report ({leads.length} Leads)
              </button>
            </div>
          </div>

          {/* Export historical logging */}
          <div className="pt-3">
            <h3 className="font-mono text-[9px] tracking-widest uppercase text-gold-soft mb-3 flex items-center gap-2">
              Recent Workspace Exports Log <span className="flex-1 h-px bg-line-soft" />
            </h3>
            
            <div className="border border-line rounded bg-ivory divide-y divide-line-soft overflow-hidden">
              {exportsList.map((ex) => (
                <div key={ex.id} className="flex justify-between items-center p-3.5">
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans font-medium text-sm text-ink truncate">{ex.fileName}</span>
                      <span className="font-mono text-[8px] text-taupe-light bg-cream border border-line-soft px-1.5 py-0.5 rounded font-bold uppercase">
                        {ex.fileType}
                      </span>
                    </div>
                    <div className="text-[10px] text-taupe-light font-mono mt-1">
                      {ex.dateStr} · {ex.recordCount} leads synchronized
                    </div>
                  </div>
                  <button
                    onClick={() => showToast("Downloading log link...")}
                    className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-moss hover:bg-moss hover:text-cream hover:border-moss transition-colors flex-shrink-0"
                    title="Download document backup"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Export Confirmation Modal */}
      <AnimatePresence>
        {exportModalOpen && exportType && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setExportModalOpen(false);
                setExportType(null);
              }}
              className="fixed inset-0 z-[80] bg-moss/50 backdrop-blur-xs"
            />

            {/* Dialog Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-cream border border-line rounded-xl shadow-2xl p-6 z-[100] text-ink text-left font-sans"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-line pb-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[8px] tracking-widest uppercase text-gold-soft block font-bold">Facilitator Floor Clearance</span>
                  <h3 className="font-serif text-xl font-medium tracking-tight text-ink mt-0.5">Confirm Export Request</h3>
                </div>
              </div>

              {/* Summary Block */}
              <div className="space-y-4">
                <div className="space-y-1.5 p-3.5 bg-ivory border border-line-soft rounded-lg text-xs leading-relaxed">
                  <p className="font-bold text-taupe font-mono text-[9px] uppercase tracking-wider">Export Configuration</p>
                  
                  <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 my-2">
                    <span className="text-taupe-light">Destination:</span>
                    <span className="font-semibold text-ink">
                      {exportType === "CSV" ? "CSV Spreadsheet Download" : 
                       exportType === "PDF" ? "Briefing Dossier PDF Booklet" : 
                       `${exportType} Core Cloud Sync`}
                    </span>

                    <span className="text-taupe-light">File Scope:</span>
                    <span className="font-semibold text-moss">
                      Interactive batch selector
                    </span>

                    <span className="text-taupe-light">Included Leads:</span>
                    <span className="font-mono text-xs font-bold text-gold-soft">
                      {selectedLeadIds.length} of {leads.length} records to compile
                    </span>

                    <span className="text-taupe-light">Format Spec:</span>
                    <span className="font-sans italic text-taupe">
                      {exportType === "CSV" ? "Comma-Separated Grid file (UTF-8)" : 
                       exportType === "PDF" ? "Dossier print compilation booklet" : 
                       `Secure OAuth REST payload batch`}
                    </span>
                  </div>
                </div>

                {/* Sub-breakdown statistics */}
                <div className="p-3.5 bg-ivory border border-line-soft rounded-lg text-xs">
                  <p className="font-bold text-taupe font-mono text-[9px] uppercase tracking-wider mb-2">Selected Lead Classification Breakdown</p>
                  <div className="flex flex-wrap gap-2 text-[10px] uppercase font-mono tracking-wider font-semibold">
                    <span className="px-2 py-1 bg-gold/10 border border-gold/20 rounded-full text-gold">
                      Investors: {leads.filter(l => selectedLeadIds.includes(l.id)).filter(l => l.tag === "Investor" || l.tag === "VC").length}
                    </span>
                    <span className="px-2 py-1 bg-moss/10 border border-moss/20 rounded-full text-moss">
                      Partners: {leads.filter(l => selectedLeadIds.includes(l.id)).filter(l => l.tag === "Partner" || l.tag === "Corporate").length}
                    </span>
                    <span className="px-1.5 py-1 bg-clay/10 border border-clay/20 rounded-full text-clay">
                      Gov/DFI: {leads.filter(l => selectedLeadIds.includes(l.id)).filter(l => l.tag === "Government" || l.tag === "DFI").length}
                    </span>
                  </div>
                </div>

                {/* Selected Records Preview Summary */}
                <div className="p-3.5 bg-ivory border border-line-soft rounded-lg text-xs">
                  <div className="flex justify-between items-center mb-2.5">
                    <p className="font-bold text-taupe font-mono text-[9px] uppercase tracking-wider">
                      Selected Records Summary
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleToggleAllLeads}
                        className="font-mono text-[9px] text-moss bg-moss/5 border border-moss/20 hover:bg-moss/10 px-2.5 py-0.5 rounded tracking-wider uppercase font-bold transition-all cursor-pointer"
                      >
                        {selectedLeadIds.length === leads.length ? "Deselect All" : "Select All"}
                      </button>
                    </div>
                  </div>
                  
                  {leads.length === 0 ? (
                    <p className="text-taupe-light italic text-center py-2">
                      No delegation records captured yet.
                    </p>
                  ) : (
                    <div>
                      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-left custom-scrollbar">
                        {leads.map((lead, index) => {
                          const isSelected = selectedLeadIds.includes(lead.id);
                          return (
                            <label
                              key={lead.id || index}
                              className={`flex items-center gap-3 bg-cream/70 rounded p-2 text-[11px] border cursor-pointer select-none transition-colors ${
                                isSelected 
                                  ? "border-moss/50 bg-moss/5" 
                                  : "border-line-soft/40 hover:bg-cream"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleLeadSelection(lead.id)}
                                className="w-4 h-4 rounded border-line accent-moss cursor-pointer flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="font-serif font-bold text-ink block truncate leading-tight">
                                  {lead.name}
                                </span>
                                <span className="text-[10px] text-taupe-light truncate block font-sans">
                                  {lead.role} at {lead.org}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-line-soft/50 text-taupe font-semibold uppercase">
                                  {lead.tag}
                                </span>
                                <span className="font-mono text-[10px] text-ink font-bold bg-gold/10 text-gold-soft px-1 rounded">
                                  {lead.score}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Compliance Statement */}
                <div className="p-3.5 bg-cream hover:bg-ivory border border-line-soft rounded-lg text-[10.5px] text-taupe leading-relaxed">
                  <div className="flex gap-2 items-start">
                    <BadgeAlert className="w-4 h-4 text-moss flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Compliance Disclaimer:</strong> Export operations logs are preserved on device. Maintain strict compliance with NBTI regulatory privacy frameworks.
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-line-soft">
                <button
                  onClick={() => {
                    setExportModalOpen(false);
                    setExportType(null);
                  }}
                  className="flex-1 py-2.5 px-4 bg-transparent border border-line text-taupe hover:text-ink font-mono text-[10px] tracking-widest uppercase rounded hover:bg-ivory transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const type = exportType;
                    if (type === "CSV") {
                      executeExportCSV();
                    } else if (type === "PDF") {
                      executeExportPDF();
                    } else {
                      executeCRMIntegration(type as "Salesforce" | "HubSpot");
                    }
                  }}
                  className={`flex-1 py-2.5 px-4 font-mono text-[10px] tracking-widest uppercase rounded transition-all font-bold ${
                    selectedLeadIds.length === 0
                      ? "bg-line-soft text-taupe-light cursor-not-allowed border-0"
                      : "bg-moss text-cream hover:bg-moss-deep cursor-pointer border-0"
                  }`}
                  disabled={selectedLeadIds.length === 0}
                >
                  Confirm & Export ({selectedLeadIds.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detailed Document Print Preview Modal */}
      <AnimatePresence>
        {isPrintPreviewOpen && (
          <div className="fixed inset-0 z-[120] flex flex-col bg-stone-900/60 backdrop-blur-md overflow-hidden text-left font-sans no-print">
            {/* Control Bar */}
            <div className="bg-cream border-b border-line p-4 flex flex-wrap items-center justify-between gap-4 z-10 w-full shadow-lg">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-moss/10 flex items-center justify-center text-moss">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-ink m-0">Print Dossier Room</h3>
                  <p className="text-[10px] text-taupe block m-0">Review print layout. Choose "Save as PDF" on your system printer dialog.</p>
                </div>
              </div>

              {/* Inside control options */}
              <div className="flex flex-wrap items-center gap-3 font-mono">
                <div className="flex items-center gap-2 bg-ivory p-1.5 border border-line rounded">
                  <span className="text-[10px] uppercase font-bold text-taupe pl-1.5">View:</span>
                  <button
                    onClick={() => setPrintLayout("cards")}
                    className={`px-2.5 py-1 rounded text-[10px] uppercase cursor-pointer transition-colors ${printLayout === "cards" ? "bg-moss text-cream font-bold" : "text-taupe hover:text-ink"}`}
                  >
                    Briefing Cards
                  </button>
                  <button
                    onClick={() => setPrintLayout("table")}
                    className={`px-2.5 py-1 rounded text-[10px] uppercase cursor-pointer transition-colors ${printLayout === "table" ? "bg-moss text-cream font-bold" : "text-taupe hover:text-ink"}`}
                  >
                    Dense Grid
                  </button>
                </div>

                <div className="flex items-center gap-2 bg-ivory p-1.5 border border-line rounded">
                  <span className="text-[10px] uppercase font-bold text-taupe pl-1.5">Sort:</span>
                  <select
                    value={printSortBy}
                    onChange={(e) => setPrintSortBy(e.target.value as any)}
                    className="text-[10px] bg-transparent border-0 font-mono text-ink focus:outline-none cursor-pointer"
                  >
                    <option value="chronological">Chronological</option>
                    <option value="score">Lead Score</option>
                    <option value="alphabetical">Company name</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPrintPreviewOpen(false)}
                    className="py-2 px-4 bg-transparent border border-line text-taupe hover:text-ink font-mono text-[10px] tracking-widest uppercase rounded hover:bg-ivory transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                  <button
                    onClick={() => {
                      onAddExport({
                        id: `ex-pdf-${Date.now()}`,
                        fileName: `nbti_delegation_leads_report_${Date.now()}.pdf`,
                        fileType: "PDF",
                        dateStr: "Just now · Fri 29 May",
                        recordCount: leads.length,
                      });
                      showToast("Opening device print compiler...");
                      setTimeout(() => {
                        window.print();
                      }, 500);
                    }}
                    className="py-2 px-5 bg-moss text-cream font-mono text-[10px] tracking-widest uppercase rounded hover:bg-moss-deep transition-colors cursor-pointer border-0 font-bold flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print / Save PDF
                  </button>
                </div>
              </div>
            </div>

            {/* Print Sheet Scroll Container */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-stone-900/35 flex justify-center">
              {/* Sheet Canvas mock */}
              <div className="w-full max-w-4xl bg-white border border-stone-300 shadow-2xl p-8 md:p-12 text-stone-900 rounded print-dossier-root">
                {/* Official Strategic Header */}
                <div className="flex justify-between items-start border-b-2 border-stone-900 pb-4 mb-6">
                  <div>
                    <span className="font-mono text-[9px] font-black tracking-widest text-moss uppercase">NBTI Strategic Co-Investment Forum</span>
                    <h1 className="font-serif font-bold text-2xl tracking-tight text-stone-950 mt-1">Nigeria-Canada Business Alliance (NCBA)</h1>
                    <p className="text-[10px] text-stone-500 mt-0.5 font-sans">Strategic Partnering & High-Priority VC Delegation registry · Toronto 2026</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="font-mono text-[10px] font-bold text-stone-900 border border-stone-950 px-2 py-0.5 uppercase tracking-wider">Confidential</span>
                    <span className="text-[9px] font-mono text-stone-400 mt-2">Dossier compiles: {leads.length} Records</span>
                    <span className="text-[9px] font-mono text-stone-400">Timestamp: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Co-partnership Credential indicators under top border */}
                <div className="grid grid-cols-3 gap-2 border-b border-stone-200 pb-4 mb-6 text-[10.5px] text-stone-600">
                  <div>
                    <strong className="block text-[8px] uppercase font-mono tracking-wider text-stone-400 font-bold">Focal Organizer Agency:</strong>
                    National Board for Technology Incubation (NBTI)
                  </div>
                  <div>
                    <strong className="block text-[8px] uppercase font-mono tracking-wider text-stone-400 font-bold">Strategic Partnership UKALD:</strong>
                    United Kingdom Advisory and Leads Committee (International Co-sponsor)
                  </div>
                  <div>
                    <strong className="block text-[8px] uppercase font-mono tracking-wider text-stone-400 font-bold">Compliance Authority:</strong>
                    FIST Investment Board (Federal Regulatory Liaison framework)
                  </div>
                </div>

                {/* Summary Metadata Metrics grid for sheet printing */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 border border-stone-200 rounded p-4 mb-6 text-stone-800">
                  <div>
                    <span className="block text-[8px] uppercase font-mono tracking-wider text-stone-500 font-bold">Delegates Compiled</span>
                    <span className="font-serif font-bold text-lg text-stone-900">{leads.length}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-mono tracking-wider text-stone-500 font-bold">Average Co-invest Interest</span>
                    <span className="font-serif font-bold text-lg text-stone-900">
                      {leads.length ? Math.round(leads.reduce((sum, l) => sum + l.score, 0) / leads.length) : 0} / 100
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-mono tracking-wider text-stone-500 font-bold">Core Investors Count</span>
                    <span className="font-serif font-bold text-lg text-[#1E352F]">
                      {leads.filter((l) => l.tag === "Investor" || l.tag === "VC").length} high priority
                    </span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase font-mono tracking-wider text-stone-500 font-bold">Classification</span>
                    <span className="font-serif font-bold text-lg text-stone-900">
                      {Array.from(new Set(leads.map((l) => l.tag))).length} strategic tiers
                    </span>
                  </div>
                </div>

                {/* Lead record collection list */}
                {printLayout === "cards" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...leads]
                      .sort((a, b) => {
                        if (printSortBy === "alphabetical") return a.org.localeCompare(b.org);
                        if (printSortBy === "score") return b.score - a.score;
                        return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
                      })
                      .map((lead, idx) => (
                        <div key={lead.id} className="border border-stone-300 rounded p-4 bg-white print-avoid-break">
                          <div className="flex justify-between items-start border-b border-stone-150 pb-2 mb-2">
                            <div>
                              <span className="font-mono text-[8px] tracking-wider text-stone-400 uppercase">Delegation Entry #{idx + 1}</span>
                              <h3 className="font-serif text-base font-bold text-stone-950 mt-0.5 leading-snug">{lead.name}</h3>
                              <p className="text-[11px] font-medium text-stone-600 font-sans">{lead.role} at {lead.org}</p>
                            </div>
                            <span className="text-[9px] font-mono bg-stone-100 border border-stone-250 px-2 py-0.5 rounded-full font-bold uppercase text-stone-800 whitespace-nowrap">
                              {lead.tag}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-[10.5px] text-stone-700 font-sans animate-fade-in">
                            <div>
                              <span className="block text-[8px] uppercase font-mono tracking-wider text-stone-400 font-bold">Email Interface</span>
                              <span className="font-medium text-stone-900 block truncate" title={lead.email}>{lead.email}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase font-mono tracking-wider text-stone-400 font-bold">Phone contact</span>
                              <span className="font-medium text-stone-900 block truncate">{lead.phone}</span>
                            </div>
                            <div>
                              <span className="block text-[8px] uppercase font-mono tracking-wider text-stone-400 font-bold">Delegation Origin</span>
                              <span className="font-medium text-stone-900 block">{lead.country}</span>
                            </div>
                            {printShowScores && (
                              <div>
                                <span className="block text-[8px] uppercase font-mono tracking-wider text-stone-400 font-bold">Strategic score</span>
                                <span className="font-mono text-stone-950 font-bold">{lead.score} / 100</span>
                              </div>
                            )}
                          </div>

                          {printShowTimes && (
                            <div className="mt-2 text-[8.5px] font-mono text-stone-400 pt-1 border-t border-stone-100">
                              Captured floor by {lead.capturedBy} via {lead.source} at {lead.time}
                            </div>
                          )}

                          {printShowNotes && lead.note && (
                            <div className="mt-2.5 p-2 bg-stone-50 border border-stone-150 rounded text-[10.5px] italic text-stone-700 leading-normal">
                              <strong className="font-mono text-[8px] uppercase tracking-wider text-stone-500 font-bold block not-italic mb-0.5">Field team assessment:</strong>
                              "{lead.note}"
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="border border-stone-300 rounded overflow-hidden bg-white">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-300 text-[8.5px] font-mono uppercase text-stone-500 font-bold">
                          <th className="p-2 border-r border-stone-200 text-center select-none w-10">#</th>
                          <th className="p-2 border-r border-stone-200">Delegate & Company</th>
                          <th className="p-2 border-r border-stone-200">Strategic Role</th>
                          <th className="p-2 border-r border-stone-200">Tag</th>
                          {printShowScores && <th className="p-2 border-r border-stone-200 text-center">Score</th>}
                          {printShowTimes && <th className="p-2 border-r border-stone-200">Capture</th>}
                          <th className="p-2">Field Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200 text-stone-800 font-sans">
                        {[...leads]
                          .sort((a, b) => {
                            if (printSortBy === "alphabetical") return a.org.localeCompare(b.org);
                            if (printSortBy === "score") return b.score - a.score;
                            return new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime();
                          })
                          .map((lead, idx) => (
                            <tr key={lead.id} className="hover:bg-stone-50/50 print-avoid-break">
                              <td className="p-2 border-r border-stone-200 text-center font-mono font-bold text-stone-400">#{idx + 1}</td>
                              <td className="p-2 border-r border-stone-200">
                                <div className="font-serif font-bold text-stone-950 leading-tight">{lead.name}</div>
                                <div className="text-[9.5px] text-stone-500 mt-0.5">{lead.org}</div>
                              </td>
                              <td className="p-2 border-r border-stone-200 font-medium">{lead.role}</td>
                              <td className="p-2 border-r border-stone-200">
                                <span className="px-1.5 py-0.5 bg-stone-50 border border-stone-200 text-[8.5px] font-mono tracking-wider uppercase rounded font-bold text-stone-700">
                                  {lead.tag}
                                </span>
                              </td>
                              {printShowScores && (
                                <td className="p-2 border-r border-stone-200 text-center font-mono font-bold text-stone-900">
                                  {lead.score}
                                </td>
                              )}
                              {printShowTimes && (
                                <td className="p-2 border-r border-stone-200 text-[9px] font-mono text-stone-500 whitespace-nowrap leading-tight">
                                  {lead.time}<br />
                                  <span className="text-[8px] text-stone-400">{lead.source}</span>
                                </td>
                              )}
                              <td className="p-2 text-[10px] italic text-stone-600 leading-snug">
                                {lead.note || <span className="text-stone-300 font-sans not-italic">— No field comments —</span>}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Cover / Footer Co-Branding clearance section at the bottom */}
                <div className="mt-12 pt-8 border-t border-stone-300 grid grid-cols-2 gap-6 text-[10px] text-stone-500 print-avoid-break">
                  <div className="space-y-4 font-sans text-left">
                    <p className="leading-relaxed">
                      <strong>Executive Disclaimer:</strong> Compiled records are archived under NCBA Toronto Protocol. Distributed copies must be shredded post-summit.
                    </p>
                    <div className="flex gap-4 items-center">
                      <div className="font-mono text-[7.5px] uppercase tracking-widest text-stone-400 font-bold border border-stone-200 p-1 bg-stone-50">
                        NBTI-EXPORTS-V3
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 font-sans text-right">
                    <p className="leading-relaxed">
                      <strong>Floor facilitation staff clearance:</strong><br />
                      National Board for Technology Incubation (NBTI)<br />
                      Toronto Centre West, Exhibition Pavilion, Ontario, Canada
                    </p>
                    <div className="pt-2">
                      <div className="inline-block border-b border-dashed border-stone-400 w-36 h-5 mr-3"></div>
                      <span className="font-mono text-[8px] tracking-wider uppercase whitespace-nowrap">Director signature</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Global simulated toast notification */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-3.5 bg-moss-deep text-cream font-mono text-[10.5px] leading-relaxed rounded-lg shadow-2xl border border-gold pulse-glow max-w-[90vw] md:max-w-lg text-center animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
};
