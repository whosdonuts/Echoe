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
        background: '#F8F8F6',
        'background-warm': '#FCFCFA',
        surface: '#FEFEFD',
        'surface-muted': '#F3F4F4',
        text: '#202733',
        'text-soft': '#5F6C7D',
        'text-muted': '#8C97A7',
        border: '#E1E4E8',
        accent: '#6E86A7',
        'echo-ink': '#201C1A',
        'echo-paper': '#FFFCF8',
        'echo-primary': '#DE805E',
        'tab-active': '#6B82A2',
        'tab-inactive': '#5A6777',
      },
    },
  },
  plugins: [],
};

export default config;
