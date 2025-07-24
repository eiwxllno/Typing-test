import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(59 130 246)",
        success: "rgb(16 185 129)",
        error: "rgb(239 68 68)",
      },
    },
  },
} satisfies Config;
