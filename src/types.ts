export interface Lead {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  org: string;
  role: string;
  country: string;
  tag: string; // e.g. 'Investor', 'VC', 'Corporate', 'Government', 'DFI', 'Partner'
  tone: 'gold' | 'moss' | 'laurel' | 'clay'; // styles defined in the CSS or component
  time: string; // e.g. '17:04'
  score: number;
  source: string; // 'QR Scan', 'Manual', 'Business Card'
  capturedBy: string;
  note: string;
  token: string;
  timestamp: string;
  followUpSent?: boolean;
  confirmed?: boolean;
}

export interface Meeting {
  id: string;
  leadId?: string;
  leadName: string;
  orgName: string;
  time: string; // e.g., '17:30'
  period: string; // e.g., 'EDT' | 'EST'
  duration: string; // e.g., '30 min'
  purpose: string; // e.g., 'Investor brief'
  location: string; // e.g., 'Pavilion · Booth E14'
  isVirtual: boolean;
  dateStr: string; // e.g. 'Today · Fri 29 May' or 'Mon 1 Jun'
}

export interface ExportHistoryItem {
  id: string;
  fileName: string;
  fileType: 'CSV' | 'PDF' | 'vCard' | 'Salesforce sync' | 'HubSpot sync';
  dateStr: string;
  recordCount: number;
}
