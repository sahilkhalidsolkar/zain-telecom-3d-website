/**
 * random.ts
 *
 * Responsibility:
 * Deterministic pseudo-random number generation for procedural geometry
 * (particle fields, layouts). Used instead of Math.random() so the same
 * seed always produces the same layout across renders/reloads, and so the
 * generation itself stays a pure function (Math.random is flagged as impure
 * by the project's React Compiler lint rules if called during render).
 */
export const createSeededRandom = (seed: number) => {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;

  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
};
