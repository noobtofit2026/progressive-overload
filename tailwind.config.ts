import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: "#16181A",
        surface: "#1F2225",
        surface2: "#26292D",
        chalk: "#EDEAE3",
        mute: "#9CA3A8",
        brass: "#C9A227",
        plateRed: "#C1443A",
        plateBlue: "#2E6E9E",
        plateYellow: "#D4A017",
        plateGreen: "#3F7D4F",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      borderRadius: {
        card: "10px",
      },
    },
  },
  plugins: [],
};
export default config;
