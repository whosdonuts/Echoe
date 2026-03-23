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
  terracotta: ['#FFF7F1', '#F6D7CC', '#E8A48F'],
  sand: ['#FFF8EF', '#F7E2B7', '#EBC378'],
  clay: ['#FFF7F3', '#F2DBD2', '#E6B19C'],
  cream: ['#FFFBEF', '#F7E9BE', '#E9D38C'],
  neutral: ['#FFF8F2', '#EFE2D6', '#D6C4B3'],
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
          backgroundColor: 'rgba(255, 255, 255, 0.84)',
          border: '1px solid rgba(227, 216, 205, 0.88)',
          boxShadow: '0 8px 16px rgba(75, 52, 39, 0.12)',
        }}
      />
      {/* Gradient avatar */}
      <div
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          background: `linear-gradient(135deg, ${c1}, ${c2}, ${c3})`,
          border: '1px solid rgba(255,255,255,0.72)',
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
            backgroundColor: 'rgba(255,255,255,0.16)',
          }}
        />
        <span
          style={{
            color: colors.echoDarkCocoa,
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
            backgroundColor: colors.sage,
            border: `2px solid ${colors.echoMainWhite}`,
          }}
        />
      ) : null}
    </div>
  );
}
