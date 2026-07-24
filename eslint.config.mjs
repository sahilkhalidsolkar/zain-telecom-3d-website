import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    // React Compiler's render-purity rules (react-hooks/refs,
    // react-hooks/immutability, react-hooks/purity) assume components are
    // pure functions of props/state. Code under src/three/ is imperative
    // Three.js/R3F: mutating uniforms, instance matrices, and material refs
    // every frame inside useFrame is the correct, standard pattern for this
    // ecosystem, not a bug the rules are meant to catch.
    files: ["src/three/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/purity": "off",
    },
  },
]);

export default eslintConfig;
