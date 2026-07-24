import { createSeededRandom } from '@/utils/random';
import { ECOSYSTEM_NODES, MorphTargetKey } from '@/constants/chapters';

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
 * blends between two of these arrays each frame based on scroll progress,
 * so the same particles seamlessly become the network, the Earth's surface,
 * the ecosystem clusters, and so on, rather than being replaced.
 */
export const buildMorphTargets = (count: number): Record<MorphTargetKey, Float32Array> => {
  const rand = createSeededRandom(42);

  const scattered = new Float32Array(count * 3);
  const networkSphere = new Float32Array(count * 3);
  const dissolvedToEcosystem = new Float32Array(count * 3);
  const humanCluster = new Float32Array(count * 3);
  const earthReform = new Float32Array(count * 3);

  // 8 ecosystem node cluster centers arranged in a ring around a central core.
  const nodeCenters: [number, number, number][] = ECOSYSTEM_NODES.map((_, i) => {
    const angle = (i / ECOSYSTEM_NODES.length) * Math.PI * 2;
    return [Math.cos(angle) * 4, Math.sin(i * 1.3) * 1.2, Math.sin(angle) * 4];
  });

  for (let i = 0; i < count; i++) {
    // Scattered (Ch1-2): random point within a sphere volume, emerging from darkness.
    const scatterRadius = 5 + rand() * 3;
    const scatterTheta = rand() * Math.PI * 2;
    const scatterPhi = Math.acos(2 * rand() - 1);
    scattered[i * 3] = scatterRadius * Math.sin(scatterPhi) * Math.cos(scatterTheta);
    scattered[i * 3 + 1] = scatterRadius * Math.sin(scatterPhi) * Math.sin(scatterTheta);
    scattered[i * 3 + 2] = scatterRadius * Math.cos(scatterPhi);

    // Network sphere (Ch3-5): even coverage over a shell just above the Earth's surface.
    const [nx, ny, nz] = fibonacciSpherePoint(i, count, EARTH_RADIUS * 1.08);
    networkSphere[i * 3] = nx;
    networkSphere[i * 3 + 1] = ny;
    networkSphere[i * 3 + 2] = nz;

    // Dissolved to ecosystem (Ch6-7): clustered around the core or one of 8 nodes.
    const clusterIndex = i % (nodeCenters.length + 1);
    const center: [number, number, number] = clusterIndex === 0 ? [0, 0, 0] : nodeCenters[clusterIndex - 1];
    const jitter = 0.6;
    dissolvedToEcosystem[i * 3] = center[0] + (rand() - 0.5) * jitter * 2;
    dissolvedToEcosystem[i * 3 + 1] = center[1] + (rand() - 0.5) * jitter * 2;
    dissolvedToEcosystem[i * 3 + 2] = center[2] + (rand() - 0.5) * jitter * 2;

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

  return { scattered, networkSphere, dissolvedToEcosystem, humanCluster, earthReform };
};
