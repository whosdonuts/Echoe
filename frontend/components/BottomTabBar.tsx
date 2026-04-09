'use client';

import { Compass, Map, Radio, User, Users } from 'lucide-react';
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

type TabIconProps = {
  icon: TabKey;
  active: boolean;
};

function TabIcon({ icon, active }: TabIconProps) {
  const props = {
    color: active ? colors.tabBarActiveText : colors.tabBarInactive,
    size: active ? 19 : 20,
    strokeWidth: active ? 2.15 : 1.95,
  };

  switch (icon) {
    case 'map':
      return <Map {...props} />;
    case 'echo':
      return <Radio {...props} />;
    case 'create':
      return <Users {...props} />;
    case 'explore':
      return <Compass {...props} />;
    case 'profile':
      return <User {...props} />;
  }
}

type BottomTabBarProps = {
  activeTab: TabKey;
  onTabPress: (tab: TabKey) => void;
};

export function BottomTabBar({ activeTab, onTabPress }: BottomTabBarProps) {
  const slotWidth = 58;
  const bubbleHeight = 52;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingLeft: 14,
        paddingRight: 14,
        paddingBottom: 16,
        pointerEvents: 'none',
        zIndex: 100,
      }}
    >
      <div
        style={{
          position: 'relative',
          marginLeft: 'auto',
          marginRight: 'auto',
          width: 'min(100%, 372px)',
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
            alignItems: 'center',
            gap: 6,
            minHeight: 72,
            paddingLeft: 8,
            paddingRight: 8,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 999,
            overflow: 'hidden',
            background: `linear-gradient(180deg, ${colors.tabBarGlassFillStrong}, ${colors.tabBarGlassFill})`,
            border: `1px solid ${colors.tabBarGlassBorder}`,
            boxShadow: [
              `0 22px 44px ${colors.tabBarShadow}`,
              `0 8px 18px ${colors.tabBarCapsuleShadow}`,
              `inset 0 1px 0 ${colors.tabBarGlassInset}`,
              `inset 0 -1px 0 ${colors.tabBarGlassBorderSoft}`,
            ].join(', '),
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          }}
        >
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 999,
              background: [
                `radial-gradient(120% 140% at 50% -18%, ${colors.tabBarGlassGlow} 0%, rgba(255,255,255,0) 56%)`,
                `radial-gradient(72% 108% at 12% 118%, ${colors.tabBarAccentSoft} 0%, rgba(255,255,255,0) 78%)`,
                'radial-gradient(78% 112% at 88% -6%, rgba(198, 206, 223, 0.1) 0%, rgba(255,255,255,0) 68%)',
              ].join(', '),
              pointerEvents: 'none',
            }}
          />
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 18,
              right: 18,
              top: 0,
              height: 1,
              borderRadius: 999,
              background: colors.tabBarHighlight,
              opacity: 0.92,
              pointerEvents: 'none',
            }}
          />

          {tabs.map((tab) => {
            const active = tab.key === activeTab;

            return (
              <button
                key={tab.key}
                aria-current={active ? 'page' : undefined}
                aria-label={tab.label}
                aria-pressed={active}
                onClick={() => onTabPress(tab.key)}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: bubbleHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  transform: active ? 'translateY(-1px)' : 'translateY(0)',
                  transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
              >
                {active ? (
                  <div
                    style={{
                      position: 'relative',
                      width: slotWidth,
                      height: bubbleHeight,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0,
                      borderRadius: 999,
                      overflow: 'hidden',
                      background: `linear-gradient(180deg, rgba(255, 255, 255, 0.58), ${colors.tabBarCapsuleFill})`,
                      border: `1px solid ${colors.tabBarCapsuleBorder}`,
                      boxShadow: [
                        `0 12px 24px ${colors.tabBarCapsuleShadow}`,
                        `inset 0 1px 0 ${colors.tabBarHighlight}`,
                        `inset 0 16px 18px rgba(255, 255, 255, 0.12)`,
                      ].join(', '),
                      backdropFilter: 'blur(26px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(26px) saturate(180%)',
                    }}
                  >
                    <div
                      aria-hidden
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 999,
                        background: [
                          `radial-gradient(86% 120% at 50% 0%, rgba(255,255,255,0.44) 0%, rgba(255,255,255,0) 58%)`,
                          `radial-gradient(64% 120% at 50% 118%, ${colors.tabBarAccentSoft} 0%, rgba(255,255,255,0) 78%)`,
                          'radial-gradient(90% 110% at 82% 8%, rgba(202, 209, 226, 0.12) 0%, rgba(255,255,255,0) 72%)',
                        ].join(', '),
                        pointerEvents: 'none',
                      }}
                    />
                    <TabIcon active icon={tab.icon} />
                    <div
                      aria-hidden
                      style={{
                        position: 'absolute',
                        left: '50%',
                        bottom: 10,
                        transform: 'translateX(-50%)',
                        width: 14,
                        height: 2.5,
                        borderRadius: 999,
                        backgroundColor: colors.tabBarIndicator,
                        boxShadow: `0 0 12px ${colors.tabBarAccentSoft}`,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: slotWidth,
                      height: bubbleHeight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 999,
                      transition: 'background-color 220ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
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
    </div>
  );
}
