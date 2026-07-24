/**
 * chapters.ts
 *
 * Responsibility:
 * Single source of truth for the 9-chapter cinematic narrative. Every visual
 * system (particles, Earth, camera, network arcs, ecosystem nodes, city) and
 * every 2D text overlay derives its state from this configuration rather than
 * running its own scroll logic, so the whole experience stays choreographed
 * from one place. Ranges are fractions (0-1) of the total scroll distance
 * defined by TOTAL_SCROLL_VH in `scroll.ts`.
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

export type MorphTargetKey =
  | 'scattered'
  | 'networkSphere'
  | 'dissolvedToEcosystem'
  | 'humanCluster'
  | 'earthReform';

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
  networkArcs: boolean;
  ecosystemNodes: boolean;
  city: boolean;
}

export interface ChapterConfig {
  id: ChapterId;
  title: string;
  range: [number, number];
  camera: CameraWaypoint;
  morphTarget: MorphTargetKey;
  visibleSystems: VisibleSystems;
  text: string[];
}

const hidden: VisibleSystems = {
  particles: false,
  earth: false,
  satellites: false,
  networkArcs: false,
  ecosystemNodes: false,
  city: false,
};

export const CHAPTERS: ChapterConfig[] = [
  {
    id: 'signal',
    title: 'The Beginning',
    range: [0, 1 / 9],
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
    range: [1 / 9, 2 / 9],
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
    range: [2 / 9, 3 / 9],
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
    range: [3 / 9, 4 / 9],
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
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, networkArcs: true },
    text: ['From one nation...', '', 'to eight markets.', '', 'Connecting millions across', 'the Middle East and Africa.'],
  },
  {
    id: 'livingNetwork',
    title: 'The Living Network',
    range: [4 / 9, 5 / 9],
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
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, networkArcs: true },
    text: ['51.2 Million Customers', '9,000 Employees', 'Founded in 1983', 'Operations in Eight Countries'],
  },
  {
    id: 'transformation',
    title: 'Transformation into a TechCo',
    range: [5 / 9, 6 / 9],
    camera: {
      motion: 'linear',
      type: 'dive',
      // Departs Earth (still visible behind) and heads toward the
      // ecosystem core/nodes, which sit offset at z ≈ -10 rather than
      // overlapping Earth's own origin.
      startPosition: [6, 2, 6],
      endPosition: [0, 1, -6],
      startLookAt: [0, 0, 0],
      endLookAt: [0, 0, -9],
    },
    morphTarget: 'networkSphere',
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, networkArcs: true, ecosystemNodes: true },
    text: ['Beyond telecommunications.', '', 'Building', 'a technology ecosystem.'],
  },
  {
    id: 'innovation',
    title: 'Innovation',
    range: [6 / 9, 7 / 9],
    camera: {
      motion: 'linear',
      type: 'flythrough',
      // Continues straight on from transformation's end position/look-at —
      // flying past the ecosystem core into the city further out.
      startPosition: [0, 1, -6],
      endPosition: [0, 1, -16],
      startLookAt: [0, 0, -9],
      endLookAt: [0, 0, -24],
    },
    morphTarget: 'networkSphere',
    visibleSystems: {
      ...hidden,
      particles: true,
      earth: true,
      satellites: true,
      networkArcs: true,
      ecosystemNodes: true,
      city: true,
    },
    text: ['Artificial Intelligence', 'Cloud', 'Enterprise', 'Cybersecurity', 'Fintech', 'Gaming', 'Digital Infrastructure'],
  },
  {
    id: 'humanImpact',
    title: 'Human Impact',
    range: [7 / 9, 8 / 9],
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
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, networkArcs: true },
    text: ['Inclusion', 'Sustainability', 'Women in Tech', 'Youth', 'Diversity', 'Community'],
  },
  {
    id: 'purpose',
    title: 'Progress with Purpose',
    range: [8 / 9, 1],
    camera: {
      motion: 'linear',
      type: 'pullback',
      startPosition: [0, 0, 4],
      endPosition: [0, 0, 14],
      startLookAt: [0, 0, 0],
      endLookAt: [0, 0, 0],
    },
    morphTarget: 'earthReform',
    visibleSystems: { ...hidden, particles: true, earth: true, satellites: true, networkArcs: true },
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

/** Zain's technology-ecosystem businesses, orbiting the core in Chapter 6/7. */
export const ECOSYSTEM_NODES = ['ZainTECH', 'ZOI', 'TASC Towers', 'BEDE', 'Tamam', 'Dizlee', 'Yaqoot', 'Oodi'] as const;
