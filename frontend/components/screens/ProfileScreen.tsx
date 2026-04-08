'use client';

import { Clock, Edit3, Bell, Lock, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
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
  return icons[iconName] ?? <span style={{ fontSize: 14 }}>●</span>;
}

export function ProfileScreen() {
  return (
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
          gap: 22,
        }}
      >
        {/* Page header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>Account</span>
          <h1 style={{ color: colors.text, fontSize: 35, fontWeight: 700, letterSpacing: -1, margin: 0 }}>Profile</h1>
          <p style={{ color: colors.textSoft, fontSize: 14, lineHeight: '21px', fontWeight: 500, margin: 0 }}>The places you keep returning to, and the traces they keep.</p>
        </div>

        {/* Hero card */}
        <div
          style={{
            display: 'flex', flexDirection: 'column', gap: 18, borderRadius: 32, padding: 22,
            background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${colors.shellSurfaceSoft})`, border: `1px solid ${colors.shellBorderSoft}`,
            boxShadow: `0 24px 38px ${colors.shellShadow}, inset 0 1px 0 rgba(255,255,255,0.86)`,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: 5, borderRadius: 28, background: `linear-gradient(180deg, rgba(255,255,255,0.96), ${colors.shellSurfaceSoft})`, border: `1px solid ${colors.shellBorderSoft}`, boxShadow: `0 18px 28px ${colors.shellShadow}`, flexShrink: 0 }}>
              <img src={profile.avatar} alt={profile.name} style={{ width: 92, height: 92, borderRadius: 24, objectFit: 'cover', display: 'block' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
              <span style={{ color: colors.text, fontSize: 30, fontWeight: 700, letterSpacing: -0.85 }}>{profile.name}</span>
              <span style={{ color: colors.textSoft, fontSize: 14, fontWeight: 600, letterSpacing: 0.2 }}>{profile.username}</span>
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingTop: 6 }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingLeft: 11, paddingRight: 11, paddingTop: 8, paddingBottom: 8, backgroundColor: colors.shellAccentSurface, border: '1px solid rgba(95, 125, 165, 0.18)' }}>
                  <Clock size={13} color={colors.shellAccent} />
                  <span style={{ color: colors.text, fontSize: 12, fontWeight: 700 }}>{profile.joined}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 999, paddingLeft: 11, paddingRight: 11, paddingTop: 8, paddingBottom: 8, backgroundColor: colors.shellSurfaceMuted, border: `1px solid ${colors.shellBorderSoft}` }}>
                  <div style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors.shellAccent }} />
                  <span style={{ color: colors.textSoft, fontSize: 12, fontWeight: 700 }}>Quietly active</span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: 1, backgroundColor: colors.shellBorderSoft }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ color: colors.text, fontSize: 18, lineHeight: '26px', fontWeight: 600, letterSpacing: -0.1, margin: 0 }}>{profile.bio}</p>
            <p style={{ color: colors.textSoft, fontSize: 14, lineHeight: '22px', fontWeight: 500, margin: 0 }}>{profile.status}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, borderRadius: 22, paddingLeft: 16, paddingRight: 16, paddingTop: 14, paddingBottom: 14, backgroundColor: colors.shellSurfaceMuted, border: `1px solid ${colors.shellBorderSoft}` }}>
            <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Account note</span>
            <span style={{ color: colors.textSoft, fontSize: 13, lineHeight: '20px', fontWeight: 600 }}>{profile.accountNote}</span>
          </div>
        </div>

        {/* Stats section */}
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
                  flex: 1, minHeight: 106, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
                  borderRadius: 24, paddingLeft: 10, paddingRight: 10,
                  background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${colors.shellSurfaceSoft})`, border: `1px solid ${colors.shellBorderSoft}`,
                  boxShadow: `0 18px 30px ${colors.shellShadow}`,
                }}
              >
                <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>{stat.label}</span>
                <span style={{ color: colors.text, fontSize: 31, fontWeight: 700, letterSpacing: -0.8 }}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings section */}
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ color: colors.text, fontSize: 17, fontWeight: 700, letterSpacing: -0.1 }}>Account</span>
          <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Prototype settings only</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {profile.settings.map((item) => {
            const danger = item.tone === 'danger';
            return (
              <button
                key={item.id}
                style={{
                  display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14,
                  borderRadius: 24, paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 16,
                  background: danger
                    ? `linear-gradient(180deg, ${colors.shellAccentSurface}, rgba(255,255,255,0.96))`
                    : `linear-gradient(180deg, rgba(255,255,255,0.98), ${colors.shellSurfaceSoft})`,
                  border: `1px solid ${danger ? 'rgba(95, 125, 165, 0.2)' : colors.shellBorderSoft}`,
                  boxShadow: `0 18px 28px ${colors.shellShadow}`,
                  cursor: 'pointer', textAlign: 'left', width: '100%',
                }}
              >
                <div
                  style={{
                    width: 44, height: 44, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
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
      </div>
    </div>
  );
}
