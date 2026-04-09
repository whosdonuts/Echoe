'use client';

import { CSSProperties, ReactNode } from 'react';
import { Map, Radio, Users, Compass, User, Mail, UserPlus, Trophy, ArrowLeftRight } from 'lucide-react';
import { SlidingPill } from '@/components/ui/SlidingPill';
import { colors } from '@/lib/theme/colors';

export type SegmentOption = {
  key: string;
  label: string;
};

type SocialSegmentedControlProps = {
  options: ReadonlyArray<SegmentOption>;
  activeKey: string;
  onChange: (nextKey: string) => void;
  style?: CSSProperties;
  fullWidth?: boolean;
  compact?: boolean;
};

type SocialIconButtonProps = {
  icon: string;
  onPress: () => void;
  accent?: boolean;
  style?: CSSProperties;
};

type SocialLogoBadgeProps = {
  icon: string;
  accent?: boolean;
};

type SocialCardProps = {
  children: ReactNode;
  style?: CSSProperties;
};

function getIcon(iconName: string): ReactNode {
  const iconMap: Record<string, ReactNode> = {
    'mail-outline': <Mail size={18} />,
    'person-add-outline': <UserPlus size={18} />,
    'trophy-outline': <Trophy size={18} />,
    'swap-horizontal': <ArrowLeftRight size={18} />,
    'people-outline': <Users size={18} />,
    'map-outline': <Map size={18} />,
    'radio-outline': <Radio size={18} />,
    'compass-outline': <Compass size={18} />,
    'person-outline': <User size={18} />,
  };
  return iconMap[iconName] ?? <span style={{ fontSize: 14 }}>●</span>;
}

export function SocialSegmentedControl({
  options,
  activeKey,
  onChange,
  style,
  fullWidth = false,
  compact = false,
}: SocialSegmentedControlProps) {
  const activeIndex = Math.max(0, options.findIndex((option) => option.key === activeKey));
  const slotWidth = Math.max(
    compact ? 94 : 108,
    ...options.map((option) => option.label.length * (compact ? 7.2 : 8.1) + (compact ? 34 : 38)),
  );

  return (
    <div
      style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.max(options.length, 1)}, minmax(0, 1fr))`,
        alignItems: 'center',
        gap: 4,
        padding: 5,
        borderRadius: 999,
        overflow: 'hidden',
        width: fullWidth ? '100%' : slotWidth * Math.max(options.length, 1) + 4 * Math.max(0, options.length - 1) + 10,
        background: `linear-gradient(180deg, ${colors.shellGlassStrong}, ${colors.shellGlass})`,
        border: `1px solid ${colors.shellGlassBorder}`,
        boxShadow: `0 20px 34px ${colors.shellGlassShadow}, inset 0 1px 0 ${colors.shellGlassHighlight}`,
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 999,
          background: [
            'radial-gradient(120% 130% at 50% -18%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 56%)',
            'radial-gradient(78% 110% at 12% 118%, rgba(156, 174, 208, 0.08) 0%, rgba(255,255,255,0) 76%)',
            'radial-gradient(82% 112% at 88% -10%, rgba(210, 216, 232, 0.07) 0%, rgba(255,255,255,0) 72%)',
          ].join(', '),
          pointerEvents: 'none',
        }}
      />
      <SlidingPill activeIndex={activeIndex} gap={4} inset={5} optionCount={options.length} style={{ borderRadius: 999 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            background: `linear-gradient(180deg, rgba(39, 35, 34, 0.98), ${colors.activePill})`,
            boxShadow: `0 12px 24px ${colors.activePillShadow}, inset 0 1px 0 rgba(255,255,255,0.12)`,
            border: `1px solid ${colors.activePillBorder}`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 999,
              background: [
                'radial-gradient(110% 120% at 50% 0%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 54%)',
                'radial-gradient(80% 110% at 50% 118%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 78%)',
              ].join(', '),
            }}
          />
        </div>
      </SlidingPill>
      {options.map((option) => {
        const active = option.key === activeKey;
        return (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: compact ? 34 : 38,
              borderRadius: 999,
              paddingLeft: 14,
              paddingRight: 14,
              paddingTop: compact ? 8 : 10,
              paddingBottom: compact ? 8 : 10,
              width: '100%',
              overflow: 'hidden',
              background: 'transparent',
              boxShadow: 'none',
              border: '1px solid transparent',
              cursor: 'pointer',
              transition: 'color 0.18s ease',
              whiteSpace: 'nowrap',
              zIndex: 1,
            }}
          >
            <span
              style={{
                position: 'relative',
                color: active ? colors.activePillText : colors.textSoft,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.16,
                transition: 'color 0.18s ease',
              }}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SocialIconButton({ icon, onPress, accent = false, style }: SocialIconButtonProps) {
  return (
    <button
      onClick={onPress}
      style={{
        position: 'relative',
        width: 42,
        height: 42,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 21,
        overflow: 'hidden',
        background: accent
          ? 'linear-gradient(180deg, rgba(255,255,255,0.68), rgba(255,255,255,0.48))'
          : `linear-gradient(180deg, ${colors.shellGlassStrong}, ${colors.shellGlass})`,
        border: `1px solid ${accent ? 'rgba(255,255,255,0.52)' : colors.shellGlassBorder}`,
        boxShadow: accent
          ? `0 16px 28px ${colors.shellGlassShadow}, inset 0 1px 0 rgba(255,255,255,0.84)`
          : `0 14px 24px ${colors.shellGlassShadow}, inset 0 1px 0 rgba(255,255,255,0.84)`,
        backdropFilter: 'blur(26px) saturate(180%)',
        WebkitBackdropFilter: 'blur(26px) saturate(180%)',
        cursor: 'pointer',
        color: accent ? colors.shellAccentText : colors.text,
        ...style,
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 21,
          background: accent
            ? [
                'radial-gradient(118% 120% at 50% 0%, rgba(255,255,255,0.26) 0%, rgba(255,255,255,0) 56%)',
                'radial-gradient(78% 108% at 50% 118%, rgba(156, 174, 208, 0.08) 0%, rgba(255,255,255,0) 76%)',
              ].join(', ')
            : 'radial-gradient(118% 120% at 50% 0%, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0) 56%)',
          pointerEvents: 'none',
        }}
      />
      {getIcon(icon)}
    </button>
  );
}

export function SocialLogoBadge({ icon, accent = true }: SocialLogoBadgeProps) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        border: `1px solid ${accent ? 'rgba(255,255,255,0.52)' : colors.shellGlassBorder}`,
        background: accent
          ? 'linear-gradient(180deg, rgba(255,255,255,0.68), rgba(255,255,255,0.48))'
          : `linear-gradient(180deg, ${colors.shellGlassStrong}, ${colors.shellGlass})`,
        boxShadow: `0 16px 24px ${colors.shellGlassShadow}, inset 0 1px 0 rgba(255,255,255,0.84)`,
        backdropFilter: 'blur(26px) saturate(180%)',
        WebkitBackdropFilter: 'blur(26px) saturate(180%)',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 19,
          backgroundColor: 'rgba(255, 255, 255, 0.74)',
          border: '1px solid rgba(255,255,255,0.52)',
          color: accent ? colors.shellAccentText : colors.textSoft,
        }}
      >
        {getIcon(icon)}
      </div>
    </div>
  );
}

export function SocialCard({ children, style }: SocialCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 30,
        background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${colors.shellSurfaceSoft})`,
        border: `1px solid ${colors.shellBorderSoft}`,
        boxShadow: `0 22px 36px ${colors.shellShadow}, inset 0 1px 0 rgba(255,255,255,0.88)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
