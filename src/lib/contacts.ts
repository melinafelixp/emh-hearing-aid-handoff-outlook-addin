// Centralized contact configuration for the EMH Hearing Aid tool.
//
// Every fixed email address used anywhere in this app must live here — do not
// hardcode an address inside a component or another lib file. When an address
// changes, this is the only file that should need editing.

// ─────────────────────────────────────────────────────────────────────────
// ⚠️  ACTION NEEDED — Evan's email address was not provided in the business
// requirements and has NOT been invented or assumed. It is intentionally left
// blank below. Until it's filled in:
//   • Evan will be silently omitted from Test Seeds and Live Seeds (with a
//     console warning) rather than the app guessing or falling back to Worth.
//   • worth@worthadv.com is kept ONLY as an Outlook "To" recipient, per the
//     explicit instruction not to conflate Worth with Evan.
// Once confirmed, set EVAN_EMAIL below — every seed list updates automatically.
// ─────────────────────────────────────────────────────────────────────────
export const EVAN_EMAIL = ""; // TODO: confirm and fill in Evan's email address

export const WORTH_EMAIL = "worth@worthadv.com";

// Outlook "To" / "CC" recipients — populated on every campaign, every source.
export const OUTLOOK_RECIPIENTS = {
  to: [WORTH_EMAIL, "lauren@worthadv.com"],
  cc: ["brittany@elevatemediahouse.com"],
};

// EMH internal team
export const EMH_CONTACTS = {
  chloe: "chloe@elevatemediahouse.com",
  brittany: "brittany@elevatemediahouse.com",
  jason: "jason@elevatemediahouse.com",
};

// SonaRev
export const SONAREV_CONTACTS = {
  alex: "alex@sonarev.net",
};

// Stacie — fixed first-deployment-only recipients
export const STACIE_CONTACTS = {
  work: "stjn@oticon.com",
  personal: "stacieleigh77@gmail.com",
};

// Sonova (Phonak / Unitron)
export const SONOVA_FIXED_CONTACTS = {
  cassie: "Cassie.Marini@sonova.com",
  alicia: "Alicia.Ross@sonova.com",
};

export const SONOVA_MARKETING_SPECIALISTS: Record<string, string> = {
  "Raymond Smith": "raymond.smith@sonova.com",
  "Kristin Sherman": "kristin.sherman@sonova.com",
  "Bradley Weil": "bradley.weil@sonova.com",
  // Cassie is already one of the two fixed Sonova live seeds (see
  // SONOVA_FIXED_CONTACTS.cassie below). Mapping her here to that same address
  // means selecting her as Marketing Specialist adds nothing new — the
  // case-insensitive dedupe in seedLogic.ts collapses the duplicate, so the
  // live seeds stay exactly Cassie + Alicia with no special-case branching.
  Cassie: SONOVA_FIXED_CONTACTS.cassie,
};

// ─────────────────────────────────────────────────────────────────────────
// Base seed lists — built from the contacts above so there is exactly one
// place that defines "who is Chloe / Brittany / Evan / Alex / Jason".
// Evan is included only when EVAN_EMAIL has been filled in (see warning
// above); seedLogic.ts is responsible for the actual dedupe/normalize pass.
// ─────────────────────────────────────────────────────────────────────────
export const BASE_TEST_SEEDS: string[] = [
  EMH_CONTACTS.chloe,
  EMH_CONTACTS.brittany,
  ...(EVAN_EMAIL ? [EVAN_EMAIL] : []),
  SONAREV_CONTACTS.alex,
  WORTH_EMAIL,
];

export const BASE_LIVE_SEEDS: string[] = [
  EMH_CONTACTS.chloe,
  EMH_CONTACTS.brittany,
  EMH_CONTACTS.jason,
  ...(EVAN_EMAIL ? [EVAN_EMAIL] : []),
  SONAREV_CONTACTS.alex,
  WORTH_EMAIL,
];

export const STACIE_FIRST_DEPLOYMENT_ONLY_BASE: string[] = [
  STACIE_CONTACTS.work,
  STACIE_CONTACTS.personal,
];

export const SONOVA_FIXED_LIVE_SEEDS: string[] = [
  SONOVA_FIXED_CONTACTS.cassie,
  SONOVA_FIXED_CONTACTS.alicia,
];
