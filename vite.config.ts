import path from "node:path";
import dts from "unplugin-dts/vite";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, "lib/index.ts"),
      fileName: "index",
      formats: ["es"],
    },
  },
  plugins: [dts({ bundleTypes: true, tsconfigPath: "tsconfig.lib.json" })],
});
