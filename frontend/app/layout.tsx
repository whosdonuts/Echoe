import type { Metadata } from 'next';
import { AppShell } from '@/components/AppShell';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Echo',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
