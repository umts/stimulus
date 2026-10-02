import { defineConfig } from "oxlint";

export default defineConfig({
  $schema: "./node_modules/oxlint/configuration_schema.json",
  plugins: ["eslint", "typescript", "unicorn", "react", "react-perf", "oxc", "import", "promise"],
  categories: {
    correctness: "error",
    suspicious: "warn",
    pedantic: "warn",
    perf: "error",
    restriction: "error",
  },
  rules: {
    "import/no-default-export": "off",
  },
});
