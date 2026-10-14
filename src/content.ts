export type Lang = 'en' | 'sq';

export const LINKS = {
  company: 'https://zedigital.tech',
  cv: '/Elvi_Zekaj_CV.pdf',
  github: 'https://github.com/ezekaj',
  linkedin: 'https://www.linkedin.com/in/elvi-zekaj-240b10243',
  email: 'elvizekaj@zedigital.tech',
  whatsappNumber: '355686407594',
};

export type Status = 'live' | 'in-use' | 'pilot' | 'read-only' | 'on-hold';

export interface Project {
  id: string;
  name: string | Record<Lang, string>;
  status: Status;
  stack: string[];
  link?: { href: string; label: Record<Lang, string> };
  summary: Record<Lang, string>;
}

export interface Repo {
  name: string;
  lang: string;
  summary: Record<Lang, string>;
}

export const PROJECTS: Project[] = [
  {
    id: 'verto',
    name: 'Verto',
    status: 'pilot',
    stack: ['TypeScript', 'Next.js', 'Hono', 'PostgreSQL', 'RLS'],
    summary: {
      en: 'The business system I build for Albanian companies, growing from a CRM into a full ERP: double-entry ledger, VAT, inventory, HR and payroll, POS and fiscalization, all in Albanian. First deployment runs on-premises at a hospitality business as a pilot.',
      sq: 'Sistemi i biznesit që ndërtoj për kompanitë shqiptare, nga CRM deri në ERP të plotë: kontabilitet me hyrje të dyfishtë, TVSH, inventar, burime njerëzore dhe paga, POS dhe fiskalizim, gjithçka në shqip. Instalimi i parë punon në vend, te një biznes mikpritjeje, si pilot.',
    },
  },
  {
    id: 'ze-ads',
    name: { en: 'AI ads system', sq: 'Sistemi i reklamave me AI' },
    status: 'read-only',
    stack: ['Python', 'Meta Marketing API', 'HubSpot', 'Claude'],
    link: {
      href: 'https://github.com/ezekaj/ze-ads',
      label: { en: 'Case study', sq: 'Rasti studimor' },
    },
    summary: {
      en: 'AI-orchestrated Meta ads for a marketing agency’s clinic clients. Claude plans and reports; a separate rules engine is the only part allowed to touch the ad accounts, behind a human-approved money wall. Runs read-only today: it reads the accounts daily and reports.',
      sq: 'Reklama Meta të orkestruara me AI për klinikat që ndjek një agjenci marketingu. Claude planifikon dhe raporton; një motor rregullash i veçantë është e vetmja pjesë që lejohet të ndryshojë llogaritë, pas një “muri parash” që e miraton një njeri. Sot punon vetëm për lexim: i lexon llogaritë çdo ditë dhe raporton.',
    },
  },
  {
    id: 'fanar',
    name: 'Fanar',
    status: 'live',
    stack: ['TypeScript', 'Cloudflare Workers', 'D1', 'R2', 'MapLibre'],
    link: {
      href: 'https://fanar.zedigitaltech.workers.dev',
      label: { en: 'Open Fanar', sq: 'Hap Fanar' },
    },
    summary: {
      en: 'Road-hazard alerts for Albanian drivers: an installable web app where drivers report hazards in one gesture and hear spoken Albanian alerts for what is ahead, with turn-by-turn navigation routed on the phone. Live since September 2026, early stage.',
      sq: 'Njoftime për rreziqet në rrugë për shoferët shqiptarë: një aplikacion web që instalohet në telefon, ku shoferët raportojnë me një lëvizje dhe dëgjojnë njoftime me zë në shqip për atë që kanë përpara, me navigim hap pas hapi që llogaritet në telefon. Aktiv që nga shtatori 2026, në fazë të hershme.',
    },
  },
  {
    id: 'gb10',
    name: { en: 'Self-hosted inference', sq: 'Inferencë në serverat tanë' },
    status: 'in-use',
    stack: ['vLLM', 'NVIDIA GB10', 'Docker', 'Linux'],
    link: {
      href: 'https://github.com/ezekaj/gb10-inference',
      label: { en: 'Case study', sq: 'Rasti studimor' },
    },
    summary: {
      en: 'Two NVIDIA GB10 (DGX Spark) machines running vLLM: a 27B model with 128K context that serves my coding agent and internal tools. Client data stays on our own hardware and there is no per-token bill.',
      sq: 'Dy makina NVIDIA GB10 (DGX Spark) me vLLM: një model 27B me kontekst 128K që shërben agjentin tim të kodimit dhe mjetet e brendshme. Të dhënat e klientëve mbeten në hardware-in tonë dhe nuk ka faturë për çdo token.',
    },
  },
  {
    id: 'sofia',
    name: 'Sofia',
    status: 'on-hold',
    stack: ['Python', 'LiveKit Agents', 'Gemini Live', 'SIP'],
    link: {
      href: 'https://github.com/ezekaj/sofia-voice-agent',
      label: { en: 'Case study', sq: 'Rasti studimor' },
    },
    summary: {
      en: 'A phone voice agent for call-center first contact, with fail-closed guards: it discloses that it is an AI before the model speaks, honours “stop calling me” immediately and never collects health data. Built and tested; the pilot is on hold.',
      sq: 'Një agjent zanor telefonik për kontaktin e parë në call center, me mbrojtje që mbyllen në rast dyshimi: deklaron që është AI para se modeli të flasë, respekton menjëherë “mos më telefononi” dhe nuk mbledh kurrë të dhëna shëndetësore. I ndërtuar dhe i testuar; piloti është i pezulluar.',
    },
  },
];

export const REPOS: Repo[] = [
  {
    name: 'humanvad',
    lang: 'Python',
    summary: {
      en: 'Voice activity detection for real-time voice agents. The hard part isn’t the model, it’s knowing when the human has actually finished speaking.',
      sq: 'Zbulim i aktivitetit të zërit për agjentë zanorë në kohë reale. Pjesa e vështirë nuk është modeli, por të kuptosh kur njeriu ka mbaruar vërtet së foluri.',
    },
  },
  {
    name: 'elo-cli',
    lang: 'Go',
    summary: {
      en: 'Terminal AI coding agent in Go: an OpenCode fork with an Ollama provider, parallel subagents and a memory service.',
      sq: 'Agjent kodimi me AI në terminal, në Go: një fork i OpenCode me ofrues Ollama, nën-agjentë paralelë dhe shërbim memorieje.',
    },
  },
  {
    name: 'osm-business-audit',
    lang: 'Python',
    summary: {
      en: 'Async Python toolkit that discovers local businesses from OpenStreetMap and audits their web presence, with rate limiting, backoff and offline tests.',
      sq: 'Mjet asinkron në Python që gjen bizneset lokale nga OpenStreetMap dhe kontrollon praninë e tyre në web, me kufizim kërkesash, ritentime dhe teste offline.',
    },
  },
  {
    name: 'elo-agi',
    lang: 'Python',
    summary: {
      en: 'Research project on a neuroscience-inspired cognitive architecture: 38 modules, runs fully offline.',
      sq: 'Projekt kërkimor mbi një arkitekturë njohëse të frymëzuar nga neuroshkenca: 38 module, punon plotësisht offline.',
    },
  },
  {
    name: 'ft_irc',
    lang: 'C++',
    summary: {
      en: 'An IRC server written from scratch in C++98 at 42: channels, modes, operators and poll-based non-blocking I/O.',
      sq: 'Një server IRC i shkruar nga zero në C++98 në 42: kanale, mode, operatorë dhe I/O jo-bllokues me poll.',
    },
  },
];

export const STACK = ['Python', 'TypeScript', 'Go', 'C / C++', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Linux', 'Cloudflare', 'vLLM', 'LiveKit'];

type Dict = Record<string, string>;

const en: Dict = {
  'nav.home': 'Home',
  'nav.about': 'About',
  'nav.work': 'Work',
  'nav.oss': 'Open source',
  'nav.background': 'Background',
  'nav.contact': 'Contact',
  'nav.menu': 'Menu',
  'nav.close': 'Close',
  'nav.cv': 'CV',
  'nav.company': 'Z.E Digital Tech',
  'view.static': 'Simple view',
  'view.3d': '3D view',
  'scroll.hint': 'Scroll to fly through',

  'big.home': 'Elvi Zekaj',
  'big.about': 'About',
  'big.work': 'Build',
  'big.oss': 'Open source',
  'big.background': 'Origins',
  'big.contact': 'Contact',

  'hero.kicker': 'Tirana, Albania',
  'hero.name': 'Elvi Zekaj',
  'hero.role': 'Founder of Z.E Digital Tech · forward-deployed AI engineer',
  'hero.lede': 'I build AI and automation into real businesses, then stay and operate it.',
  'hero.company': 'Z.E Digital Tech → zedigital.tech',
  'hero.cv': 'Download CV (PDF)',
  'hero.contact': 'Get in touch',

  'about.title': 'About',
  'about.heading': 'Who I am',
  'about.p1': 'I go into a business, find the work that eats its time and money, and ship the AI and automation it runs on. Then I stay and operate it.',
  'about.p2': 'Some engagements are paid projects; the best ones are partnerships where I share in the results. The company behind this work is Z.E Digital Tech.',
  'how.title': 'How I work',
  'how.1': 'Diagnose: sit close to the operation and write down where time and money leak.',
  'how.2': 'Deploy: build and integrate into the tools the team already uses: CRM, ad accounts, phones, invoicing.',
  'how.3': 'Operate: keep it running, measure it, improve it, and package the reusable parts into product.',

  'work.title': 'What I build',
  'work.sub': 'Real projects, with their honest status.',
  'status.live': 'Live',
  'status.in-use': 'In use',
  'status.pilot': 'Pilot',
  'status.read-only': 'In use, read-only',
  'status.on-hold': 'Built & tested · pilot on hold',
  'work.private': 'Code is private (client work)',
  'work.inhouse': 'Internal infrastructure',

  'oss.title': 'Open source',
  'oss.sub': 'Public repositories on GitHub.',
  'oss.view': 'View on GitHub',

  'bg.title': 'Background',
  'bg.edu': 'Education',
  'bg.42': '42 Heilbronn (completed): peer-to-peer engineering school; C, C++, Unix, algorithms, networking.',
  'bg.umt': 'Universiteti Metropolitan Tirana (current): Computer Programming and Artificial Intelligence.',
  'bg.lang': 'Languages',
  'bg.langs': 'Albanian (native) · English (C2) · German (A2)',
  'bg.stack': 'Stack',

  'contact.title': 'Contact',
  'contact.lede': 'Open to forward-deployed engagements, automation projects and partnerships with agencies and businesses that want AI running in their operations, not just in a demo.',
  'contact.name': 'Your name',
  'contact.message': 'Message',
  'contact.placeholder': 'What are you working on?',
  'contact.email': 'Send by email',
  'contact.whatsapp': 'Send on WhatsApp',
  'contact.note': 'Opens your email app or WhatsApp with the message filled in. Nothing is sent from this site.',
  'contact.subject': 'Hello from ezekaj.github.io',
  'contact.from': 'From',
  'contact.direct': 'Or directly',

  'footer.company': 'Company site',
  'footer.built': 'Personal portfolio of Elvi Zekaj',
};

const sq: Dict = {
  'nav.home': 'Fillimi',
  'nav.about': 'Rreth meje',
  'nav.work': 'Punët',
  'nav.oss': 'Open source',
  'nav.background': 'Formimi',
  'nav.contact': 'Kontakt',
  'nav.menu': 'Menyja',
  'nav.close': 'Mbyll',
  'nav.cv': 'CV',
  'nav.company': 'Z.E Digital Tech',
  'view.static': 'Pamje e thjeshtë',
  'view.3d': 'Pamje 3D',
  'scroll.hint': 'Lëviz poshtë për të fluturuar',

  'big.home': 'Elvi Zekaj',
  'big.about': 'Rreth',
  'big.work': 'Ndërtoj',
  'big.oss': 'Open source',
  'big.background': 'Formimi',
  'big.contact': 'Kontakt',

  'hero.kicker': 'Tiranë, Shqipëri',
  'hero.name': 'Elvi Zekaj',
  'hero.role': 'Themelues i Z.E Digital Tech · inxhinier AI që punon brenda biznesit',
  'hero.lede': 'Fus AI dhe automatizim në biznese reale, pastaj qëndroj dhe i mbaj në punë.',
  'hero.company': 'Z.E Digital Tech → zedigital.tech',
  'hero.cv': 'Shkarko CV-në (PDF)',
  'hero.contact': 'Më kontakto',

  'about.title': 'Rreth meje',
  'about.heading': 'Kush jam',
  'about.p1': 'Hyj në një biznes, gjej punën që i ha kohë dhe para, dhe ndërtoj AI-në dhe automatizimin mbi të cilat punon. Pastaj qëndroj dhe i mbaj në punë.',
  'about.p2': 'Disa angazhime janë projekte me pagesë; më të mirat janë partneritete ku ndaj rezultatet. Kompania pas kësaj pune është Z.E Digital Tech.',
  'how.title': 'Si punoj',
  'how.1': 'Diagnostikoj: qëndroj pranë operacionit dhe shkruaj ku rrjedhin koha dhe paratë.',
  'how.2': 'Ndërtoj: e integroj në mjetet që ekipi përdor tashmë: CRM, llogaritë e reklamave, telefonat, faturimin.',
  'how.3': 'Operoj: e mbaj në punë, e mat, e përmirësoj dhe pjesët e ripërdorshme i kthej në produkt.',

  'work.title': 'Çfarë ndërtoj',
  'work.sub': 'Projekte reale, me statusin e tyre të vërtetë.',
  'status.live': 'Aktiv',
  'status.in-use': 'Në përdorim',
  'status.pilot': 'Pilot',
  'status.read-only': 'Në përdorim, vetëm lexim',
  'status.on-hold': 'I ndërtuar e testuar · piloti i pezulluar',
  'work.private': 'Kodi është privat (punë për klientë)',
  'work.inhouse': 'Infrastrukturë e brendshme',

  'oss.title': 'Open source',
  'oss.sub': 'Repozitorë publikë në GitHub.',
  'oss.view': 'Shiko në GitHub',

  'bg.title': 'Formimi',
  'bg.edu': 'Arsimi',
  'bg.42': '42 Heilbronn (e përfunduar): shkollë inxhinierie peer-to-peer; C, C++, Unix, algoritme, rrjete.',
  'bg.umt': 'Universiteti Metropolitan Tirana (aktualisht): Programim Kompjuterik dhe Inteligjencë Artificiale.',
  'bg.lang': 'Gjuhët',
  'bg.langs': 'Shqip (amtare) · Anglisht (C2) · Gjermanisht (A2)',
  'bg.stack': 'Teknologjitë',

  'contact.title': 'Kontakt',
  'contact.lede': 'I hapur për angazhime brenda biznesit, projekte automatizimi dhe partneritete me agjenci e biznese që duan AI që punon në operacionet e tyre, jo vetëm në një demo.',
  'contact.name': 'Emri juaj',
  'contact.message': 'Mesazhi',
  'contact.placeholder': 'Për çfarë po punoni?',
  'contact.email': 'Dërgo me email',
  'contact.whatsapp': 'Dërgo në WhatsApp',
  'contact.note': 'Hap aplikacionin e email-it ose WhatsApp me mesazhin të plotësuar. Asgjë nuk dërgohet nga kjo faqe.',
  'contact.subject': 'Përshëndetje nga ezekaj.github.io',
  'contact.from': 'Nga',
  'contact.direct': 'Ose direkt',

  'footer.company': 'Faqja e kompanisë',
  'footer.built': 'Portofoli personal i Elvi Zekaj',
};

export const DICT: Record<Lang, Dict> = { en, sq };
