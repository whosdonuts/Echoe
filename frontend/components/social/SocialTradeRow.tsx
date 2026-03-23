'use client';

import { useState } from 'react';
import type { SocialTone } from '@/lib/data/socialMock';
import { colors } from '@/lib/theme/colors';
import { SocialAvatar } from './SocialAvatar';
import { SocialCard } from './SocialPrimitives';

type SocialTradeRowProps = {
  name: string;
  tone: SocialTone;
  info: string;
  emphasized?: boolean;
  onPress?: () => void;
};

export function SocialTradeRow({ name, tone, info, emphasized = false, onPress }: SocialTradeRowProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={onPress}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{ all: 'unset', display: 'block', width: '100%', cursor: 'pointer' }}
    >
      <SocialCard
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          paddingLeft: 16,
          paddingRight: 16,
          paddingTop: 15,
          paddingBottom: 15,
          opacity: pressed ? 0.94 : 1,
          transform: pressed ? 'scale(0.995)' : 'scale(1)',
          transition: 'opacity 0.1s ease, transform 0.1s ease',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          <SocialAvatar name={name} size={56} tone={tone} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              <span style={{ flex: 1, color: colors.text, fontSize: 16, fontWeight: 700, letterSpacing: 0.1 }}>{name}</span>
              <span
                style={{
                  borderRadius: 999,
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 6,
                  paddingBottom: 6,
                  backgroundColor: emphasized ? '#F8E3DA' : '#F7F2EB',
                  color: emphasized ? colors.echoDeepTerracotta : colors.echoOliveBronze,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 0.6,
                  textTransform: 'uppercase',
                }}
              >
                {emphasized ? 'Priority' : 'Open'}
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
              {info}
            </p>
          </div>
        </div>

        <div
          style={{
            alignSelf: 'flex-start',
            borderRadius: 18,
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop: 10,
            paddingBottom: 10,
            minWidth: 72,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: emphasized ? colors.echoPrimaryTerracotta : '#F6F0E8',
          }}
        >
          <span
            style={{
              color: emphasized ? colors.echoMainWhite : colors.echoOliveBronze,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.2,
            }}
          >
            Trade
          </span>
        </div>
      </SocialCard>
    </button>
  );
}
