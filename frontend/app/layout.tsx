import type { Metadata } from 'next';
import { Nunito, Quicksand } from 'next/font/google';
import { AppShell } from '@/components/AppShell';
import '@/styles/globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Echo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${nunito.variable} ${quicksand.variable}`} lang="en">
      <head>
        <meta
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
          name="viewport"
        />
      </head>
      {/* suppressHydrationWarning handles browser extensions (e.g. Grammarly) that
          inject data-* attributes onto <body> before React hydrates. */}
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
