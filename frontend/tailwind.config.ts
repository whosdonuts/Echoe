import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Georgia', 'serif'],
        ui: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#F5F0EA',
        'background-warm': '#FCF8F2',
        surface: '#FFFDFC',
        'surface-muted': '#F4E9DE',
        text: '#2F2A27',
        'text-soft': '#756C66',
        'text-muted': '#A0948B',
        border: '#E3D8CC',
        accent: '#D96F5C',
        'echo-ink': '#201C1A',
        'echo-paper': '#FFFCF8',
        'echo-primary': '#DE805E',
        'tab-active': '#DE805E',
        'tab-inactive': '#74644C',
      },
    },
  },
  plugins: [],
};

export default config;
