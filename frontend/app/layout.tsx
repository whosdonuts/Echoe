'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomTabBar, type TabKey } from '@/components/BottomTabBar';
import '@/styles/globals.css';
import { colors } from '@/lib/theme/colors';

const TAB_ROUTES: Record<string, TabKey> = {
  '/discover': 'map',
  '/echo': 'echo',
  '/social': 'create',
  '/explore': 'explore',
  '/profile': 'profile',
};

const ROUTE_FOR_TAB: Record<TabKey, string> = {
  map: '/discover',
  echo: '/echo',
  create: '/social',
  explore: '/explore',
  profile: '/profile',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = TAB_ROUTES[pathname] ?? 'map';

  function handleTabPress(tab: TabKey) {
    router.push(ROUTE_FOR_TAB[tab]);
  }

  return (
    <html lang="en">
      <head>
        <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport" />
        <title>Echo</title>
      </head>
      <body
        style={{
          background: `linear-gradient(135deg, ${colors.backgroundWarm}, ${colors.background})`,
          minHeight: '100dvh',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100dvh',
            maxWidth: 480,
            margin: '0 auto',
            position: 'relative',
            backgroundColor: colors.background,
            overflow: 'hidden',
          }}
        >
          {/* Screen content */}
          <div
            style={{
              flex: 1,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {children}
          </div>

          {/* Bottom Tab Bar */}
          <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
        </div>
      </body>
    </html>
  );
}
