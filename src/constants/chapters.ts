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
    text: ['Every connection', 'begins with a signal.', '', '1983', 'The beginning of something extraordinary.'],
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
      { title: 'Kuwait', body: 'Est. 1983 — the region’s first mobile operator.' },
      { title: 'Bahrain', body: 'Expanding the network across the Gulf.' },
      { title: 'Jordan', body: 'Connecting the Levant.' },
      { title: 'Iraq', body: 'Serving one of the region’s largest markets.' },
      { title: 'Saudi Arabia', body: 'Reaching the Kingdom’s growing digital economy.' },
      { title: 'Sudan', body: 'Bringing connectivity to East Africa.' },
      { title: 'South Sudan', body: 'Extending the network further south.' },
      { title: 'Morocco', body: 'Completing the reach across North Africa.' },
      { title: '8 Markets. One Network.', body: 'Connecting millions across the Middle East and Africa.' },
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
    text: ['51.2 Million Customers', '9,000 Employees', 'Founded in 1983', 'Operations in Eight Countries'],
    cards: [
      { title: '51.2M', body: 'Total Active Customers' },
      { title: '9,000+', body: 'Employees Across the Region' },
      { title: '1983', body: 'Founded in Kuwait' },
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
    text: ['Beyond telecommunications.', '', 'Building', 'a technology ecosystem.'],
    // Descriptors are inferred from the brand names, not confirmed by the
    // zain.com crawl (docs/zain-content/) — flagged for fact-check before
    // this ships anywhere public-facing.
    cards: [
      { title: 'ZainTECH', body: 'Digital & ICT solutions for enterprise.' },
      { title: 'ZOI', body: 'Zain Omantel International — wholesale & roaming.' },
      { title: 'TASC Towers', body: 'Telecom tower infrastructure.' },
      { title: 'Dizlee', body: 'Fintech & digital payments.' },
      { title: 'Zain Esports', body: 'Gaming & esports ecosystem.' },
      { title: 'ZAINIAC', body: 'AI & innovation lab.' },
      { title: 'Global M2M', body: 'IoT & machine-to-machine connectivity.' },
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
    text: ['Artificial Intelligence', 'Cloud', 'Enterprise', 'Cybersecurity', 'Fintech', 'Gaming', 'Digital Infrastructure'],
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
    text: ['Inclusion', 'Sustainability', 'Women in Tech', 'Youth', 'Diversity', 'Community'],
    cards: [
      { title: 'WE', body: 'Empowering women across every market.' },
      { title: 'ZY — Zain Youth', body: 'Investing in the next generation.' },
      { title: 'WE ABLE', body: 'Building disability inclusion by 2030.' },
      { title: 'BE WELL', body: 'Employee wellbeing & work-life balance.' },
      { title: 'IDEU', body: 'Inclusion, Diversity & Equity University.' },
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
    text: ['Progress with Purpose.', '', 'Powering progress.', 'Enabling possibilities.', 'Connecting communities.'],
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
