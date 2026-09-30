/* All copy and fictional data for the page lives here. */

export const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Solutions", href: "#workflow" },
  { label: "Resources", href: "#security" },
  { label: "Pricing", href: "#pricing" },
];

export const steps = [
  {
    n: "1",
    title: "Capture it your way",
    body: "Snap a photo of the page, write on a tablet, or talk through the visit. Shorthand, arrows and crossings-out are all fair game.",
    tag: "Photo · Stylus · Voice",
  },
  {
    n: "2",
    title: "Mendleaf does the sorting",
    body: "Each line lands in the right section of your template — history, findings, assessment, plan — with every uncertain word flagged for you, not guessed.",
    tag: "Structured in seconds",
  },
  {
    n: "3",
    title: "Review, sign, move on",
    body: "Approve the record, then send the referral, book the follow-up and message the patient without leaving the note.",
    tag: "One place to finish",
  },
];

export type Patient = {
  id: string;
  name: string;
  initials: string;
  age: number;
  sex: "F" | "M";
  mrn: string;
  reason: string;
  time: string;
  status: "Ready to sign" | "Drafting" | "Signed" | "Needs review";
  tone: "mint" | "sky" | "butter" | "peach" | "lilac";
  flags: string[];
  summary: string;
  fields: { label: string; value: string }[];
  tasks: { id: string; label: string; due: string; done: boolean; tone: string }[];
  timeline: { when: string; what: string; who: string; kind: "note" | "lab" | "msg" | "task" }[];
};

export const patients: Patient[] = [
  {
    id: "p1",
    name: "Rosa Almeida",
    initials: "RA",
    age: 58,
    sex: "F",
    mrn: "ML-20418",
    reason: "Right knee pain, 3 weeks",
    time: "09:10",
    status: "Ready to sign",
    tone: "mint",
    flags: ["NSAID caution", "Prefers text"],
    summary:
      "Three weeks of right knee pain, worse on stairs, no trauma. Mild effusion, stable ligaments. Likely early osteoarthritis flare. Starting physio, short course of topical anti-inflammatory, review in two weeks.",
    fields: [
      { label: "Presenting", value: "R knee pain × 3 wks, worse on stairs & after rest" },
      { label: "Examination", value: "Mild effusion, full ROM, ligaments stable" },
      { label: "Assessment", value: "Probable OA flare, R knee" },
      { label: "Plan", value: "Physio referral · topical NSAID · review 2 wks" },
    ],
    tasks: [
      { id: "t1", label: "Physiotherapy referral", due: "Drafted", done: true, tone: "mint" },
      { id: "t2", label: "Book review in 2 weeks", due: "Oct 13", done: false, tone: "sky" },
      { id: "t3", label: "Text exercise sheet to patient", due: "Today", done: false, tone: "butter" },
    ],
    timeline: [
      { when: "09:24", what: "Note structured from handwriting", who: "Mendleaf", kind: "note" },
      { when: "09:26", what: "Physio referral drafted", who: "Mendleaf", kind: "task" },
      { when: "09:31", what: "Plan edited", who: "Dr. M. Chen", kind: "note" },
      { when: "Sep 12", what: "Bloods: CRP within range", who: "Lab", kind: "lab" },
    ],
  },
  {
    id: "p2",
    name: "Jonah Whitfield",
    initials: "JW",
    age: 34,
    sex: "M",
    mrn: "ML-19077",
    reason: "Asthma review",
    time: "09:40",
    status: "Drafting",
    tone: "sky",
    flags: ["Night symptoms"],
    summary:
      "Annual asthma review. Using reliever three to four times a week with some night waking since moving house. Technique reviewed; stepping up preventer and sharing a written action plan.",
    fields: [
      { label: "Presenting", value: "Reliever 3–4×/wk, waking 1–2 nights/wk" },
      { label: "Examination", value: "Chest clear, peak flow 82% predicted" },
      { label: "Assessment", value: "Partly controlled asthma" },
      { label: "Plan", value: "Step up preventer · action plan · review 6 wks" },
    ],
    tasks: [
      { id: "t1", label: "Send asthma action plan", due: "Today", done: false, tone: "butter" },
      { id: "t2", label: "Pharmacy: new preventer script", due: "Queued", done: false, tone: "lilac" },
      { id: "t3", label: "Review in 6 weeks", due: "Nov 10", done: false, tone: "sky" },
    ],
    timeline: [
      { when: "09:52", what: "Dictation transcribed", who: "Mendleaf", kind: "note" },
      { when: "09:55", what: "Two phrases flagged for review", who: "Mendleaf", kind: "note" },
      { when: "Aug 30", what: "Patient message: inhaler running low", who: "Portal", kind: "msg" },
    ],
  },
  {
    id: "p3",
    name: "Amara Oduya",
    initials: "AO",
    age: 7,
    sex: "F",
    mrn: "ML-21560",
    reason: "Ear pain, fever",
    time: "10:15",
    status: "Needs review",
    tone: "butter",
    flags: ["Penicillin allergy"],
    summary:
      "Two days of left ear pain with fever, eating and drinking well. Bulging left tympanic membrane. Acute otitis media; penicillin allergy noted, so an alternative antibiotic has been suggested for your confirmation.",
    fields: [
      { label: "Presenting", value: "L ear pain × 2 days, T 38.4°C" },
      { label: "Examination", value: "L TM red & bulging, R normal" },
      { label: "Assessment", value: "Acute otitis media, left" },
      { label: "Plan", value: "Confirm antibiotic choice · safety-net advice" },
    ],
    tasks: [
      { id: "t1", label: "Confirm antibiotic (allergy)", due: "Now", done: false, tone: "peach" },
      { id: "t2", label: "Safety-net leaflet to parent", due: "Today", done: false, tone: "butter" },
    ],
    timeline: [
      { when: "10:22", what: "Allergy conflict flagged", who: "Mendleaf", kind: "task" },
      { when: "10:21", what: "Note structured from photo", who: "Mendleaf", kind: "note" },
    ],
  },
  {
    id: "p4",
    name: "Tomasz Brenner",
    initials: "TB",
    age: 71,
    sex: "M",
    mrn: "ML-15233",
    reason: "BP follow-up",
    time: "10:45",
    status: "Signed",
    tone: "lilac",
    flags: [],
    summary:
      "Home readings now averaging within target after last month's dose change. No side effects reported. Continue current regimen and repeat kidney function in three months.",
    fields: [
      { label: "Presenting", value: "Home BP avg 132/80 over 14 days" },
      { label: "Examination", value: "Clinic BP 134/82, HR 68 regular" },
      { label: "Assessment", value: "Hypertension, controlled" },
      { label: "Plan", value: "Continue · U&E in 3 months" },
    ],
    tasks: [
      { id: "t1", label: "Order U&E for January", due: "Scheduled", done: true, tone: "mint" },
    ],
    timeline: [
      { when: "10:58", what: "Record signed", who: "Dr. M. Chen", kind: "note" },
      { when: "10:57", what: "Lab order scheduled", who: "Mendleaf", kind: "lab" },
    ],
  },
];

export const testimonials = [
  {
    quote:
      "I spend less time cleaning up notes and more time focused on the people in front of me. My last patient of the day gets the same version of me as my first.",
    name: "Dr. Maya Chen",
    role: "Family physician",
    org: "Harbourside Family Practice",
    tone: "sky",
    featured: true,
  },
  {
    quote:
      "It reads my arrows. Nobody has ever been able to read my arrows.",
    name: "Tomás Ibarra",
    role: "Nurse practitioner",
    org: "Northgate Community Clinic",
    tone: "butter",
  },
  {
    quote:
      "The flagged-words view is the reason I trust it. It tells me what it isn't sure about instead of quietly guessing.",
    name: "Dr. Adaeze Okafor",
    role: "Paediatrician",
    org: "Little Oak Children's Health",
    tone: "mint",
  },
  {
    quote:
      "We rolled it out to eleven clinicians in a week. The follow-up list alone changed how our front desk starts the morning.",
    name: "Priya Raman",
    role: "Clinic operations lead",
    org: "Fernhill Medical Group",
    tone: "lilac",
  },
  {
    quote:
      "Referrals used to be my Friday-night job. Now they're drafted before the patient has left the car park.",
    name: "Dr. Henrik Solberg",
    role: "Sports medicine",
    org: "Kestrel Sports Clinic",
    tone: "peach",
  },
];

export const securityPoints = [
  {
    title: "Private by default",
    body: "Notes are only ever visible to the people on the patient's care team. Nothing is used to train shared models.",
    icon: "lock",
  },
  {
    title: "Encrypted end to end",
    body: "Data is encrypted in transit and at rest, with keys managed separately from the records they protect.",
    icon: "key",
  },
  {
    title: "Access that fits your team",
    body: "Role-based permissions for clinicians, admin staff and locums, with single sign-on and enforced two-step login.",
    icon: "user",
  },
  {
    title: "Every action on the record",
    body: "A tamper-evident audit trail shows who opened, edited, signed or exported each note, and when.",
    icon: "history",
  },
  {
    title: "Your data, your rules",
    body: "Set retention periods, export everything in open formats, and delete on request — no support ticket required.",
    icon: "database",
  },
];

export const auditLog = [
  { who: "Dr. M. Chen", act: "signed", obj: "Visit note · R. Almeida", t: "09:31" },
  { who: "Front desk", act: "viewed", obj: "Follow-up list", t: "09:33" },
  { who: "T. Ibarra, NP", act: "edited", obj: "Plan · J. Whitfield", t: "09:57" },
  { who: "Mendleaf", act: "flagged", obj: "Allergy conflict · A. Oduya", t: "10:22" },
  { who: "Dr. A. Okafor", act: "exported", obj: "Referral letter (PDF)", t: "10:40" },
  { who: "Admin", act: "revoked", obj: "Locum access · 2 users", t: "11:02" },
];

export type Plan = {
  name: string;
  blurb: string;
  monthly: number | null;
  annual: number | null;
  unit: string;
  cta: string;
  featured?: boolean;
  features: string[];
  note?: string;
};

export const plans: Plan[] = [
  {
    name: "Solo",
    blurb: "For one clinician who wants their evenings back.",
    monthly: 49,
    annual: 39,
    unit: "per month",
    cta: "Start free trial",
    features: [
      "Unlimited handwritten & dictated notes",
      "12 visit templates, fully editable",
      "Follow-up and task extraction",
      "Export to PDF and plain text",
    ],
  },
  {
    name: "Clinic",
    blurb: "For practices that share patients, templates and a to-do list.",
    monthly: 39,
    annual: 32,
    unit: "per clinician / month",
    cta: "Start free trial",
    featured: true,
    features: [
      "Everything in Solo",
      "Shared templates & house style",
      "Team task board and hand-offs",
      "Roles, SSO and audit trail",
      "Priority onboarding session",
    ],
    note: "Most chosen by teams of 3–40",
  },
  {
    name: "Health system",
    blurb: "For groups with many sites and their own integration needs.",
    monthly: null,
    annual: null,
    unit: "",
    cta: "Talk to us",
    features: [
      "Everything in Clinic",
      "Custom record integrations",
      "Data residency options",
      "Dedicated success partner",
    ],
  },
];

export const footerCols = [
  {
    title: "Product",
    links: ["Handwriting capture", "Dictation", "Templates", "Task board", "Changelog"],
  },
  { title: "Solutions", links: ["Family medicine", "Paediatrics", "Physiotherapy", "Group practices"] },
  { title: "Resources", links: ["Help centre", "Security overview", "Guides", "Contact"] },
  { title: "Company", links: ["About", "Careers", "Press", "Privacy"] },
];
