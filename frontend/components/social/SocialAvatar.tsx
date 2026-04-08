import { CSSProperties } from 'react';
import type { SocialTone } from '@/lib/data/socialMock';
import { colors } from '@/lib/theme/colors';

type SocialAvatarProps = {
  name: string;
  tone: SocialTone;
  size?: number;
  active?: boolean;
  style?: CSSProperties;
};

const toneMap: Record<SocialTone, [string, string, string]> = {
  terracotta: ['#F9FBFF', '#D9E6F8', '#8EA9CF'],
  sand: ['#FBFCFF', '#E5EDF9', '#ADC0DE'],
  clay: ['#FAFBFF', '#E4EAF6', '#9DAFD0'],
  cream: ['#FFFFFF', '#EBF1FA', '#BAC8E0'],
  neutral: ['#FFFFFF', '#EAF0F7', '#C7D2E1'],
};

function getInitials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function SocialAvatar({ name, tone, size = 56, active = false, style }: SocialAvatarProps) {
  const ringInset = Math.max(3, Math.round(size * 0.07));
  const innerSize = size - ringInset;
  const [c1, c2, c3] = toneMap[tone];

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      {/* Outer ring */}
      <div
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(246,249,253,0.92))',
          border: `1px solid ${colors.shellBorderSoft}`,
          boxShadow: `0 16px 24px ${colors.shellShadow}, inset 0 1px 0 rgba(255,255,255,0.88)`,
        }}
      />
      {/* Gradient avatar */}
      <div
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          background: `linear-gradient(135deg, ${c1}, ${c2}, ${c3})`,
          border: '1px solid rgba(255,255,255,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Gloss */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '48%',
            backgroundColor: 'rgba(255,255,255,0.24)',
          }}
        />
        <span
          style={{
            color: colors.text,
            fontWeight: 700,
            letterSpacing: 0.8,
            fontSize: Math.max(12, size * 0.23),
            position: 'relative',
          }}
        >
          {getInitials(name)}
        </span>
      </div>
      {/* Active dot */}
      {active ? (
        <div
          style={{
            position: 'absolute',
            right: 1,
            bottom: 1,
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: colors.shellAccent,
            border: `2px solid ${colors.echoMainWhite}`,
            boxShadow: '0 0 0 2px rgba(255,255,255,0.55)',
          }}
        />
      ) : null}
    </div>
  );
}
