import { defineConfig } from "vitepress";

export default defineConfig({
  base: "./",
  title: "umts-stimulus",
  description: "Stimulus controllers for UMTS rails apps.",
  themeConfig: {
    search: { provider: "local" },
    nav: [],
    sidebar: [
      {
        text: "Setup",
        items: [{ text: "Installation", link: "/installation" }],
      },
      {
        text: "Reference",
        items: [{ text: "Controllers", link: "/controllers" }],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/umts/stimulus" }],
  },
});
