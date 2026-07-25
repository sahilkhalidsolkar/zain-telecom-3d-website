/**
 * chapters.ts
 *
 * Responsibility:
 * Single source of truth for the 9-chapter cinematic narrative. Every visual
 * system (particles, Earth, camera, country beacons, satellites) and every 2D
 * text overlay derives its state from this configuration rather than
 * running its own scroll logic, so the whole experience stays choreographed
 * from one place. Ranges are fractions (0-1) of the total scroll distance
 * defined by TOTAL_SCROLL_VH in `scroll.ts`. Ranges are deliberately uneven,
 * not equal ninths — chapters with more glassmorphism cards to cycle through
 * (see `cards` below) get proportionally more scroll distance so each card
 * has room to actually be read before the next one replaces it.
 */

export type ChapterId =
  | 'signal'
  | 'birth'
  | 'earth'
  | 'expansion'
  | 'livingNetwork'
  | 'transformation'
  | 'innovation'
  | 'humanImpact'
  | 'purpose';

export type MorphTargetKey = 'scattered' | 'networkSphere' | 'humanCluster' | 'earthReform';

export type CameraMoveType =
  | 'dolly'
  | 'orbit'
  | 'zoom'
  | 'dive'
  | 'flythrough'
  | 'circle'
  | 'pullback';

/**
 * `motion` is the actual discriminant (must be a single literal per member
 * for TypeScript's discriminated-union narrowing to work); `type` is kept
 * alongside purely as documentation of the specific cinematic language used
 * (dolly/zoom/dive/flythrough vs. orbit/circle) per the brief.
 */
interface StraightCameraMove {
  motion: 'linear';
  type: 'dolly' | 'zoom' | 'dive' | 'flythrough' | 'pullback';
  startPosition: [number, number, number];
  endPosition: [number, number, number];
  startLookAt: [number, number, number];
  endLookAt: [number, number, number];
}

interface OrbitCameraMove {
  motion: 'orbital';
  type: 'orbit' | 'circle';
  radius: number;
  height: number;
  startAngleDeg: number;
  endAngleDeg: number;
  lookAt: [number, number, number];
}

export type CameraWaypoint = StraightCameraMove | OrbitCameraMove;

export interface VisibleSystems {
  particles: boolean;
  earth: boolean;
  satellites: boolean;
  countryBeacons: boolean;
}

export interface ChapterCard {
  title: string;
  body: string;
}

export interface ChapterConfig {
  id: ChapterId;
  title: string;
  range: [number, number];
  camera: CameraWaypoint;
  morphTarget: MorphTargetKey;
  visibleSystems: VisibleSystems;
  text: string[];
  /**
   * Glassmorphism data cards (rendered by `ChapterCards`), cycling one at a
   * time as local scroll progress advances. Only populated for chapters with
   * real structured data to show (countries, stats, ecosystem brands, DEI
   * programs) — deliberately omitted elsewhere so cards read as a deliberate
   * device, not a template applied everywhere.
   */
  cards?: ChapterCard[];
}

const hidden: VisibleSystems = {
  particles: false,
  earth: false,
  satellites: false,
  countryBeacons: false,
};

export const CHAPTERS: ChapterConfig[] = [
  {
    id: 'signal',
    title: 'The Beginning',
    range: [0, 2 / 23],
    camera: {
      motion: 'linear',
      type: 'dolly',
      startPosition: [0, 0, 8],
      endPosition: [0, 0, 4],
      startLookAt: [0, 0, 0],
      endLookAt: [0, 0, 0],
    },
    morphTarget: 'scattered',
    visibleSystems: { ...hidden, particles: true },
    text: ['Every connection', 'begins with a signal.', '', 'Kuwait. 1983.', 'The region\'s first mobile operator.'],
  },
  {
    id: 'birth',
    title: 'Birth of Connectivity',
    range: [2 / 23, 4 / 23],
    camera: {
      motion: 'orbital',
      type: 'orbit',
      radius: 5,
      height: 0.5,
      startAngleDeg: 0,
      endAngleDeg: 50,
      lookAt: [0, 0, 0],
    },
    morphTarget: 'scattered',
    visibleSystems: { ...hidden, particles: true },
    text: ['One signal.', '', 'One vision.', '', 'One network.'],
  },
  {
    id: 'earth',
    title: 'Earth Emerges',
    range: [4 / 23, 6 / 23],
    camera: {
      motion: 'orbital',
      type: 'orbit',
      radius: 6,
      height: 1,
      startAngleDeg: 50,
      endAngleDeg: 90,
      lookAt: [0, 0, 0],
    },
    morphTarget: 'networkSphere',
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true },
    text: ['Connecting people.', '', 'Connecting nations.', '', 'Connecting possibilities.'],
  },
  {
    id: 'expansion',
    title: 'Expansion Across the Region',
    range: [6 / 23, 10 / 23],
    camera: {
      motion: 'orbital',
      type: 'orbit',
      radius: 6.5,
      height: 1.2,
      startAngleDeg: 90,
      endAngleDeg: 210,
      lookAt: [0, 0, 0],
    },
    morphTarget: 'networkSphere',
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, countryBeacons: true },
    text: ['From one nation...', '', 'to eight markets.', '', 'Connecting millions across', 'the Middle East and Africa.'],
    cards: [
      { title: 'Kuwait', body: 'Est. 1983 — the region\'s first mobile operator. 2.6M customers.' },
      { title: 'Bahrain', body: 'Gulf connectivity hub. 45% of revenue from data services.' },
      { title: 'Jordan', body: '4.2M customers. 5G driving 58% data revenue share.' },
      { title: 'Iraq', body: '20.7M customers — Zain\'s largest market.' },
      { title: 'Saudi Arabia', body: '8.3M customers. 5G leader across the Kingdom.' },
      { title: 'Sudan', body: '12.4M customers. Data revenue up 70% YoY.' },
      { title: 'South Sudan', body: 'Extending connectivity to one of Africa\'s newest nations.' },
      { title: 'Morocco', body: '15.5% stake in INWI — reaching North Africa.' },
      { title: '8 Markets. One Network.', body: 'Connecting 51.2 million people across the Middle East and Africa.' },
    ],
  },
  {
    id: 'livingNetwork',
    title: 'The Living Network',
    range: [10 / 23, 13 / 23],
    camera: {
      motion: 'orbital',
      type: 'orbit',
      radius: 7,
      height: 1.5,
      startAngleDeg: 210,
      endAngleDeg: 260,
      lookAt: [0, 0, 0],
    },
    morphTarget: 'networkSphere',
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, countryBeacons: true },
    text: ['USD 1.86 Billion in Revenue', '51.2 Million Customers', 'Net Income at a 15-Year High', 'Top 25 Telecom Brand Globally'],
    cards: [
      { title: '51.2M', body: 'Total Active Customers as of Q1 2026' },
      { title: '9,000+', body: 'Employees Across the Region' },
      { title: 'USD 1.86B', body: 'Q1 2026 Revenue — up 6% YoY' },
      { title: 'USD 260M', body: 'Q1 Net Income — a 15-year high, up 51% YoY' },
      { title: '32%', body: 'EBITDA Margin' },
      { title: 'USD 4B', body: 'Brand Value — #1 in Kuwait\'s private sector, top 25 globally' },
      { title: '8', body: 'Markets Across the Middle East & Africa' },
    ],
  },
  {
    id: 'transformation',
    title: 'Transformation into a TechCo',
    range: [13 / 23, 16 / 23],
    camera: {
      motion: 'orbital',
      type: 'orbit',
      // Continues the same Earth orbit from livingNetwork's end angle (260°)
      // rather than diving toward a 3D ecosystem/city that no longer exists
      // — Earth and the network stay the visual focus; the 7 ecosystem
      // brands are carried entirely by the glassmorphism cards below.
      radius: 7.5,
      height: 1.8,
      startAngleDeg: 260,
      endAngleDeg: 310,
      lookAt: [0, 0, 0],
    },
    morphTarget: 'networkSphere',
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, countryBeacons: true },
    text: ['Beyond telecommunications.', '', 'The 4WARD strategy.', 'A TechCo for the region.'],
    // All brand descriptors verified against the zain.com crawl (docs/zain-content/)
    // specifically: pages/00_en.md brand nav + pages/34_en_press-release_zaingroup2026-q1.md
    cards: [
      { title: 'ZainTECH', body: 'Enterprise & government ICT solutions across MENA. Revenue up 7% YoY.' },
      { title: 'ZOI', body: 'International wholesale carrier & roaming powerhouse. Revenue up 16% YoY.' },
      { title: 'TASC Towers', body: 'Tower infrastructure. Largest TowerCo in region (with Ooredoo).' },
      { title: 'Dizlee', body: 'Digital payments & fintech services.' },
      { title: 'Zain Esports', body: 'MENA esports platform. PUBG MOBILE championship across 7 countries.' },
      { title: 'ZAINIAC', body: 'AI & innovation lab powering next-generation solutions.' },
      { title: 'Global M2M', body: 'IoT & machine-to-machine connectivity at scale.' },
      { title: 'Zain Ventures', body: 'Strategic investments in Revolut, SpaceX & xAI. USD 123M gains in Q1 2026.' },
    ],
  },
  {
    id: 'innovation',
    title: 'Innovation',
    range: [16 / 23, 18 / 23],
    camera: {
      motion: 'orbital',
      type: 'orbit',
      // Continues the orbit from transformation's end angle (310°) — no 3D
      // city; the AI/Cloud/etc. keywords are 2D text only.
      radius: 8,
      height: 2,
      startAngleDeg: 310,
      endAngleDeg: 360,
      lookAt: [0, 0, 0],
    },
    morphTarget: 'networkSphere',
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, countryBeacons: true },
    text: ['Data revenue: 40% of total.', 'Fintech: 28% growth.', '5G: Active across 4 markets.', 'AI-driven solutions.'],
    cards: [
      { title: '5.5G', body: 'Kuwait\'s advanced network — first in the region.' },
      { title: '5G', body: 'Active in Kuwait, KSA, Bahrain & Jordan.' },
      { title: '40%', body: 'Share of revenue from data services.' },
      { title: '28%', body: 'Fintech revenue growth across markets.' },
      { title: '12%', body: 'Revenue from new growth verticals.' },
      { title: 'AI-Driven', body: 'ZAINIAC powering enterprise AI solutions across the region.' },
    ],
  },
  {
    id: 'humanImpact',
    title: 'Human Impact',
    range: [18 / 23, 21 / 23],
    camera: {
      motion: 'orbital',
      type: 'circle',
      radius: 4,
      height: 0.5,
      startAngleDeg: 0,
      endAngleDeg: 30,
      lookAt: [0, 0, 0],
    },
    morphTarget: 'humanCluster',
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, countryBeacons: true },
    text: ['Better Lives.', 'Lasting Connections.', 'Empowering 9,000+ Zainers.', 'Communities in 8 nations.'],
    cards: [
      { title: 'WE', body: '30% women in leadership by 2030. Launched 2017. Includes WE STEM, WE COACH & WE SUCCEED.' },
      { title: 'ZY — Zain Youth', body: 'Since 2018. All employees under 30. Built by the youth, for the future of work.' },
      { title: 'WE ABLE', body: 'Disability inclusion since 2019. WE ABLE 2030 vision. ILO & Valuable 500 partner.' },
      { title: 'BE WELL', body: 'Mental health & wellness since 2021. Four M\'s: Mental Health, Movement, Mindfulness, Me.' },
      { title: 'IDEU', body: 'IE University (Spain) partnership. 2,000 Zainers enrolled in an MBA-pathway digital transformation program.' },
      { title: 'Child Online Safety', body: 'Protecting children\'s digital experience across all 8 markets.' },
      { title: 'Forbes Best Employer', body: '#1 in regional telecom sector — World\'s Best Employers 2025.' },
    ],
  },
  {
    id: 'purpose',
    title: 'Progress with Purpose',
    range: [21 / 23, 1],
    camera: {
      motion: 'linear',
      type: 'pullback',
      startPosition: [0, 0, 4],
      endPosition: [0, 0, 14],
      startLookAt: [0, 0, 0],
      endLookAt: [0, 0, 0],
    },
    morphTarget: 'earthReform',
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, countryBeacons: true },
    text: ['Progress with Purpose.', '', 'Powering progress.', 'Enabling possibilities.', 'Connecting communities.', '', 'USD 4 Billion brand. 51.2 Million lives.'],
    cards: [
      { title: '4WARD', body: 'Progress with Purpose — Zain\'s strategy for a connected, sustainable future.' },
      { title: 'CDP \'A\' Score', body: 'Only Kuwait-based company at global leadership level in climate disclosure.' },
      { title: '26M Followers', body: 'One of the region\'s most recognized and engaging corporate brands.' },
    ],
  },
];

/** 8 markets Zain operates in, in the order they light up during Chapter 4. */
export const EXPANSION_COUNTRIES = [
  { name: 'Kuwait', lat: 29.3759, lon: 47.9774 },
  { name: 'Bahrain', lat: 26.0667, lon: 50.5577 },
  { name: 'Jordan', lat: 31.9454, lon: 35.9284 },
  { name: 'Iraq', lat: 33.3152, lon: 44.3661 },
  { name: 'Saudi Arabia', lat: 24.7136, lon: 46.6753 },
  { name: 'Sudan', lat: 15.5007, lon: 32.5599 },
  { name: 'South Sudan', lat: 4.8517, lon: 31.5825 },
  { name: 'Morocco', lat: 33.9716, lon: -6.8498 },
] as const;

/**
 * Looks up where a chapter starts (as a global scroll-progress fraction).
 * Other systems that need to key off a specific chapter boundary (particle
 * morph keyframes, Earth's fade-in, the Human Impact lighting shift) should
 * call this instead of hardcoding the fraction directly — chapter `range`s
 * are intentionally uneven (card-heavy chapters get more scroll distance so
 * their cards don't cycle too fast), so a hardcoded copy of a boundary will
 * silently drift out of sync the next time ranges are rebalanced.
 */
export const getChapterStart = (id: ChapterId): number => {
  const chapter = CHAPTERS.find((c) => c.id === id);
  if (!chapter) throw new Error(`Unknown chapter id: ${id}`);
  return chapter.range[0];
};
