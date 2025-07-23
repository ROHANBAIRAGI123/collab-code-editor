// client/eslint.config.mjs
import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
// other imports...

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

// The default export MUST be an array
export default [
  // Use the spread operator '...' inside the array
  ...compat.extends("next/core-web-vitals"),

  // Add your own rules as another object in the array
  {
    rules: {
      // your custom rules here
    },
  },
];