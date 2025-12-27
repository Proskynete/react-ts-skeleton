import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./tests/setup/vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      exclude: [
        "node_modules/",
        "tests/",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "src/@shared/infrastructure/ui/", // Covered by E2E
        "src/**/pages/", // Covered by E2E
      ],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@contexts": path.resolve(__dirname, "./src/@contexts"),
      "@shared": path.resolve(__dirname, "./src/@shared"),
      "@app": path.resolve(__dirname, "./src/@app"),
    },
  },
});
