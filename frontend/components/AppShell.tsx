'use client';

import { usePathname, useRouter } from 'next/navigation';
import { BottomTabBar, type TabKey } from '@/components/BottomTabBar';

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

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = TAB_ROUTES[pathname] ?? 'map';
  const routeTone = activeTab === 'echo' ? 'echo' : 'shell';

  function handleTabPress(tab: TabKey) {
    router.push(ROUTE_FOR_TAB[tab]);
  }

  return (
    <div className="app-stage">
      <div className="app-shell" data-route-tone={routeTone}>
        <div className="app-content">
          {children}
        </div>
        <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
        <div aria-hidden className="app-shell-overlays" id="app-shell-overlays" />
      </div>
    </div>
  );
}
