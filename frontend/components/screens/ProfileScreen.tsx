'use client';

import { useState } from 'react';
import { Settings2, X, Edit3, Bell, Lock, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { SocialBottomSheet } from '@/components/social/SocialBottomSheet';
import { profile } from '@/lib/data/mock';
import { colors } from '@/lib/theme/colors';
import { shellMetrics } from '@/lib/theme/layout';

function getSettingIcon(iconName: string, danger: boolean) {
  const color = danger ? colors.shellAccent : colors.text;
  const size = 16;
  const icons: Record<string, React.ReactNode> = {
    'edit-3': <Edit3 size={size} color={color} />,
    bell: <Bell size={size} color={color} />,
    lock: <Lock size={size} color={color} />,
    'help-circle': <HelpCircle size={size} color={color} />,
    'log-out': <LogOut size={size} color={color} />,
  };

  return icons[iconName] ?? <span style={{ fontSize: 14 }}>*</span>;
}

const profileFavorites = [
  {
    id: 'favorite-night-train',
    title: 'Night Train Loops',
    subtitle: 'Most replayed sound',
    meta: 'Union Station / saved 12 times',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    badge: 'Most replayed',
  },
  {
    id: 'favorite-blue-hour',
    title: 'Blue Hour Ferry Horn',
    subtitle: 'Saved for late walks',
    meta: 'Queens Quay',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'favorite-rain-note',
    title: 'Rain on Platform 5',
    subtitle: 'Favorite memento',
    meta: 'Soft station reverb',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  },
] as const;

export function ProfileScreen() {
  const [settingsVisible, setSettingsVisible] = useState(false);

  return (
    <>
      <div
        style={{ width: '100%', height: '100%', backgroundColor: colors.echoOffWhiteBackground, overflowY: 'auto' }}
        className="scrollbar-hide"
      >
        <div
          style={{
            paddingTop: shellMetrics.topPadding + 4,
            paddingLeft: shellMetrics.horizontalPadding,
            paddingRight: shellMetrics.horizontalPadding,
            paddingBottom: shellMetrics.contentBottomPadding,
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              aria-label="Open settings"
              onClick={() => setSettingsVisible(true)}
              style={{
                width: 46,
                height: 46,
                borderRadius: 23,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(180deg, ${colors.shellGlassStrong}, ${colors.shellGlass})`,
                border: `1px solid ${colors.shellGlassBorder}`,
                boxShadow: `0 18px 28px ${colors.shellGlassShadow}, inset 0 1px 0 rgba(255,255,255,0.84)`,
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                cursor: 'pointer',
              }}
            >
              <Settings2 size={20} color={colors.text} strokeWidth={2.05} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingTop: 2, paddingBottom: 2 }}>
            <div
              style={{
                padding: 6,
                borderRadius: 34,
                background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${colors.shellSurfaceSoft})`,
                border: `1px solid ${colors.shellBorderSoft}`,
                boxShadow: `0 22px 34px ${colors.shellShadow}, inset 0 1px 0 rgba(255,255,255,0.9)`,
              }}
            >
              <img src={profile.avatar} alt={profile.name} style={{ width: 112, height: 112, borderRadius: 28, objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span className="display-title display-title--preserve-case" style={{ color: colors.text, fontSize: 31, fontWeight: 900, letterSpacing: -0.9, textAlign: 'center' }}>{profile.name}</span>
              <span style={{ color: colors.textSoft, fontSize: 14, fontWeight: 600, letterSpacing: 0.15, textAlign: 'center' }}>{profile.username}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ color: colors.text, fontSize: 17, fontWeight: 700, letterSpacing: -0.1 }}>At a glance</span>
              <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Collected quietly</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
              {profile.stats.map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    flex: 1,
                    minHeight: 108,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    borderRadius: 24,
                    paddingLeft: 10,
                    paddingRight: 10,
                    background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${colors.shellSurfaceSoft})`,
                    border: `1px solid ${colors.shellBorderSoft}`,
                    boxShadow: `0 18px 30px ${colors.shellShadow}, inset 0 1px 0 rgba(255,255,255,0.84)`,
                  }}
                >
                  <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>{stat.label}</span>
                  <span style={{ color: colors.text, fontSize: 31, fontWeight: 700, letterSpacing: -0.8 }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ color: colors.text, fontSize: 17, fontWeight: 700, letterSpacing: -0.1 }}>Favorites</span>
              <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Curated replay</span>
            </div>
            <div
              style={{
                position: 'relative',
                minHeight: 216,
                borderRadius: 30,
                overflow: 'hidden',
                backgroundColor: '#18212E',
                boxShadow: `0 24px 40px ${colors.shadowStrong}`,
              }}
            >
              <img src={profileFavorites[0].image} alt={profileFavorites[0].title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18, 24, 35, 0.1), rgba(18, 24, 35, 0.24) 42%, rgba(18, 24, 35, 0.72))' }} />
              <div style={{ position: 'absolute', top: 16, left: 16, borderRadius: 999, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, background: 'rgba(255, 255, 255, 0.16)', border: '1px solid rgba(255,255,255,0.24)', backdropFilter: 'blur(20px) saturate(160%)', WebkitBackdropFilter: 'blur(20px) saturate(160%)' }}>
                <span style={{ color: colors.echoMainWhite, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>{profileFavorites[0].badge}</span>
              </div>
              <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span style={{ color: colors.echoMainWhite, fontSize: 27, fontWeight: 700, letterSpacing: -0.7 }}>{profileFavorites[0].title}</span>
                <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: 14, fontWeight: 600 }}>{profileFavorites[0].subtitle}</span>
                <span style={{ color: 'rgba(255,255,255,0.72)', fontSize: 12, fontWeight: 600 }}>{profileFavorites[0].meta}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
              {profileFavorites.slice(1).map((favorite) => (
                <div
                  key={favorite.id}
                  style={{
                    flex: 1,
                    borderRadius: 24,
                    overflow: 'hidden',
                    background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${colors.shellSurfaceSoft})`,
                    border: `1px solid ${colors.shellBorderSoft}`,
                    boxShadow: `0 18px 30px ${colors.shellShadow}`,
                  }}
                >
                  <div style={{ position: 'relative', height: 118 }}>
                    <img src={favorite.image} alt={favorite.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(18,24,35,0.08), rgba(18,24,35,0.46))' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingLeft: 14, paddingRight: 14, paddingTop: 14, paddingBottom: 16 }}>
                    <span style={{ color: colors.text, fontSize: 15, fontWeight: 700, letterSpacing: -0.15 }}>{favorite.title}</span>
                    <span style={{ color: colors.textSoft, fontSize: 12.5, lineHeight: '18px', fontWeight: 600 }}>{favorite.subtitle}</span>
                    <span style={{ color: colors.textMuted, fontSize: 11.5, fontWeight: 700 }}>{favorite.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <SocialBottomSheet
        expandedOnly
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        bodyStyle={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 26 }}
        header={
          <div style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 4, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Account</span>
              <span className="display-title" style={{ color: colors.text, fontSize: 30, fontWeight: 900, letterSpacing: -0.8 }}>Settings</span>
            </div>
            <button
              type="button"
              aria-label="Close settings"
              onClick={() => setSettingsVisible(false)}
              style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: 'transparent', border: 'none', boxShadow: 'none', cursor: 'pointer', color: colors.text }}
            >
              <X size={20} strokeWidth={2.15} color={colors.text} />
            </button>
          </div>
        }
        zIndex={1000}
      >
        <div style={{ overflowY: 'auto', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8, overscrollBehavior: 'contain' }} className="scrollbar-hide">
          {profile.settings.map((item) => {
            const danger = item.tone === 'danger';

            return (
              <button
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                  borderRadius: 24,
                  paddingLeft: 16,
                  paddingRight: 16,
                  paddingTop: 16,
                  paddingBottom: 16,
                  background: danger
                    ? `linear-gradient(180deg, ${colors.shellAccentSurface}, rgba(255,255,255,0.96))`
                    : `linear-gradient(180deg, rgba(255,255,255,0.98), ${colors.shellSurfaceSoft})`,
                  border: `1px solid ${danger ? 'rgba(95, 125, 165, 0.2)' : colors.shellBorderSoft}`,
                  boxShadow: `0 18px 28px ${colors.shellShadow}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: danger ? colors.shellAccentSurface : colors.shellSurfaceMuted,
                    border: `1px solid ${danger ? 'rgba(95, 125, 165, 0.18)' : colors.shellBorderSoft}`,
                    flexShrink: 0,
                  }}
                >
                  {getSettingIcon(item.icon, danger)}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: danger ? colors.shellAccentText : colors.text, fontSize: 15, fontWeight: 700, letterSpacing: -0.1 }}>{item.label}</span>
                  <span style={{ color: colors.textSoft, fontSize: 12.5, lineHeight: '19px', fontWeight: 500 }}>{item.description}</span>
                </div>
                <ChevronRight size={18} color={danger ? colors.shellAccentText : colors.textMuted} />
              </button>
            );
          })}
        </div>
      </SocialBottomSheet>
    </>
  );
}
