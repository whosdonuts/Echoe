'use client';

import { X } from 'lucide-react';
import type { InboxItem } from '@/lib/data/socialMock';
import { colors } from '@/lib/theme/colors';
import { SocialAvatar } from './SocialAvatar';

type SocialInboxSheetProps = {
  visible: boolean;
  items: InboxItem[];
  onClose: () => void;
};

export function SocialInboxSheet({ visible, items, onClose }: SocialInboxSheetProps) {
  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(32, 24, 20, 0.20)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          backgroundColor: colors.echoMainWhite,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 28,
          boxShadow: '0 -8px 26px rgba(86, 33, 13, 0.16)',
          maxHeight: '80vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 12 }}>
          <div style={{ width: 46, height: 5, borderRadius: 999, backgroundColor: '#DDD2C6' }} />
        </div>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            paddingBottom: 16,
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{
                color: colors.echoOliveBronze,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.7,
                textTransform: 'uppercase',
              }}
            >
              Social Inbox
            </span>
            <p style={{ color: colors.text, fontSize: 27, fontWeight: 700, letterSpacing: -0.5, margin: 0, fontFamily: 'Georgia, serif' }}>
              Recent updates
            </p>
            <p style={{ color: colors.textSoft, fontSize: 13, lineHeight: '19px', fontWeight: 500, margin: 0 }}>
              Friends, trades, and quick activity in one polished stream.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.echoOffWhiteBackground,
              border: '1px solid rgba(226, 215, 205, 0.9)',
              color: colors.echoDarkCocoa,
              cursor: 'pointer',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* List */}
        <div
          style={{
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
          className="scrollbar-hide"
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 13,
                borderRadius: 24,
                backgroundColor: '#FFFCF8',
                border: '1px solid rgba(226, 215, 205, 0.88)',
                paddingLeft: 14,
                paddingRight: 14,
                paddingTop: 13,
                paddingBottom: 13,
              }}
            >
              <SocialAvatar active={item.active} name={item.name} size={50} tone={item.tone} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10,
                  }}
                >
                  <span style={{ flex: 1, color: colors.text, fontSize: 15, fontWeight: 700 }}>{item.name}</span>
                  <span
                    style={{
                      color: colors.textMuted,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {item.time}
                  </span>
                </div>
                <p
                  style={{
                    color: colors.textSoft,
                    fontSize: 13,
                    lineHeight: '18px',
                    fontWeight: 500,
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {item.preview}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
