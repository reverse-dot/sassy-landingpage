/* All copy and fictional sample data for the page lives here. */

/** Where every "open the app" call to action points. */
export const APP_URL = "https://app-bandito.vercel.app";
export const LOGIN_URL = `${APP_URL}/login`;
export const DATA_DELETION_URL = `${APP_URL}/data-deletion`;
export const PRIVACY_URL = `${APP_URL}/privacy`;
export const TERMS_URL = `${APP_URL}/terms`;

export const CTA_LABEL = "Empezar ahora";

export const navLinks = [
  { label: "Producto", href: "#features" },
  { label: "Cómo funciona", href: "#how" },
  { label: "Privacidad", href: "#security" },
  { label: "Precios", href: "#pricing" },
];

export const steps = [
  {
    n: "1",
    title: "Conecta tu Instagram",
    body: "Autoriza tu cuenta profesional con el acceso oficial de Instagram, sin salir del navegador. Solo leemos las publicaciones y métricas de tu propia cuenta.",
    tag: "API oficial · OAuth",
  },
  {
    n: "2",
    title: "Agrega a tus competidores",
    body: "Suma las cuentas que quieres seguir. Bandito las sincroniza cada día de forma automática, usando únicamente sus datos públicos.",
    tag: "Sincronización diaria",
  },
  {
    n: "3",
    title: "Recibe insights con evidencia",
    body: "Cada observación indica la cuenta, la métrica, el valor, la muestra y la ventana de 30 días. Si los datos no alcanzan, Bandito te lo dice.",
    tag: "Sin puntajes ni recomendaciones",
  },
];

/* ------------------------------------------------------------------
   Sample workspace for the interactive preview (all fictional)
   ------------------------------------------------------------------ */
export type Account = {
  handle: string;
  followers: string;
  growth: string;
  engagement: string;
  cadence: string;
  sample: number;
  you?: boolean;
};

export type Evidence = {
  account: string;
  metric: string;
  value: string;
  sample: string;
  coverage: string;
  window: string;
};

export type Insight = {
  group: "Fortaleza" | "Oportunidad" | "Contexto";
  text: string;
  evidence: Evidence;
};

export type Client = {
  id: string;
  name: string;
  initials: string;
  tone: "mint" | "sky" | "butter" | "peach" | "lilac";
  handle: string;
  segment: string;
  sync: string;
  status: "Sincronizado" | "Sincronizando" | "Datos limitados";
  flags: string[];
  /** First entry is the client's own account. */
  accounts: Account[];
  insights: Insight[];
  /** Publications per weekday, Monday to Sunday, own account, 30 days. */
  weekly: number[];
  bestDay: number;
  bestMoment: string;
};

export const WEEKDAYS = ["L", "M", "X", "J", "V", "S", "D"];

export const clients: Client[] = [
  {
    id: "c1",
    name: "Casa Lumbre",
    initials: "CL",
    tone: "sky",
    handle: "@casa.lumbre",
    segment: "Café de especialidad",
    sync: "06:00",
    status: "Sincronizado",
    flags: [],
    accounts: [
      { handle: "@casa.lumbre", followers: "12.480", growth: "+3,2%", engagement: "3,4%", cadence: "5", sample: 22, you: true },
      { handle: "@taller.norte", followers: "9.810", growth: "+1,1%", engagement: "2,1%", cadence: "3", sample: 13 },
      { handle: "@estudio.bruma", followers: "15.120", growth: "+2,4%", engagement: "3,0%", cadence: "7", sample: 30 },
      { handle: "@cafe.ancla", followers: "6.340", growth: "+0,6%", engagement: "4,1%", cadence: "2", sample: 9 },
    ],
    insights: [
      {
        group: "Fortaleza",
        text: "Tu interacción mediana supera a la de @taller.norte y @estudio.bruma.",
        evidence: { account: "@casa.lumbre", metric: "Interacción mediana", value: "3,4% vs 2,1% y 3,0%", sample: "22 pub.", coverage: "100%", window: "30 días" },
      },
      {
        group: "Fortaleza",
        text: "Tus seguidores crecieron más que los de cada competidor.",
        evidence: { account: "@casa.lumbre", metric: "Seguidores", value: "+3,2% vs +1,1%, +2,4% y +0,6%", sample: "4 cuentas", coverage: "100%", window: "30 días" },
      },
      {
        group: "Oportunidad",
        text: "@estudio.bruma publica más seguido que tú.",
        evidence: { account: "@estudio.bruma", metric: "Frecuencia", value: "7 vs 5 pub./semana", sample: "30 pub.", coverage: "100%", window: "30 días" },
      },
      {
        group: "Contexto",
        text: "@cafe.ancla muestra la mayor interacción del grupo.",
        evidence: { account: "@cafe.ancla", metric: "Interacción mediana", value: "4,1%", sample: "9 pub.", coverage: "100%", window: "30 días" },
      },
    ],
    weekly: [2, 3, 4, 5, 3, 4, 1],
    bestDay: 3,
    bestMoment: "Jueves, entre 19:00 y 21:00",
  },
  {
    id: "c2",
    name: "Nube Studio",
    initials: "NS",
    tone: "lilac",
    handle: "@nube.studio",
    segment: "Estudio de yoga",
    sync: "06:00",
    status: "Sincronizando",
    flags: [],
    accounts: [
      { handle: "@nube.studio", followers: "8.920", growth: "+2,1%", engagement: "4,8%", cadence: "4", sample: 17, you: true },
      { handle: "@respira.taller", followers: "11.300", growth: "+1,4%", engagement: "3,6%", cadence: "6", sample: 27 },
      { handle: "@sol.y.flor", followers: "5.410", growth: "+3,0%", engagement: "5,2%", cadence: "3", sample: 7 },
    ],
    insights: [
      {
        group: "Fortaleza",
        text: "Tu interacción mediana supera a la de @respira.taller.",
        evidence: { account: "@nube.studio", metric: "Interacción mediana", value: "4,8% vs 3,6%", sample: "17 pub.", coverage: "100%", window: "30 días" },
      },
      {
        group: "Oportunidad",
        text: "@respira.taller publica más seguido que tú.",
        evidence: { account: "@respira.taller", metric: "Frecuencia", value: "6 vs 4 pub./semana", sample: "27 pub.", coverage: "100%", window: "30 días" },
      },
      {
        group: "Contexto",
        text: "@sol.y.flor es la cuenta que más crece este mes.",
        evidence: { account: "@sol.y.flor", metric: "Seguidores", value: "+3,0%", sample: "7 pub.", coverage: "100%", window: "30 días" },
      },
    ],
    weekly: [3, 2, 3, 3, 2, 3, 1],
    bestDay: 1,
    bestMoment: "Martes, entre 12:00 y 14:00",
  },
  {
    id: "c3",
    name: "Marea Viva",
    initials: "MV",
    tone: "peach",
    handle: "@marea.viva",
    segment: "Marca de ropa",
    sync: "06:00",
    status: "Sincronizado",
    flags: [],
    accounts: [
      { handle: "@marea.viva", followers: "21.740", growth: "+0,9%", engagement: "1,8%", cadence: "3", sample: 13, you: true },
      { handle: "@linea.costa", followers: "34.200", growth: "+1,7%", engagement: "1,5%", cadence: "5", sample: 22 },
      { handle: "@tejido.sur", followers: "18.050", growth: "−0,3%", engagement: "2,2%", cadence: "2", sample: 9 },
    ],
    insights: [
      {
        group: "Oportunidad",
        text: "@linea.costa crece más rápido que tú.",
        evidence: { account: "@linea.costa", metric: "Seguidores", value: "+1,7% vs +0,9%", sample: "2 cuentas", coverage: "100%", window: "30 días" },
      },
      {
        group: "Fortaleza",
        text: "Tu interacción mediana supera a la de @linea.costa.",
        evidence: { account: "@marea.viva", metric: "Interacción mediana", value: "1,8% vs 1,5%", sample: "13 pub.", coverage: "100%", window: "30 días" },
      },
      {
        group: "Contexto",
        text: "@tejido.sur logra la interacción más alta del grupo con menos publicaciones.",
        evidence: { account: "@tejido.sur", metric: "Interacción mediana", value: "2,2%", sample: "9 pub.", coverage: "100%", window: "30 días" },
      },
    ],
    weekly: [1, 2, 2, 3, 2, 2, 1],
    bestDay: 2,
    bestMoment: "Miércoles, entre 20:00 y 22:00",
  },
];

export const testimonials = [
  {
    quote:
      "Antes armaba el informe de cada cliente copiando cifras a una hoja de cálculo. Ahora abro el panel, cambio de cliente y el lado a lado ya está listo.",
    name: "Camila R.",
    role: "Estratega de contenido",
    org: "agencia de marketing",
    tone: "sky",
    featured: true,
  },
  {
    quote:
      "Me gusta que cada insight muestre la muestra y la cobertura. Cuando hay pocos datos, lo dice en lugar de inventar una conclusión.",
    name: "Diego M.",
    role: "Analista de redes sociales",
    org: "agencia digital",
    tone: "lilac",
  },
  {
    quote:
      "Seguir a mi competencia dejó de ser abrir perfiles uno por uno. Reviso cómo voy en 30 días y decido qué publicar.",
    name: "Valentina S.",
    role: "Creadora de contenido",
    org: "independiente",
    tone: "peach",
  },
  {
    quote:
      "Cambiar de cliente es rápido, y cada uno tiene sus propios competidores. Se acabaron las carpetas de capturas.",
    name: "Tomás A.",
    role: "Director de cuentas",
    org: "agencia de comunicación",
    tone: "lilac",
  },
  {
    quote:
      "El mejor momento para publicar sale de mis propias publicaciones, no de una regla genérica de internet.",
    name: "Javiera P.",
    role: "Marca de diseño",
    org: "emprendimiento",
    tone: "sky",
  },
];

export const securityPoints = [
  {
    title: "Autorización oficial",
    body: "Conectas tu cuenta con el acceso oficial de Meta e Instagram (OAuth) y su API Graph. Bandito no te pide tu contraseña de Instagram.",
    icon: "lock",
  },
  {
    title: "Solo tu cuenta, solo lo necesario",
    body: "Con la API Graph accedemos a las publicaciones y métricas de tu propia cuenta profesional. A tus competidores los seguimos únicamente con datos públicos.",
    icon: "eye",
  },
  {
    title: "Desconecta cuando quieras",
    body: "Puedes desconectar Instagram en cualquier momento. Sin permisos activos, Bandito deja de sincronizar tu cuenta.",
    icon: "unlink",
  },
  {
    title: "Eliminación de datos a tu solicitud",
    body: "Si quieres que borremos tus datos, puedes pedirlo en cualquier momento desde la página de eliminación de datos.",
    icon: "trash",
  },
  {
    title: "Datos observados, sin adivinar",
    body: "Los insights se calculan de forma determinista sobre tu muestra de 30 días. Si la muestra es pequeña o los datos no alcanzan, se indica.",
    icon: "check",
  },
];

/** Example sync activity shown in the privacy panel (fictional). */
export const syncLog = [
  { who: "Bandito", act: "sincronizó", obj: "3 competidores · datos públicos", t: "06:00" },
  { who: "Tú", act: "agregaste", obj: "@taller.norte a Casa Lumbre", t: "06:12" },
  { who: "Bandito", act: "actualizó", obj: "Lado a lado · ventana de 30 días", t: "06:14" },
  { who: "Bandito", act: "recalculó", obj: "Insights de Casa Lumbre", t: "06:15" },
  { who: "Tú", act: "cambiaste", obj: "al cliente Nube Studio", t: "09:02" },
  { who: "Bandito", act: "detectó", obj: "un nuevo insight · @cafe.ancla", t: "09:03" },
];

export type Plan = {
  name: string;
  blurb: string;
  cur: string;
  price: string;
  unit: string;
  cta: string;
  featured?: boolean;
  features: string[];
  note?: string;
};

export const plans: Plan[] = [
  {
    name: "Creador",
    blurb: "Para creadores con una sola cuenta de Instagram.",
    cur: "$",
    price: "9.990",
    unit: "CLP por mes",
    cta: CTA_LABEL,
    features: [
      "1 cuenta de Instagram",
      "Hasta 5 competidores",
      "1 sincronización al día",
      "Lado a lado, insights, contenido e informes",
    ],
  },
  {
    name: "Empresa",
    blurb: "Para una marca que sigue su propio Instagram y a su competencia.",
    cur: "$",
    price: "39.990",
    unit: "CLP por mes",
    cta: CTA_LABEL,
    features: [
      "1 cuenta de marca",
      "Hasta 15 competidores",
      "2 sincronizaciones al día",
      "Lado a lado, insights, contenido e informes",
    ],
  },
  {
    name: "Agencia",
    blurb: "Para agencias que gestionan a varios clientes en un mismo espacio.",
    cur: "US$",
    price: "279",
    unit: "USD por mes",
    cta: CTA_LABEL,
    featured: true,
    note: "Pensado para agencias",
    features: [
      "Hasta 6 clientes",
      "20 competidores por cliente (120 en total)",
      "2 sincronizaciones al día",
      "Selector de clientes en un solo espacio",
      "Lado a lado, insights, contenido e informes",
    ],
  },
];

export const footerCols: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Producto",
    links: [
      { label: "Lado a lado", href: "#features" },
      { label: "Insights con evidencia", href: "#features" },
      { label: "Contenido y mejor momento", href: "#features" },
      { label: "Informes", href: "#features" },
    ],
  },
  {
    title: "Bandito",
    links: [
      { label: "Cómo funciona", href: "#how" },
      { label: "Precios", href: "#pricing" },
      { label: "Privacidad y datos", href: "#security" },
    ],
  },
  {
    title: "Cuenta",
    links: [
      { label: "Abrir la app", href: APP_URL },
      { label: "Iniciar sesión", href: LOGIN_URL },
      { label: "Eliminación de datos", href: DATA_DELETION_URL },
    ],
  },
];
