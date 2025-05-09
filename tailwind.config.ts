import type { Config } from "tailwindcss";
// @ts-expect-error - This is a valid import
import stardustPreset from "@multiverse-io/stardust/tailwind-preset.js";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@multiverse-io/stardust-react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        desktop: "768px",
      },
    },
  },
  presets: [stardustPreset],
};

export default config;
