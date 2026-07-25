import { createSeededRandom } from '@/utils/random';
import { MorphTargetKey } from '@/constants/chapters';

const EARTH_RADIUS = 3;

/** Evenly-distributed point on a sphere surface (Fibonacci sphere). */
const fibonacciSpherePoint = (i: number, count: number, radius: number): [number, number, number] => {
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (i / Math.max(count - 1, 1)) * 2;
  const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
  const theta = goldenAngle * i;
  return [Math.cos(theta) * radiusAtY * radius, y * radius, Math.sin(theta) * radiusAtY * radius];
};

/**
 * Precomputes one position array per named morph target. `MorphingParticleField`
 * blends between two of these arrays each frame based on scroll progress, so
 * the same particles seamlessly become the network, the Earth's surface, and
 * so on, rather than being replaced.
 */
export const buildMorphTargets = (count: number): Record<MorphTargetKey, Float32Array> => {
  const rand = createSeededRandom(42);

  const scattered = new Float32Array(count * 3);
  const networkSphere = new Float32Array(count * 3);
  const humanCluster = new Float32Array(count * 3);
  const earthReform = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Scattered (Ch1-2): random point within a sphere volume, emerging from darkness.
    const scatterRadius = 5 + rand() * 3;
    const scatterTheta = rand() * Math.PI * 2;
    const scatterPhi = Math.acos(2 * rand() - 1);
    scattered[i * 3] = scatterRadius * Math.sin(scatterPhi) * Math.cos(scatterTheta);
    scattered[i * 3 + 1] = scatterRadius * Math.sin(scatterPhi) * Math.sin(scatterTheta);
    scattered[i * 3 + 2] = scatterRadius * Math.cos(scatterPhi);

    // Network sphere (Ch3-7): even coverage over a shell just above the Earth's surface.
    const [nx, ny, nz] = fibonacciSpherePoint(i, count, EARTH_RADIUS * 1.08);
    networkSphere[i * 3] = nx;
    networkSphere[i * 3 + 1] = ny;
    networkSphere[i * 3 + 2] = nz;

    // Human cluster (Ch8): soft, compact sphere close to camera.
    const hRadius = 2 + rand() * 1.2;
    const hTheta = rand() * Math.PI * 2;
    const hPhi = Math.acos(2 * rand() - 1);
    humanCluster[i * 3] = hRadius * Math.sin(hPhi) * Math.cos(hTheta);
    humanCluster[i * 3 + 1] = hRadius * Math.sin(hPhi) * Math.sin(hTheta) * 0.6;
    humanCluster[i * 3 + 2] = hRadius * Math.cos(hPhi);

    // Earth reform (Ch9): same shell, slightly larger — reads as stronger, matured energy.
    const [ex, ey, ez] = fibonacciSpherePoint(i, count, EARTH_RADIUS * 1.15);
    earthReform[i * 3] = ex;
    earthReform[i * 3 + 1] = ey;
    earthReform[i * 3 + 2] = ez;
  }

  return { scattered, networkSphere, humanCluster, earthReform };
};
