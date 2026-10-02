import { playwright } from "@vitest/browser-playwright";
import { readdirSync } from "node:fs";
import path from "node:path";
import { NodePackageImporter } from "sass";
import dts from "unplugin-dts/vite";
import { defineConfig } from 'vitest/config';
import pkg from "./package.json" with { type: "json" };

const lib = path.resolve(import.meta.dirname, "lib");

export default defineConfig({
  build: {
    lib: {
      entry: readdirSync(lib, { recursive: true }).map((f) => path.join(lib, f.toString())),
      formats: ["es"],
    },
    rolldownOptions: {
      external: Object.keys(pkg.peerDependencies ?? {}),
      output: {
        preserveModules: true,
        preserveModulesRoot: lib,
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [dts({ tsconfigPath: "tsconfig.lib.json" })],
  css: {
    preprocessorOptions: {
      scss: {
        importers: [new NodePackageImporter()],
        quietDeps: true,
        silenceDeprecations: ["import", "legacy-js-api"],
      },
    },
  },
  test: {
    setupFiles: ["./test/setup.ts"],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [{ browser: "chromium" }, { browser: "firefox" }, { browser: "webkit" }],
    },
    coverage: {
      enabled: true,
      provider: "istanbul",
      include: ["lib/**/*.ts"],
      thresholds: {
        100: true,
      },
    },
  },
});
