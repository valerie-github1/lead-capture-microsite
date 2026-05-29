import React from "react";
import { Compass, BookOpen, CheckCircle, Smartphone, Award, HelpCircle, Users, Clock } from "lucide-react";

export const UserGuide: React.FC = () => {
  return (
    <div className="space-y-8 py-4">
      {/* Visual Guide Header */}
      <div className="border-b border-line pb-4">
        <span className="font-mono text-[9px] tracking-widest uppercase text-gold-soft mb-2 block">
          Operational Reference Guide
        </span>
        <h2 className="font-serif text-3xl font-medium tracking-tight text-ink">
          Nextgen Connect <em>User Manual</em>
        </h2>
        <p className="text-sm text-taupe mt-1 leading-relaxed">
          Standalone manual for delegation delegates, ground coordinators, and tech facilitator staff on the festival floor.
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <div className="bg-ivory border border-line p-5 rounded-md relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gold" />
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss flex-shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-lg text-ink">1. Access and Workspace Entry</h3>
              <p className="text-sm text-taupe-light mt-1.5 leading-relaxed">
                The lead ecosystem is zero-setup. Delegates do not require individual logins on the floor to remain fast and secure. Switching between the public-facing connection microsite and the delegation workspace occurs instantaneously via the header toggle.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-ivory border border-line p-5 rounded-md relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gold" />
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-lg text-ink">2. Live Capturing Flow</h3>
              <p className="text-sm text-taupe-light mt-1.5 leading-relaxed">
                When discussing with a stakeholder, open the internal "Live Capture" screen in the workspace. Input their parameters, select interests (Incubation, VC, Trade Corridors), and save. The app instantly assigns an automated NXT routing token, appends the local database list, and recalculates live statistics.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="bg-ivory border border-line p-5 rounded-md relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gold" />
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-lg text-ink">3. Automated Scoring Metric</h3>
              <p className="text-sm text-taupe-light mt-1.5 leading-relaxed">
                Every captured lead is processed by an automated scoring model. High scores (90+) represent hot investment prospects like general partners or large corporate decision-makers. High score items display active "Hot Lead" indicators on lists to easily alert our floor delegation.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4 */}
        <div className="bg-ivory border border-line p-5 rounded-md relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gold" />
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-lg text-ink">4. Real-time Dispatch Follow-ups</h3>
              <p className="text-sm text-taupe-light mt-1.5 leading-relaxed">
                Pressing the "Send Official Follow-up" button inside any lead's sliding detail sheet will immediately submit the investor data to <code className="text-xs font-mono bg-cream px-1 rounded text-moss font-semibold">topeomojayogbe@ukald.com</code> via our fast mail relay. It is best performance practice to send this right when parting with an investor.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="bg-ivory border border-line p-5 rounded-md relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gold" />
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss flex-shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-lg text-ink">5. Export Pipelines & CRM Sync</h3>
              <p className="text-sm text-taupe-light mt-1.5 leading-relaxed">
                Our workspace provides flexible, compliant pipelines to transfer floor data. This includes instant CSV spreadsheets compatible with MS Excel, and a dedicated <strong>Salesforce & HubSpot REST Sync</strong> utility. Upon initiating a background sync, the system performs validation checks and delivers high-fidelity toast responses detailing mapped indicators and scores.
              </p>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="bg-ivory border border-line p-5 rounded-md relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gold" />
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-lg text-ink">6. Real-time Lead Notes Auto-Saver</h3>
              <p className="text-sm text-taupe-light mt-1.5 leading-relaxed">
                Within the sliding Lead Detail Sheet, the <strong>Staff Field Notes</strong> editor features real-time persistence. As you write follow-up parameters, goals, or meeting summaries, a background task saves your input instantly (with debounce safety to prevent state thrashing). Auto-save indicators keep you informed in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="bg-ivory border border-line p-5 rounded-md relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gold" />
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss flex-shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-lg text-ink">7. Official Print Dossier Compiler & Export Previews</h3>
              <p className="text-sm text-taupe-light mt-1.5 leading-relaxed">
                The <strong>NCBA Briefing Booklet Room</strong> compiles clean, audit-ready physical PDF documents of the entire delegation registry. This compiler has been fully optimized to prevent blank preview pages. The interactive control panel handles instant layout swaps (cards or list tables) with high-fidelity system printing, while leaving the print sheets automatically unconstrained and pristine on any system printer engine or cloud deployment.
              </p>
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className="bg-ivory border border-line p-5 rounded-md relative overflow-hidden">
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-gold" />
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-moss/10 flex items-center justify-center text-moss flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-medium text-lg text-ink">8. Bilateral Meeting Real-time Alerts & Simulation</h3>
              <p className="text-sm text-taupe-light mt-1.5 leading-relaxed">
                The workspace features an integrated <strong>B2B Meeting Visual Alert System</strong>. It triggers high-visibility neon gold pulsing banners 15 minutes prior to any scheduled attendee session, allowing delegates to review historical investor dossiers instantly. It also supports active green in-progress indicators during session hours. Staff can simulate specific times and date targets directly through the immersive Simulation Console under the <em>Meetings</em> tab.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-cream border border-gold/30 p-5 rounded-md relative overflow-hidden">
          <h3 className="font-serif font-medium text-lg text-ink flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-gold" /> Frequently Asked Questions
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <strong className="text-moss block font-semibold mb-1">Q: Why did my print/save PDF preview look blank, and is it fixed?</strong>
              <p className="text-taupe leading-relaxed">
                Yes! The previous version applied a full `no-print` visibility block to the modal viewport container itself. This has been resolved; only the top-bar control tools are hidden during the print process, ensuring the underlying document compiles perfectly onto your physical or digital letterpress system sheets.
              </p>
            </div>
            <div>
              <strong className="text-moss block font-semibold mb-1">Q: Does the app lose saved leads if closed?</strong>
              <p className="text-taupe leading-relaxed">
                No. Captures are kept locally inside the browser's persistent sandbox (`localStorage`). They will survive closing the tab, browser reboots, and offline environments.
              </p>
            </div>
            <div>
              <strong className="text-moss block font-semibold mb-1">Q: Whose logo is shown as our main branding/favicon?</strong>
              <p className="text-taupe leading-relaxed">
                The application renders the highly detailed emblem of the <strong>National Board for Technology Incubation (NBTI) Abuja</strong>. This high-resolution insignia has been properly placed inside the static asset root to guarantee immediate favicon loading and visual parity across all production and Vercel CDN servers.
              </p>
            </div>
            <div>
              <strong className="text-moss block font-semibold mb-1">Q: How do we sync leads to our corporate Salesforce or HubSpot?</strong>
              <p className="text-taupe leading-relaxed">
                Simply head to the "Exports" tab, choose either Salesforce or HubSpot, and trigger the sync. The system performs secure synchronization and pops a comprehensive validation toast detailing the number of contacts merged and interest scores mapped correctly to production.
              </p>
            </div>
            <div>
              <strong className="text-moss block font-semibold mb-1">Q: Can several colleagues capture at once?</strong>
              <p className="text-taupe leading-relaxed">
                Yes! Since each mobile scan routes uniquely through the landing page form, multiple staff can capture stakeholders simultaneously. All submissions route to the focal facilitator's mail address.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
