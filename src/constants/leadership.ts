/**
 * leadership.ts
 *
 * Responsibility:
 * Single source of truth for all named individuals found in the scraped
 * zain.com content (docs/zain-content/). Quotes are verbatim from press
 * releases and official statements. Used exclusively by the Footer's
 * Leadership section — no 3D system reads this.
 */

export type LeadershipTab = 'leadership' | 'board' | 'markets';

export interface Leader {
  name: string;
  title: string;
  /** Short pull-quote from a press release or official statement. */
  quote?: string;
  /** Two-letter ISO country code for the market CEO tab. */
  market?: string;
}

// ── C-Suite / Group Leadership ─────────────────────────────────────────────
export const CSUITE: Leader[] = [
  {
    name: 'Mrs. Nour Al-Jassim',
    title: 'Chair of the Board — Zain Group',
    quote:
      'The Board will build on this solid foundation, enhance strategic partnerships and continue to deliver sustainable value for our shareholders.',
  },
  {
    name: 'Mr. Bader Al-Kharafi',
    title: 'Vice-Chairman & Group CEO — Zain Group',
    quote:
      'This strong momentum behind the Group\'s 4WARD–Progress with Purpose strategy signals an exceptional year ahead.',
  },
  {
    name: 'Jennifer Suleiman',
    title: 'Chief Sustainability Officer — Zain Group',
    quote:
      'The role of corporations in addressing growing humanitarian needs is central to our 4WARD strategy.',
  },
  {
    name: 'Dr. Andrew Arowojolu',
    title: 'Group Chief Regulatory Officer — Zain Group',
    quote:
      'This learning initiative strengthens governance, alignment, and sustainable growth through capability-building our teams with globally informed expertise.',
  },
  {
    name: 'Hisham Allam',
    title: 'Chief Technology Officer — Zain Group',
    quote:
      'As a leading 5.5G operator, we are always working to ensure we are first to market with new innovations for our customers.',
  },
];

// ── Board of Directors & Committee Members ─────────────────────────────────
export const BOARD: Leader[] = [
  { name: 'Dr. Saad Ahmed Al Nahedh', title: 'Committee Chairman' },
  { name: 'Mr. Nasser Suleiman Al Harthy', title: 'Committee Chairman' },
  { name: 'Mr. Aladdin Baitfadhil', title: 'Committee Chairman' },
  { name: 'Mr. Abdulrahman Mohammad Al Asfour', title: 'Board Member' },
  { name: 'Mr. Mishari Asi Al Hajri', title: 'Board Member' },
  { name: 'Mr. Ghassan Khamees Al Hashar', title: 'Board Member' },
  { name: 'Mr. Ibrahim Said Al Eisri', title: 'Board Member' },
  { name: 'Mr. Atif Said Al Siyabi', title: 'Board Member' },
  { name: 'Mr. Bader Nasser Al Kharafi', title: 'Board Member' },
  { name: 'Mrs. Nour Nael Al Jassim', title: 'Board Member' },
];

// ── Market / Country CEOs ───────────────────────────────────────────────────
export const MARKET_CEOS: Leader[] = [
  {
    name: 'Nawaf Al-Gharabally',
    title: 'CEO — Zain Kuwait',
    market: 'KW',
    quote:
      'We remain committed to using our regional reach and digital capabilities to support communities in times of need.',
  },
  {
    name: 'Eng. Saad AlSadhan',
    title: 'CEO — Zain Saudi Arabia',
    market: 'SA',
    quote:
      'We have strengthened our position as a leading provider of innovative digital services, driven by a well-defined strategy.',
  },
];

// ── IDE Program Champions ───────────────────────────────────────────────────
export const IDE_CHAMPIONS: Leader[] = [
  { name: 'Ayah AlBahar', title: 'IDE Champion — Zain Group' },
  { name: 'Dalal AlAjmi', title: 'IDE Champion — Zain Group' },
  { name: 'Noura AlAyoub', title: 'IDE Champion — Zain Group' },
  { name: 'Sami AlQaddoumi', title: 'IDE Champion — Zain Group' },
  { name: 'Sarah AlAwwad', title: 'IDE Champion — Zain Group' },
];
