'use client';

import { useEffect, useState } from 'react';
import { Compass, Map, Radio, User, Users } from 'lucide-react';
import { SlidingPill } from '@/components/ui/SlidingPill';
import { colors } from '@/lib/theme/colors';

type ExploreViewMode = 'feed' | 'inbox';

const EXPLORE_VIEW_MODE_EVENT = 'echo:explore-view-mode';

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
  color: string;
  size: number;
  strokeWidth: number;
  shadowFilter?: string;
};

function TabIcon({ icon, color, size, strokeWidth, shadowFilter }: TabIconProps) {
  const props = {
    color,
    size,
    strokeWidth,
    style: shadowFilter ? { filter: shadowFilter } : undefined,
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
  const [exploreViewMode, setExploreViewMode] = useState<ExploreViewMode>('feed');
  const isExplore = activeTab === 'explore' && exploreViewMode === 'feed';
  const activeIndex = Math.max(0, tabs.findIndex((tab) => tab.key === activeTab));
  const slotWidth = 58;
  const bubbleHeight = 52;
  const navBackground = isExplore
    ? 'linear-gradient(180deg, rgba(31, 39, 52, 0.42), rgba(18, 24, 33, 0.28))'
    : `linear-gradient(180deg, ${colors.tabBarGlassFillStrong}, ${colors.tabBarGlassFill})`;
  const navBorder = isExplore ? 'rgba(255, 255, 255, 0.24)' : colors.tabBarGlassBorder;
  const navShadow = isExplore
    ? [
        '0 26px 52px rgba(7, 10, 18, 0.34)',
        '0 10px 24px rgba(7, 10, 18, 0.22)',
        'inset 0 1px 0 rgba(255, 255, 255, 0.26)',
        'inset 0 -1px 0 rgba(255, 255, 255, 0.12)',
      ].join(', ')
    : [
        `0 22px 44px ${colors.tabBarShadow}`,
        `0 8px 18px ${colors.tabBarCapsuleShadow}`,
        `inset 0 1px 0 ${colors.tabBarGlassInset}`,
        `inset 0 -1px 0 ${colors.tabBarGlassBorderSoft}`,
      ].join(', ');
  const navGlow = isExplore
    ? [
        'radial-gradient(120% 140% at 50% -18%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0) 56%)',
        'radial-gradient(76% 112% at 14% 118%, rgba(132, 156, 194, 0.18) 0%, rgba(255,255,255,0) 78%)',
        'radial-gradient(78% 112% at 88% -6%, rgba(194, 203, 220, 0.12) 0%, rgba(255,255,255,0) 68%)',
      ].join(', ')
    : [
        `radial-gradient(120% 140% at 50% -18%, ${colors.tabBarGlassGlow} 0%, rgba(255,255,255,0) 56%)`,
        `radial-gradient(72% 108% at 12% 118%, ${colors.tabBarAccentSoft} 0%, rgba(255,255,255,0) 78%)`,
        'radial-gradient(78% 112% at 88% -6%, rgba(198, 206, 223, 0.1) 0%, rgba(255,255,255,0) 68%)',
      ].join(', ');
  const navHighlight = isExplore ? 'rgba(255, 255, 255, 0.5)' : colors.tabBarHighlight;
  const capsuleBackground = `linear-gradient(180deg, rgba(39, 35, 34, 0.98), ${colors.activePill})`;
  const capsuleBorder = colors.activePillBorder;
  const capsuleShadow = [
    `0 14px 30px ${colors.activePillShadow}`,
    'inset 0 1px 0 rgba(255, 255, 255, 0.12)',
    'inset 0 16px 18px rgba(255, 255, 255, 0.04)',
  ].join(', ');
  const capsuleGlow = [
    'radial-gradient(86% 120% at 50% 0%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0) 58%)',
    'radial-gradient(64% 120% at 50% 118%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 78%)',
  ].join(', ');
  const indicatorColor = colors.activePillIndicator;

  useEffect(() => {
    function handleExploreViewMode(event: Event) {
      const nextViewMode = (event as CustomEvent<ExploreViewMode>).detail;

      if (nextViewMode === 'feed' || nextViewMode === 'inbox') {
        setExploreViewMode(nextViewMode);
      }
    }

    window.addEventListener(EXPLORE_VIEW_MODE_EVENT, handleExploreViewMode as EventListener);

    return () => {
      window.removeEventListener(EXPLORE_VIEW_MODE_EVENT, handleExploreViewMode as EventListener);
    };
  }, []);

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
            background: navBackground,
            border: `1px solid ${navBorder}`,
            boxShadow: navShadow,
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          }}
        >
          {isExplore ? (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 999,
                background: 'linear-gradient(180deg, rgba(10, 14, 21, 0.16), rgba(10, 14, 21, 0.04))',
                pointerEvents: 'none',
              }}
            />
          ) : null}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 999,
              background: navGlow,
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
              background: navHighlight,
              opacity: 0.92,
              pointerEvents: 'none',
            }}
          />
          <SlidingPill activeIndex={activeIndex} gap={6} inset={8} optionCount={tabs.length}>
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: slotWidth,
                  height: bubbleHeight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 999,
                  overflow: 'hidden',
                  background: capsuleBackground,
                  border: `1px solid ${capsuleBorder}`,
                  boxShadow: capsuleShadow,
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
                    background: capsuleGlow,
                    pointerEvents: 'none',
                  }}
                />
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
                    backgroundColor: indicatorColor,
                    boxShadow: '0 0 12px rgba(255, 255, 255, 0.2)',
                  }}
                />
              </div>
            </div>
          </SlidingPill>

          {tabs.map((tab) => {
            const active = tab.key === activeTab;
            const iconColor = active
              ? colors.activePillText
              : isExplore
                ? 'rgba(247, 250, 255, 0.86)'
                : colors.tabBarInactive;
            const iconShadow = isExplore
              ? active
                ? 'drop-shadow(0 1px 0 rgba(255, 255, 255, 0.18))'
                : 'drop-shadow(0 2px 12px rgba(0, 0, 0, 0.36))'
              : undefined;

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
                  transition: 'color 220ms ease',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    width: slotWidth,
                    height: bubbleHeight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 999,
                  }}
                >
                  <TabIcon color={iconColor} icon={tab.icon} shadowFilter={iconShadow} size={20} strokeWidth={2.05} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
