import { Lead, Meeting, ExportHistoryItem } from "./types";

export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-0",
    initials: "AN",
    name: "Adaeze Nwosu",
    phone: "+1 416 555 0142",
    email: "a.nwosu@horizon-vc.com",
    org: "Horizon Ventures",
    role: "Investment Analyst",
    country: "Canada",
    tag: "Investor",
    tone: "gold",
    time: "17:04",
    score: 92,
    source: "QR Scan",
    capturedBy: "Amaka Obi",
    token: "NXT-508129",
    timestamp: "2026-05-27T10:00:15Z",
    note: "Strong fit for fintech track. Interested in pre-seed exposure to Lagos cohort."
  },
  {
    id: "lead-1",
    initials: "MB",
    name: "Marcus Beaumont",
    phone: "+44 207 555 0188",
    email: "mbeaumont@quanta.fund",
    org: "Quanta Capital",
    role: "Managing Director",
    country: "United Kingdom",
    tag: "VC",
    tone: "gold",
    time: "16:58",
    score: 88,
    source: "QR Scan",
    capturedBy: "Tunde Yusuf",
    token: "NXT-488219",
    timestamp: "2026-05-27T09:58:00Z",
    note: "Series A focus. Following up on Quanta's African mandate and potential Hub integrations."
  },
  {
    id: "lead-2",
    initials: "OA",
    name: "Olufemi Adekunle",
    phone: "+234 803 555 9921",
    email: "femi@adekunle-group.ng",
    org: "Adekunle Group",
    role: "Chief Strategy Officer",
    country: "Nigeria",
    tag: "Corporate",
    tone: "moss",
    time: "16:51",
    score: 74,
    source: "Business Card",
    capturedBy: "Amaka Obi",
    token: "NXT-199201",
    timestamp: "2026-05-27T09:51:00Z",
    note: "Wants to discuss agribusiness incubation co-investment and tech transfer pipelines."
  },
  {
    id: "lead-3",
    initials: "PS",
    name: "Priya Subramaniam",
    phone: "+1 647 555 0033",
    email: "priya@meridian-dfi.org",
    org: "Meridian DFI",
    role: "Senior Director",
    country: "Canada",
    tag: "DFI",
    tone: "laurel",
    time: "16:42",
    score: 81,
    source: "Manual",
    capturedBy: "Amaka Obi",
    token: "NXT-288301",
    timestamp: "2026-05-27T09:42:00Z",
    note: "Meridian opening a sub-Saharan window in Q3. Requested infrastructure co-invest project list."
  },
  {
    id: "lead-4",
    initials: "LH",
    name: "Lars Holmberg",
    phone: "+46 8 555 0411",
    email: "lars.h@nordic-tech.se",
    org: "Nordic Tech",
    role: "Global Expansions VP",
    country: "Sweden",
    tag: "Corporate",
    tone: "moss",
    time: "16:34",
    score: 66,
    source: "QR Scan",
    capturedBy: "Tunde Yusuf",
    token: "NXT-399212",
    timestamp: "2026-05-27T09:34:00Z",
    note: "Greentech focus. Considering a Lagos R&D outpost with potential technical internship paths."
  },
  {
    id: "lead-5",
    initials: "FA",
    name: "Funmi Adeleke",
    phone: "+1 416 555 7720",
    email: "funmi@blueforest.vc",
    org: "Blue Forest VC",
    role: "General Partner",
    country: "Canada",
    tag: "Investor",
    tone: "gold",
    time: "16:26",
    score: 95,
    source: "QR Scan",
    capturedBy: "Amaka Obi",
    token: "NXT-908122",
    timestamp: "2026-05-27T09:26:00Z",
    note: "HOT LEAD. Looking to commit C$5–8M into high-yield NBTI cohorts within 60 days."
  },
  {
    id: "lead-6",
    initials: "DK",
    name: "David Kimani",
    phone: "+254 722 555 304",
    email: "d.kimani@savannah-cap.ke",
    org: "Savannah Capital",
    role: "Regional Partner",
    country: "Kenya",
    tag: "Investor",
    tone: "gold",
    time: "16:18",
    score: 79,
    source: "QR Scan",
    capturedBy: "Amaka Obi",
    token: "NXT-200388",
    timestamp: "2026-05-27T09:18:00Z",
    note: "Nairobi-based team. Bringing Pan-African expansion expertise to the NBTI portfolio."
  },
  {
    id: "lead-7",
    initials: "SW",
    name: "Sarah Whitlock",
    phone: "+1 613 555 0901",
    email: "swhitlock@trade.gov.ca",
    org: "Global Affairs CA",
    role: "Trade Commissioner",
    country: "Canada",
    tag: "Government",
    tone: "laurel",
    time: "16:09",
    score: 70,
    source: "Manual",
    capturedBy: "Amaka Obi",
    token: "NXT-708191",
    timestamp: "2026-05-27T09:09:00Z",
    note: "Trade Commissioner. Excellent contact. Will introduce to Canadian export desks."
  },
  {
    id: "lead-8",
    initials: "TB",
    name: "Tunde Bakare",
    phone: "+234 802 555 1144",
    email: "t.bakare@lagos-incubator.ng",
    org: "Lagos Incubator",
    role: "Cohort Lead",
    country: "Nigeria",
    tag: "Partner",
    tone: "clay",
    time: "15:58",
    score: 64,
    source: "Business Card",
    capturedBy: "Tunde Yusuf",
    token: "NXT-100299",
    timestamp: "2026-05-27T08:58:00Z",
    note: "Wants to align Lagos cohort onboarding frameworks with NBTI standardized programs."
  },
  {
    id: "lead-9",
    initials: "AR",
    name: "Anika Rao",
    phone: "+1 905 555 0277",
    email: "anika@ascent.partners",
    org: "Ascent Partners",
    role: "Investment Director",
    country: "Canada",
    tag: "VC",
    tone: "gold",
    time: "15:50",
    score: 73,
    source: "QR Scan",
    capturedBy: "Amaka Obi",
    token: "NXT-200199",
    timestamp: "2026-05-27T08:50:00Z",
    note: "Mid-stage VC, Deep tech track focused. Looking to understand Nigeria landing regulations."
  },
  {
    id: "lead-10",
    initials: "JM",
    name: "James Mwangi",
    phone: "+254 712 555 902",
    email: "j.mwangi@equity-impact.ke",
    org: "Equity Impact",
    role: "Director of Impact",
    country: "Kenya",
    tag: "Investor",
    tone: "gold",
    time: "15:38",
    score: 77,
    source: "QR Scan",
    capturedBy: "Amaka Obi",
    token: "NXT-281928",
    timestamp: "2026-05-27T08:38:00Z",
    note: "Impact-investing lens. Focuses on climate-resilient farming and clean infrastructure."
  },
  {
    id: "lead-11",
    initials: "CL",
    name: "Camille Laurent",
    phone: "+33 1 5555 0288",
    email: "c.laurent@paris-vc.fr",
    org: "Paris VC",
    role: "Senior Associate",
    country: "France",
    tag: "VC",
    tone: "gold",
    time: "15:21",
    score: 69,
    source: "QR Scan",
    capturedBy: "Tunde Yusuf",
    token: "NXT-400918",
    timestamp: "2026-05-27T08:21:00Z",
    note: "French fund focused on Francophone West African portfolio startups."
  },
  {
    id: "lead-12",
    initials: "KP",
    name: "Kemi Phillips",
    phone: "+1 905 555 0144",
    email: "kemi@phillips-ag.ca",
    org: "Phillips Agri Group",
    role: "Strategy VP",
    country: "Canada",
    tag: "Corporate",
    tone: "moss",
    time: "15:04",
    score: 60,
    source: "Business Card",
    capturedBy: "Amaka Obi",
    token: "NXT-399120",
    timestamp: "2026-05-27T08:04:00Z",
    note: "Wants to sponsor specialized agritech acceleration cohorts in Abuja."
  },
  {
    id: "lead-13",
    initials: "NO",
    name: "Ngozi Okoro",
    phone: "+234 805 555 7711",
    email: "n.okoro@ng-edu-found.org",
    org: "Edu Foundation Nigeria",
    role: "Trustee Member",
    country: "Nigeria",
    tag: "DFI",
    tone: "laurel",
    time: "14:48",
    score: 71,
    source: "Manual",
    capturedBy: "Amaka Obi",
    token: "NXT-500293",
    timestamp: "2026-05-27T07:48:00Z",
    note: "Grants focal point interested in backing educational hardware and EdTech acceleration."
  },
  {
    id: "lead-14",
    initials: "RS",
    name: "Ravi Shah",
    phone: "+1 416 555 0190",
    email: "r.shah@northstar-ca.com",
    org: "Northstar Capital",
    role: "Investment Lead",
    country: "Canada",
    tag: "Investor",
    tone: "gold",
    time: "14:31",
    score: 82,
    source: "QR Scan",
    capturedBy: "Amaka Obi",
    token: "NXT-399201",
    timestamp: "2026-05-27T07:31:00Z",
    note: "Late-stage growth investor. Interested in regional tech champions seeking secondary capital."
  }
];

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "meet-1",
    leadId: "lead-0",
    leadName: "Adaeze Nwosu",
    orgName: "Horizon Ventures",
    time: "17:30",
    period: "EDT",
    duration: "30 min",
    purpose: "Investor brief",
    location: "Pavilion · Booth E14",
    isVirtual: false,
    dateStr: "Today · Fri 29 May"
  },
  {
    id: "meet-2",
    leadId: "lead-1",
    leadName: "Marcus Beaumont",
    orgName: "Quanta Capital",
    time: "18:15",
    period: "EDT",
    duration: "45 min",
    purpose: "Term-sheet review",
    location: "Virtual Meeting link inside",
    isVirtual: true,
    dateStr: "Today · Fri 29 May"
  },
  {
    id: "meet-3",
    leadId: "lead-3",
    leadName: "Priya Subramaniam",
    orgName: "Meridian DFI",
    time: "19:00",
    period: "EDT",
    duration: "60 min",
    purpose: "DFI alignment",
    location: "Festival Lounge Space C",
    isVirtual: false,
    dateStr: "Today · Fri 29 May"
  },
  {
    id: "meet-4",
    leadId: "lead-5",
    leadName: "Funmi Adeleke",
    orgName: "Blue Forest VC",
    time: "09:00",
    period: "EDT",
    duration: "30 min",
    purpose: "Portfolio intro",
    location: "Virtual Room Link",
    isVirtual: true,
    dateStr: "Mon 1 Jun"
  },
  {
    id: "meet-5",
    leadId: "lead-6",
    leadName: "David Kimani",
    orgName: "Savannah Capital",
    time: "11:30",
    period: "EDT",
    duration: "45 min",
    purpose: "East-Africa pipeline setup",
    location: "Sovereign Pavilion A",
    isVirtual: false,
    dateStr: "Mon 1 Jun"
  },
  {
    id: "meet-6",
    leadId: "lead-7",
    leadName: "Sarah Whitlock",
    orgName: "Global Affairs CA",
    time: "14:00",
    period: "EDT",
    duration: "60 min",
    purpose: "Trade-policy briefing",
    location: "Federal Delegation Desk",
    isVirtual: false,
    dateStr: "Mon 1 Jun"
  }
];

export const INITIAL_EXPORTS: ExportHistoryItem[] = [
  {
    id: "ex-1",
    fileName: "caif-leads-day1-export.csv",
    fileType: "CSV",
    dateStr: "Yesterday · 22:14 EDT",
    recordCount: 142
  },
  {
    id: "ex-2",
    fileName: "investor-briefing-dossier.pdf",
    fileType: "PDF",
    dateStr: "Yesterday · 16:08 EDT",
    recordCount: 47
  },
  {
    id: "ex-3",
    fileName: "salesforce-sync-batch-001",
    fileType: "Salesforce sync",
    dateStr: "2 days ago · 18:45 EDT",
    recordCount: 89
  }
];

// Localstorage helpers
export const loadLeadsFromStorage = (): Lead[] => {
  if (typeof window === "undefined") return INITIAL_LEADS;
  const stored = localStorage.getItem("nbti_leads");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading leads", e);
    }
  }
  return INITIAL_LEADS;
};

export const saveLeadsToStorage = (leads: Lead[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("nbti_leads", JSON.stringify(leads));
};

export const loadMeetingsFromStorage = (): Meeting[] => {
  if (typeof window === "undefined") return INITIAL_MEETINGS;
  const stored = localStorage.getItem("nbti_meetings");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading meetings", e);
    }
  }
  return INITIAL_MEETINGS;
};

export const saveMeetingsToStorage = (meetings: Meeting[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("nbti_meetings", JSON.stringify(meetings));
};

export const loadExportsFromStorage = (): ExportHistoryItem[] => {
  if (typeof window === "undefined") return INITIAL_EXPORTS;
  const stored = localStorage.getItem("nbti_exports");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error loading exports", e);
    }
  }
  return INITIAL_EXPORTS;
};

export const saveExportsToStorage = (exports: ExportHistoryItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("nbti_exports", JSON.stringify(exports));
};
