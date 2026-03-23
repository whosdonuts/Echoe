'use client';

import { Map, Radio, Users, Compass, User } from 'lucide-react';
import { colors } from '@/lib/theme/colors';

export type TabKey = 'map' | 'echo' | 'create' | 'explore' | 'profile';

export type TabDefinition = {
  key: TabKey;
  label: string;
  icon: TabKey;
  href: string;
};

export const tabs: TabDefinition[] = [
  { key: 'map', label: 'Discover', icon: 'map', href: '/discover' },
  { key: 'echo', label: 'Echo', icon: 'echo', href: '/echo' },
  { key: 'create', label: 'Social', icon: 'create', href: '/social' },
  { key: 'explore', label: 'Explore', icon: 'explore', href: '/explore' },
  { key: 'profile', label: 'Profile', icon: 'profile', href: '/profile' },
];

type TabIconProps = { icon: TabKey; active: boolean };

function TabIcon({ icon, active }: TabIconProps) {
  const color = active ? colors.tabBarActiveText : colors.tabBarInactive;
  const size = 20;
  const props = { color, size, strokeWidth: active ? 2.2 : 1.8 };

  switch (icon) {
    case 'map': return <Map {...props} />;
    case 'echo': return <Radio {...props} />;
    case 'create': return <Users {...props} />;
    case 'explore': return <Compass {...props} />;
    case 'profile': return <User {...props} />;
  }
}

type BottomTabBarProps = {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
};

export function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.echoMainWhite,
        borderTop: `1px solid ${colors.tabBarBorder}`,
        backdropFilter: 'blur(18px) saturate(155%)',
        WebkitBackdropFilter: 'blur(18px) saturate(155%)',
        boxShadow: '0 -10px 26px rgba(86, 33, 13, 0.06)',
        paddingTop: 7,
        paddingBottom: 14,
        paddingLeft: 6,
        paddingRight: 6,
        zIndex: 100,
      }}
    >
      {/* Top highlight line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 1,
          backgroundColor: colors.tabBarHighlight,
          pointerEvents: 'none',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {tabs.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              aria-label={tab.label}
              aria-pressed={active}
              onClick={() => onTabPress(tab.key)}
              style={{
                flex: 1,
                minHeight: 54,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: 2,
                paddingRight: 2,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {active ? (
                <div
                  style={{
                    minHeight: 48,
                    borderRadius: 14,
                    border: '1px solid rgba(255, 255, 255, 0.22)',
                    paddingLeft: 4,
                    paddingRight: 4,
                    paddingTop: 5,
                    paddingBottom: 5,
                    overflow: 'hidden',
                    background: `linear-gradient(to bottom right, ${colors.tabBarActive}, ${colors.tabBarActiveDeep})`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {/* Sheen line */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 8,
                      right: 8,
                      top: 0,
                      height: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.42)',
                    }}
                  />
                  <TabIcon active icon={tab.icon} />
                  <span
                    style={{
                      fontSize: 10,
                      lineHeight: '12px',
                      letterSpacing: 0.1,
                      fontWeight: 700,
                      color: colors.tabBarActiveText,
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    {tab.label}
                  </span>
                </div>
              ) : (
                <div
                  style={{
                    minHeight: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TabIcon active={false} icon={tab.icon} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
