import React, { useState, useEffect, useRef } from "react";
import { Lead } from "../types";
import { Mail, Phone, Building, Flag, Clock, User, Clipboard, Check, Calendar, Flame, CloudDownload, X, PhoneCall, Loader2, Trash2 } from "lucide-react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface LeadDetailSheetProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onSendFollowUp: (lead: Lead) => void;
  onScheduleMeeting: (lead: Lead) => void;
  onToggleHotLead: (leadId: string) => void;
  onExportVCard: (lead: Lead) => void;
  onUpdateNotes: (leadId: string, notes: string) => void;
  onDeleteLead: (leadId: string) => void;
}

const getEcosystemData = (lead: Lead) => {
  // Base category mappings suited to their role tags to maintain high integrity
  let tech = 60;
  let finance = 50;
  let policy = 40;
  let integration = 55;
  let strategy = 50;

  if (lead.tag === "Investor" || lead.tag === "VC") {
    finance = 92;
    strategy = 84;
    tech = 65;
    policy = 48;
    integration = 58;
  } else if (lead.tag === "Corporate") {
    tech = 88;
    finance = 70;
    strategy = 78;
    policy = 52;
    integration = 84;
  } else if (lead.tag === "Government" || lead.tag === "DFI") {
    policy = 94;
    finance = 76;
    tech = 54;
    integration = 81;
    strategy = 72;
  } else if (lead.tag === "Partner") {
    integration = 90;
    tech = 82;
    strategy = 74;
    finance = 58;
    policy = 62;
  }

  // Derive stable modifiers based on character codes of the lead's name to give stable, unique fingerprints
  const nameHash = lead.name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  tech = Math.max(30, Math.min(100, tech + (nameHash % 17) - 8));
  finance = Math.max(30, Math.min(100, finance + ((nameHash >> 1) % 15) - 7));
  policy = Math.max(30, Math.min(100, policy + ((nameHash >> 2) % 19) - 9));
  integration = Math.max(30, Math.min(100, integration + ((nameHash >> 3) % 13) - 6));
  strategy = Math.max(30, Math.min(100, strategy + ((nameHash >> 4) % 21) - 10));

  // Scale data slightly to align with the main Ecosystem Fit score
  const scale = lead.score / 85; 
  const scaleValue = (val: number) => Math.max(25, Math.min(100, Math.round(val * scale)));

  return [
    { subject: "Technology", score: scaleValue(tech) },
    { subject: "Finance & Capital", score: scaleValue(finance) },
    { subject: "Policy & Regs", score: scaleValue(policy) },
    { subject: "Ecosystem Integration", score: scaleValue(integration) },
    { subject: "Market Strategy", score: scaleValue(strategy) },
  ];
};

export const LeadDetailSheet: React.FC<LeadDetailSheetProps> = ({
  lead,
  isOpen,
  onClose,
  onSendFollowUp,
  onScheduleMeeting,
  onToggleHotLead,
  onExportVCard,
  onUpdateNotes,
  onDeleteLead,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [notesText, setNotesText] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const saveTimeoutRef = useRef<any>(null);
  const lastLeadIdRef = useRef<string | null>(null);
  const lastNotesTextRef = useRef<string>("");

  // Update a ref so we always have the fresh text in effect cleanups
  useEffect(() => {
    lastNotesTextRef.current = notesText;
  }, [notesText]);

  // Keep the notesText and lead.id in sync when the sheet is opened or a different lead is selected
  useEffect(() => {
    if (lead) {
      // If we are switching from another lead, check if we need to flush its save first
      if (lastLeadIdRef.current && lastLeadIdRef.current !== lead.id && saveStatus === "saving") {
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        onUpdateNotes(lastLeadIdRef.current, lastNotesTextRef.current);
      }
      
      setNotesText(lead.note || "");
      setSaveStatus("idle");
      setConfirmDelete(false);
      lastLeadIdRef.current = lead.id;
    }
  }, [lead?.id]);

  // Flush save when the modal becomes closed
  useEffect(() => {
    if (!isOpen && saveStatus === "saving" && lead) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      onUpdateNotes(lead.id, lastNotesTextRef.current);
      setSaveStatus("idle");
    }
    if (!isOpen) {
      setConfirmDelete(false);
    }
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotesText(val);
    setSaveStatus("saving");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      if (lead) {
        onUpdateNotes(lead.id, val);
        setSaveStatus("saved");
      }
    }, 600); // 600ms auto-save debounce
  };

  if (!lead) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-laurel";
    if (score >= 75) return "text-gold";
    return "text-taupe";
  };

  const getStrokeDashOffset = (score: number) => {
    const circumference = 2 * Math.PI * 22; // radius is 22
    return circumference - (score / 100) * circumference;
  };

  return (
    <>
      {/* Sheet Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-moss/45 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-Up Bottom Sheet */}
      <div
        className={`fixed left-0 right-0 bottom-0 z-50 flex flex-col max-h-[90vh] bg-cream rounded-t-2xl shadow-2xl transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-lead-name"
      >
        {/* Grabber */}
        <div className="w-10 h-1 bg-mist/60 rounded-full mx-auto my-3" />

        {/* Content Container (Scrollable) */}
        <div className="overflow-y-auto px-6 pb-12 max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-line pb-4 mb-5 pt-2">
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-14 h-14 rounded-full bg-moss text-gold-light flex items-center justify-center font-serif italic font-medium text-2xl relative shadow-md">
                {lead.initials}
                <div className="absolute inset-0.5 rounded-full border border-dashed border-gold-soft/32" />
              </div>
              <div className="min-w-0">
                <h3 id="sheet-lead-name" className="font-serif font-semibold text-2xl leading-none text-ink tracking-tight truncate">
                  {lead.name}
                </h3>
                <p className="text-sm text-taupe mt-1 truncate">
                  <strong className="text-ink font-medium">{lead.org}</strong> — {lead.role || "Ecosystem Partner"}
                </p>
                <div className="inline-flex items-center gap-1.5 mt-2 bg-gold-light/10 text-gold text-[10px] font-mono tracking-widest uppercase py-1 px-2.5 rounded-full border border-gold-soft/24">
                  {lead.tag} {lead.score >= 90 ? "· High Priority" : ""}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-ink hover:bg-ivory transition-colors"
              aria-label="Close details"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Score Section */}
            <div className="border-b border-line-soft pb-5">
              <h4 className="font-mono text-[9px] tracking-widest uppercase text-gold-soft mb-3 flex items-center gap-2">
                Ecosystem Fit Score <span className="flex-1 h-px bg-line-soft" />
              </h4>
              <div className="flex items-center gap-4 py-3 px-4 bg-ivory border border-line rounded-md mb-4">
                {/* Custom SVG Ring for Lead Score */}
                <div className="w-14 h-14 relative flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 56 56">
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="rgba(184, 144, 82, 0.12)"
                      strokeWidth="4"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="#B89052"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 22}
                      strokeDashoffset={getStrokeDashOffset(lead.score)}
                      transform="rotate(-90 28 28)"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-serif font-medium text-lg text-ink">
                    {lead.score}
                  </div>
                </div>
                <div>
                  <h5 className={`font-mono text-xs tracking-widest uppercase font-semibold ${getScoreColor(lead.score)}`}>
                    {lead.score >= 90 ? "Strategic Investment Prospect" : lead.score >= 75 ? "Ecosystem Expansion Match" : "Active Interest Area"}
                  </h5>
                  <p className="text-xs text-taupe mt-1 leading-snug">
                    Score generated based on organizational match, geographic interest, and active venture-alignment intent on the festival floor.
                  </p>
                </div>
              </div>

              {/* Dynamic Radar Chart Visualizer */}
              <div className="p-4 bg-cream/45 border border-line rounded-lg">
                <div className="flex justify-between items-baseline mb-2">
                  <h5 className="font-mono text-[9px] tracking-wider uppercase text-gold-soft font-semibold">
                    Multi-Dimensional Sector Fit
                  </h5>
                  <span className="font-mono text-[8px] text-taupe-light uppercase">
                    Interactive Mapping
                  </span>
                </div>
                
                <div className="w-full h-52 flex items-center justify-center relative overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="72%" data={getEcosystemData(lead)}>
                      <PolarGrid stroke="#E4E1D7" opacity={0.6} />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: "#546A5B", fontSize: 9, fontWeight: 500, fontFamily: "monospace" }}
                      />
                      <PolarRadiusAxis 
                        angle={30} 
                        domain={[0, 100]} 
                        tick={false}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Radar
                        name="Ecosystem Fit"
                        dataKey="score"
                        stroke="#B89052"
                        fill="#B89052"
                        fillOpacity={0.25}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Subcategory Percentages Grid */}
                <div className="grid grid-cols-5 gap-1.5 mt-2">
                  {getEcosystemData(lead).map((item) => (
                    <div key={item.subject} className="bg-white/75 border border-line-soft/40 rounded py-1 px-0.5 text-center shadow-xs">
                      <p className="text-[7.5px] font-mono text-taupe-light uppercase tracking-tight block truncate" title={item.subject}>
                        {item.subject === "Ecosystem Integration" ? "Eco Fit" : item.subject === "Finance & Capital" ? "Capital" : item.subject === "Policy & Regs" ? "Policy" : item.subject === "Market Strategy" ? "Strategy" : "Tech"}
                      </p>
                      <p className="font-mono font-bold text-[11px] text-ink mt-0.5">
                        {item.score}%
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="border-b border-line-soft pb-5">
              <h4 className="font-mono text-[9px] tracking-widest uppercase text-gold-soft mb-3 flex items-center gap-2">
                Primary Coordinates <span className="flex-1 h-px bg-line-soft" />
              </h4>
              <div className="space-y-2.5">
                {/* Email Row */}
                <div className="grid grid-cols-[100px_1fr_auto] gap-2 items-center text-sm">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-taupe-light flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-taupe-light" /> Email
                  </span>
                  <span className="font-mono text-xs text-ink truncate select-all">{lead.email}</span>
                  <button
                    onClick={() => copyToClipboard(lead.email, "email")}
                    className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-taupe hover:text-moss hover:border-moss transition-colors"
                    title="Copy email address"
                  >
                    {copiedField === "email" ? <Check className="w-3.5 h-3.5 text-laurel" /> : <Clipboard className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Phone Row */}
                <div className="grid grid-cols-[100px_1fr_auto] gap-2 items-center text-sm">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-taupe-light flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-taupe-light" /> Phone
                  </span>
                  <span className="font-mono text-xs text-ink truncate select-all">{lead.phone}</span>
                  <button
                    onClick={() => copyToClipboard(lead.phone, "phone")}
                    className="w-7 h-7 rounded-full border border-line flex items-center justify-center text-taupe hover:text-moss hover:border-moss transition-colors"
                    title="Copy phone number"
                  >
                    {copiedField === "phone" ? <Check className="w-3.5 h-3.5 text-laurel" /> : <Clipboard className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Org Row */}
                <div className="grid grid-cols-[100px_1fr_auto] gap-2 items-center text-sm">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-taupe-light flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-taupe-light" /> Org
                  </span>
                  <span className="font-medium text-ink truncate">{lead.org}</span>
                  <span className="w-7 h-7" />
                </div>

                {/* Country Row */}
                <div className="grid grid-cols-[100px_1fr_auto] gap-2 items-center text-sm">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-taupe-light flex items-center gap-1.5">
                    <Flag className="w-3 h-3 text-taupe-light" /> Country
                  </span>
                  <span className="font-medium text-ink truncate">{lead.country}</span>
                  <span className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Context Details */}
            <div className="border-b border-line-soft pb-5">
              <h4 className="font-mono text-[9px] tracking-widest uppercase text-gold-soft mb-3 flex items-center gap-2">
                Capture Context <span className="flex-1 h-px bg-line-soft" />
              </h4>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-line-soft">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-taupe-light flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> Time
                  </span>
                  <span className="font-medium text-ink">Today · {lead.time} EDT</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line-soft">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-taupe-light">Source</span>
                  <span className="font-medium text-ink">{lead.source}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line-soft">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-taupe-light flex items-center gap-1">
                    <User className="w-2.5 h-2.5" /> Captured By
                  </span>
                  <span className="font-medium text-ink">{lead.capturedBy}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-line-soft">
                  <span className="font-mono text-[9px] tracking-wider uppercase text-taupe-light">Token</span>
                  <span className="font-mono text-ink text-[10px] uppercase font-semibold">{lead.token}</span>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="border-b border-line-soft pb-5">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-mono text-[9px] tracking-widest uppercase text-gold-soft flex items-center gap-2 m-0">
                  Staff Field Notes <span className="w-1.5 h-1.5 rounded-full bg-gold-soft/30 animate-pulse" />
                </h4>
                
                {/* Save Status Badge */}
                <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider">
                  {saveStatus === "saving" && (
                    <span className="text-gold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin text-gold" />
                      Syncing notes...
                    </span>
                  )}
                  {saveStatus === "saved" && (
                    <span className="text-laurel flex items-center gap-1 font-bold">
                      <Check className="w-3 h-3 text-laurel" />
                      Auto-saved
                    </span>
                  )}
                  {saveStatus === "idle" && (
                    <span className="text-taupe-light">
                      Saved to disk
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative group/notes text-left">
                <textarea
                  value={notesText}
                  onChange={handleNotesChange}
                  placeholder="Record strategic floor directives, follow-up parameters, or investment goals here..."
                  className="w-full h-32 bg-ivory border border-line rounded-lg p-3.5 focus:border-moss focus:ring-1 focus:ring-moss/20 focus:outline-none font-serif italic text-ink-soft text-base leading-relaxed resize-none transition-all placeholder:text-taupe-light/50"
                  id="lead-notes-area"
                />
                <div className="absolute right-3.5 bottom-3 text-[9px] font-mono uppercase tracking-wider text-taupe-light opacity-0 group-focus-within/notes:opacity-100 transition-opacity pointer-events-none select-none">
                  Editable field · Saves instantly
                </div>
              </div>
            </div>

            {/* Actions */}
            <div>
              <h4 className="font-mono text-[9px] tracking-widest uppercase text-gold-soft mb-4 flex items-center gap-2">
                Workspace Commands <span className="flex-1 h-px bg-line-soft" />
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onSendFollowUp(lead)}
                  className={`col-span-2 flex flex-col items-center justify-center py-4 rounded shadow-sm transition-all relative overflow-hidden ${
                    lead.followUpSent 
                      ? "bg-[#edf4f0] text-moss border border-moss/20 hover:bg-[#e4ede8]" 
                      : "bg-moss text-cream border border-moss hover:bg-moss-deep"
                  }`}
                >
                  <div className="absolute inset-px border border-dashed border-gold-light/20 pointer-events-none" />
                  {lead.followUpSent ? (
                    <Check className="w-5 h-5 text-moss mb-1.5" />
                  ) : (
                    <Mail className="w-5 h-5 text-gold-light mb-1.5" />
                  )}
                  <span className="font-sans font-medium text-sm">
                    {lead.followUpSent ? "Follow-Up Dispatched Successfully" : "Send Official Follow-up"}
                  </span>
                  <span className="font-mono text-[8.5px] tracking-wider uppercase mt-1 text-moss/70">
                    {lead.followUpSent ? "Parameters Sent to Facilitator" : "Routes to Facilitator"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onScheduleMeeting(lead)}
                  className="flex flex-col items-start p-3 bg-ivory border border-line rounded hover:border-moss hover:bg-cream transition-all group"
                >
                  <div className="w-8 h-8 rounded-full border border-gold bg-gold/10 flex items-center justify-center text-gold mb-2.5 transition-colors group-hover:bg-moss group-hover:text-cream group-hover:border-moss">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="font-sans font-medium text-xs text-ink leading-tight">Calendar</span>
                  <span className="font-mono text-[8.5px] text-taupe-light tracking-wide uppercase mt-1">Set Meeting</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleHotLead(lead.id)}
                  className="flex flex-col items-start p-3 bg-ivory border border-line rounded hover:border-moss hover:bg-cream transition-all group"
                >
                  <div className="w-8 h-8 rounded-full border border-gold bg-gold/10 flex items-center justify-center text-gold mb-2.5 transition-colors group-hover:bg-moss group-hover:text-cream group-hover:border-moss">
                    <Flame className="w-4 h-4" />
                  </div>
                  <span className="font-sans font-medium text-xs text-ink leading-tight">Hot Prospect</span>
                  <span className="font-mono text-[8.5px] text-taupe-light tracking-wide uppercase mt-1">Toggle Score</span>
                </button>

                <button
                  type="button"
                  onClick={() => onExportVCard(lead)}
                  className="flex flex-col items-start p-3 bg-ivory border border-line rounded hover:border-moss hover:bg-cream transition-all group"
                >
                  <div className="w-8 h-8 rounded-full border border-gold bg-gold/10 flex items-center justify-center text-gold mb-2.5 transition-colors group-hover:bg-moss group-hover:text-cream group-hover:border-moss">
                    <CloudDownload className="w-4 h-4" />
                  </div>
                  <span className="font-sans font-medium text-xs text-ink leading-tight">vCard Card</span>
                  <span className="font-mono text-[8.5px] text-taupe-light tracking-wide uppercase mt-1">Export Contact</span>
                </button>

                <a
                  href={`tel:${lead.phone}`}
                  className="flex flex-col items-start p-3 bg-ivory border border-line rounded hover:border-moss hover:bg-cream transition-all group decoration-none"
                >
                  <div className="w-8 h-8 rounded-full border border-gold bg-gold/10 flex items-center justify-center text-gold mb-2.5 transition-colors group-hover:bg-moss group-hover:text-cream group-hover:border-moss">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span className="font-sans font-medium text-xs text-ink leading-tight">Call Mobile</span>
                  <span className="font-mono text-[8.5px] text-taupe-light tracking-wide uppercase mt-1">Immediate Line</span>
                </a>
              </div>
            </div>

            {/* Live Deletion & Mistake Correction Zone */}
            <div className="pt-6 border-t border-line-soft">
              {confirmDelete ? (
                <div className="bg-red-50/50 border border-red-200/60 rounded-lg p-3.5 text-center">
                  <p className="font-sans font-semibold text-xs text-red-700 mb-1">
                    Are you sure you want to delete {lead.name}? 
                  </p>
                  <p className="text-[11px] text-taupe-light mb-3">
                    This action is permanent and will clean up their registration data & meeting slots.
                  </p>
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteLead(lead.id);
                        setConfirmDelete(false);
                      }}
                      className="flex-1 max-w-[170px] py-2 bg-red-600 hover:bg-red-700 text-white border border-red-700 rounded text-[11px] uppercase font-mono tracking-wider font-bold transition-all shadow-md cursor-pointer"
                    >
                      Permanently Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-4 py-2 bg-white hover:bg-ivory border border-line text-taupe-light rounded text-[11px] font-medium transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="w-full py-3 bg-cream hover:bg-red-50/45 text-red-600 border border-dashed border-red-200 hover:border-red-300 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                  Delete delegation record
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
