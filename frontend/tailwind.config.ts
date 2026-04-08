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
        display: ['var(--font-quicksand)', 'var(--font-nunito)', 'system-ui', 'sans-serif'],
        ui: ['var(--font-nunito)', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#F3F6FB',
        'background-warm': '#F8FAFE',
        surface: '#FEFEFF',
        'surface-muted': '#EEF3F8',
        text: '#202733',
        'text-soft': '#5F6C7D',
        'text-muted': '#8C97A7',
        border: '#E1E4E8',
        accent: '#6B88B0',
        'echo-ink': '#201C1A',
        'echo-paper': '#FFFCF8',
        'echo-primary': '#DE805E',
        'tab-active': '#5F7DA5',
        'tab-inactive': '#56677F',
      },
    },
  },
  plugins: [],
};

export default config;
