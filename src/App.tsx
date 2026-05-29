import React, { useState, useEffect } from "react";
import { loadLeadsFromStorage, saveLeadsToStorage, loadMeetingsFromStorage, saveMeetingsToStorage, loadExportsFromStorage, saveExportsToStorage } from "./data";
import { Lead, Meeting, ExportHistoryItem } from "./types";
import { NextgenMicrosite } from "./components/NextgenMicrosite";
import { InvestorCapture } from "./components/InvestorCapture";
import { LeadDetailSheet } from "./components/LeadDetailSheet";
import { UserGuide } from "./components/UserGuide";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Sparkles, Building, Phone, Mail, Award, Check, Globe, Briefcase, ArrowUp } from "lucide-react";
import { nbtiLogoBase64, ukaldLogoBase64, nigeriaCoatOfArmsBase64 } from "./LogoAsset";

export default function App() {
  // Navigation states
  const [view, setView] = useState<"microsite" | "workspace" | "guide">("microsite");
  const [currentTab, setCurrentTab] = useState<string>("overview");

  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [exportsList, setExportsList] = useState<ExportHistoryItem[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load initial data and bind scroll listener
  useEffect(() => {
    setLeads(loadLeadsFromStorage());
    setMeetings(loadMeetingsFromStorage());
    setExportsList(loadExportsFromStorage());

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top instantly upon view or tab change to prevent getting stuck in scrolled-down positions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [view, currentTab]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State handlers
  const handleAddLead = (newLead: Lead) => {
    const updated = [newLead, ...leads];
    setLeads(updated);
    saveLeadsToStorage(updated);
    showToast(`Lead captured: ${newLead.name} (${newLead.org})`);
  };

  const handleAddMeeting = (newMeet: Meeting) => {
    const updated = [newMeet, ...meetings];
    setMeetings(updated);
    saveMeetingsToStorage(updated);
    showToast(`Meeting scheduled with ${newMeet.leadName}`);
  };

  const handleAddExport = (newExport: ExportHistoryItem) => {
    const updated = [newExport, ...exportsList];
    setExportsList(updated);
    saveExportsToStorage(updated);
    showToast(`Export generated: ${newExport.fileName}`);
  };

  const handleSelectItem = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDetailOpen(true);
  };

  const handleToggleHotLead = (leadId: string) => {
    const updatedLeads = leads.map((lead) => {
      if (lead.id === leadId) {
        // Toggle score between high priority priority and moderate
        const isHot = lead.score >= 90;
        const newScore = isHot ? 75 : 95;
        return { ...lead, score: newScore };
      }
      return lead;
    });

    setLeads(updatedLeads);
    saveLeadsToStorage(updatedLeads);

    const found = updatedLeads.find((l) => l.id === leadId);
    if (found) {
      setSelectedLead(found);
      showToast(`Updated ecosystem fit priority for ${found.name} (Score: ${found.score})`);
    }
  };

  const handleUpdateLeadNotes = (leadId: string, notes: string) => {
    const updated = leads.map((l) => {
      if (l.id === leadId) {
        return { ...l, note: notes };
      }
      return l;
    });
    setLeads(updated);
    saveLeadsToStorage(updated);
    
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, note: notes });
    }
  };

  const handleDeleteLead = (leadId: string) => {
    const updatedLeads = leads.filter((l) => l.id !== leadId);
    setLeads(updatedLeads);
    saveLeadsToStorage(updatedLeads);

    const updatedMeetings = meetings.filter((m) => m.leadId !== leadId);
    setMeetings(updatedMeetings);
    saveMeetingsToStorage(updatedMeetings);

    setIsDetailOpen(false);
    setSelectedLead(null);
    showToast(`Record successfully deleted from the registry.`);
  };

  const handleSendFollowUp = (lead: Lead) => {
    const updated = leads.map((l) => {
      if (l.id === lead.id) {
        return { ...l, followUpSent: true };
      }
      return l;
    });
    setLeads(updated);
    saveLeadsToStorage(updated);
    
    if (selectedLead && selectedLead.id === lead.id) {
      setSelectedLead({ ...selectedLead, followUpSent: true });
    }
    
    showToast(`Dispatched parameters for ${lead.name} to topeomojayogbe@ukald.com.`);
  };

  const handleScheduleMeeting = (lead: Lead) => {
    const exists = meetings.find((m) => m.leadId === lead.id);
    if (exists) {
      showToast(`Calendar slot is already booked with ${lead.name} today at ${exists.time}.`);
    } else {
      const newMeet: Meeting = {
        id: `meet-${Date.now()}`,
        leadId: lead.id,
        leadName: lead.name,
        orgName: lead.org,
        time: "10:45",
        period: "EDT",
        duration: "30 min",
        purpose: "Bilateral Strategy alignment session",
        location: "Lead Office Booth, Room A",
        isVirtual: false,
        dateStr: "Today · Fri 29 May"
      };
      const updated = [newMeet, ...meetings];
      setMeetings(updated);
      saveMeetingsToStorage(updated);
      showToast(`Successfully scheduled delegation meeting with ${lead.name} at 10:45 EDT.`);
    }

    setIsDetailOpen(false);
    setView("workspace");
    setCurrentTab("meetings");
  };

  const handleExportVCard = (lead: Lead) => {
    const vcardText = `BEGIN:VCARD
VERSION:3.0
FN:${lead.name}
ORG:${lead.org}
TITLE:${lead.role}
EMAIL;TYPE=PREF,INTERNET:${lead.email}
TEL;TYPE=CELL,VOICE:${lead.phone}
NOTE:Ecosystem fit score: ${lead.score}. Details: ${lead.note}
END:VCARD`;

    const blob = new Blob([vcardText], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${lead.name.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // save to export list
    const newExport: ExportHistoryItem = {
      id: `export-${Date.now()}`,
      fileName: `${lead.name.replace(/\s+/g, "_")}.vcf`,
      fileType: "vCard",
      dateStr: "Just now",
      recordCount: 1,
    };
    const updatedExports = [newExport, ...exportsList];
    setExportsList(updatedExports);
    saveExportsToStorage(updatedExports);
    showToast(`vCard downloaded for ${lead.name}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-amber-500/30 selection:text-amber-300">
      {/* Background Decorative Ambient Flares */}
      <div className="vibrant-glow-blob absolute top-[-100px] right-[-100px] w-96 h-96 bg-amber-500/10 rounded-full blur-[140px]" />
      <div className="vibrant-glow-blob absolute bottom-[-100px] left-[-100px] w-80 h-80 bg-rose-600/10 rounded-full blur-[120px]" />
      <div className="vibrant-glow-blob absolute top-[40vh] left-[50vw] -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-[130px]" />

      {/* Header Sticky Navigation Panel */}
      <header className="border-b border-white/5 py-4 md:py-6 px-6 md:px-12 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-10 bg-slate-950/85 backdrop-blur-md sticky top-0 shadow-xl shadow-slate-950/20">
        <div className="flex items-center gap-3">
          <img
            src={nbtiLogoBase64}
            alt="NBTI Logo"
            className="w-11 h-11 object-contain transition-all duration-350 hover:scale-105 bg-white p-0.5 rounded-full border border-mist shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div className="text-left">
            <span className="text-xl font-serif font-black tracking-tight text-slate-200 block">
              NBTI <span className="text-amber-500 font-mono font-medium text-lg">Connect</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-500 uppercase block">
              CAIF TORONTO · 2026
            </span>
          </div>
        </div>

        {/* Global Level 1 Routing */}
        <div className="flex flex-wrap justify-center items-center gap-1.5 md:gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <button
            onClick={() => setView("microsite")}
            className={`px-3.5 py-2.5 rounded-full transition-all text-[10px] md:text-xs cursor-pointer ${
              view === "microsite"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/25 shadow-md shadow-amber-500/5"
                : "hover:text-slate-100 bg-white/5 hover:bg-white/10"
            }`}
          >
            <Globe className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" /> Landing Microsite
          </button>
          <button
            onClick={() => {
              setView("workspace");
              setCurrentTab("overview");
            }}
            className={`px-3.5 py-2.5 rounded-full transition-all text-[10px] md:text-xs cursor-pointer ${
              view === "workspace"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/25 shadow-md shadow-amber-500/5"
                : "hover:text-slate-100 bg-white/5 hover:bg-white/10"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" /> Staff Console
          </button>
          <button
            onClick={() => setView("guide")}
            className={`px-3.5 py-2.5 rounded-full transition-all text-[10px] md:text-xs cursor-pointer ${
              view === "guide"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/25 shadow-md shadow-amber-500/5"
                : "hover:text-slate-100 bg-white/5 hover:bg-white/10"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5" /> Operations Guide
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 md:px-12 py-8 relative z-10 flex flex-col justify-stretch">
        <AnimatePresence mode="wait">
          {view === "microsite" && (
            <motion.div
              key="microsite-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <NextgenMicrosite
                onAddLead={handleAddLead}
                onGoToWorkspace={() => {
                  setView("workspace");
                  setCurrentTab("overview");
                }}
              />
            </motion.div>
          )}

          {view === "workspace" && (
            <motion.div
              key="workspace-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <InvestorCapture
                leads={leads}
                meetings={meetings}
                exportsList={exportsList}
                currentTab={currentTab}
                onTabChange={(tab) => setCurrentTab(tab)}
                onAddLead={handleAddLead}
                onAddMeeting={handleAddMeeting}
                onAddExport={handleAddExport}
                onSelectItem={handleSelectItem}
              />
            </motion.div>
          )}

          {view === "guide" && (
            <motion.div
              key="guide-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="max-w-3xl mx-auto w-full"
            >
              <UserGuide />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating sliding detail sheet */}
      <LeadDetailSheet
        lead={selectedLead}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onSendFollowUp={handleSendFollowUp}
        onScheduleMeeting={handleScheduleMeeting}
        onToggleHotLead={handleToggleHotLead}
        onExportVCard={handleExportVCard}
        onUpdateNotes={handleUpdateLeadNotes}
        onDeleteLead={handleDeleteLead}
      />

      {/* Back to top floating button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-24 right-8 z-[90] p-3 bg-cream shadow-lg border border-mist rounded-full text-moss hover:bg-moss hover:text-white transition-all duration-300 group cursor-pointer"
            aria-label="Back to top"
          >
            <ArrowUp className="w-4 h-4 transition-transform group-hover:-translate-y-1" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Toasts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] px-4 py-3 bg-slate-200 border border-mist rounded-xl text-xs font-mono font-medium text-moss shadow-2xl flex items-center gap-3 backdrop-blur-lg"
          >
            <Sparkles className="w-4 h-4 text-moss" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Element */}
      <footer className="w-full border-t border-white/5 py-10 px-6 md:px-12 mt-12 bg-slate-950/80 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2 items-center md:items-start text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
              <span>May 29 — 30, 2026</span>
              <span>·</span>
              <span>Toronto · Ontario · Canada</span>
              <span>·</span>
              <span>Delegation Lead Capture Desk</span>
            </div>
            <div className="flex gap-4 mt-1 justify-center md:justify-start">
              <span className="text-slate-300 hover:text-amber-500 transition-colors">NBTI Canada</span>
              <span>·</span>
              <span className="text-slate-300 hover:text-amber-500 transition-colors">FIST Nigeria</span>
            </div>
          </div>

          {/* Strategic Partners Logos */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block font-mono text-[8px] tracking-widest uppercase text-slate-500">
              <span className="block font-bold">In Collaboration With</span>
              <span className="block text-amber-500/80 mt-0.5">Strategic Co-Investment Partners</span>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-2 px-3.5 rounded-xl border border-white/5 backdrop-blur-xs shadow-inner">
              <img
                src={ukaldLogoBase64}
                alt="UKALD Logo"
                className="h-9 w-auto object-contain select-none opacity-80 hover:opacity-100 transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="w-px h-6 bg-white/10" />
              <img
                src={nigeriaCoatOfArmsBase64}
                alt="Nigeria Coat Of Arms"
                className="h-9 w-auto object-contain select-none opacity-85 hover:opacity-100 transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
