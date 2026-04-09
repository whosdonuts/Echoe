import type { SocialBadgeTone, SocialTone } from '@/lib/data/socialMock';
import { colors } from '@/lib/theme/colors';
import { SocialAvatar } from './SocialAvatar';
import { SocialCard } from './SocialPrimitives';

type SocialFriendCardProps = {
  name: string;
  tone: SocialTone;
  summary: string;
  time: string;
  badgeLabel?: string;
  badgeTone?: SocialBadgeTone;
  active?: boolean;
};

const badgeStyles: Record<SocialBadgeTone, { backgroundColor: string; textColor: string }> = {
  accent: { backgroundColor: colors.shellAccentSurface, textColor: colors.shellAccentText },
  sand: { backgroundColor: '#EDF3FB', textColor: colors.text },
  soft: { backgroundColor: '#F4F5F5', textColor: colors.textSoft },
  neutral: { backgroundColor: colors.shellSurfaceMuted, textColor: colors.textSoft },
};

export function SocialFriendCard({
  name,
  tone,
  summary,
  time,
  badgeLabel,
  badgeTone = 'neutral',
  active = false,
}: SocialFriendCardProps) {
  const badgeStyle = badgeStyles[badgeTone];

  return (
    <SocialCard style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 15, paddingBottom: 15 }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14 }}>
        <SocialAvatar active={active} name={name} size={54} tone={tone} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ flex: 1, color: colors.text, fontSize: 16, fontWeight: 700, letterSpacing: 0.1 }}>{name}</span>
            <span
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
              }}
            >
              {time}
            </span>
          </div>
          <p
            style={{
              color: colors.textSoft,
              fontSize: 13,
              lineHeight: '19px',
              fontWeight: 500,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {summary}
          </p>
          {badgeLabel ? (
            <span
              style={{
                alignSelf: 'flex-start',
                borderRadius: 999,
                paddingLeft: 11,
                paddingRight: 11,
                paddingTop: 7,
                paddingBottom: 7,
                backgroundColor: badgeStyle.backgroundColor,
                color: badgeStyle.textColor,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.4,
                textTransform: 'uppercase',
              }}
            >
              {badgeLabel}
            </span>
          ) : null}
        </div>
      </div>
    </SocialCard>
  );
}
