import { createRequire } from "module";

const require = createRequire(import.meta.url);

const nextCwvConfig = require("eslint-config-next/core-web-vitals");
const nextTsConfig = require("eslint-config-next/typescript");

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "node_modules/**"],
  },
  ...nextCwvConfig,
  ...nextTsConfig,
];

export default eslintConfig;
