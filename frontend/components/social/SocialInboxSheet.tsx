'use client';

import { useMemo } from 'react';
import { X } from 'lucide-react';
import type { InboxItem } from '@/lib/data/socialMock';
import { colors } from '@/lib/theme/colors';
import { SocialBottomSheet } from './SocialBottomSheet';
import { SwipeableInboxRow } from './SwipeableInboxRow';

type SocialInboxSheetProps = {
  visible: boolean;
  items: InboxItem[];
  onDelete: (id: string) => void;
  onClose: () => void;
};

export function SocialInboxSheet({ visible, items, onDelete, onClose }: SocialInboxSheetProps) {
  const emptyState = useMemo(
    () => (
      <div
        style={{
          borderRadius: 24,
          border: `1px solid ${colors.shellBorderSoft}`,
          background: `linear-gradient(180deg, rgba(255,255,255,0.96), ${colors.shellSurfaceSoft})`,
          boxShadow: `0 18px 28px ${colors.shellShadow}`,
          paddingLeft: 18,
          paddingRight: 18,
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <span style={{ display: 'block', color: colors.text, fontSize: 15, fontWeight: 700, paddingBottom: 4 }}>All caught up</span>
        <p style={{ color: colors.textSoft, fontSize: 13, lineHeight: '19px', fontWeight: 500, margin: 0 }}>
          Recent updates will appear here as friends trade, share, and move through the social feed.
        </p>
      </div>
    ),
    [],
  );

  return (
    <SocialBottomSheet
      bodyStyle={{
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 28,
      }}
      header={
        <div
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            paddingBottom: 14,
            flexShrink: 0,
          }}
        >
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.7,
                textTransform: 'uppercase',
              }}
            >
              Social Inbox
            </span>
            <p style={{ color: colors.text, fontSize: 27, fontWeight: 700, letterSpacing: -0.5, margin: 0 }}>
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
              background: `linear-gradient(180deg, ${colors.shellGlassStrong}, ${colors.shellGlass})`,
              border: `1px solid ${colors.shellGlassBorder}`,
              color: colors.text,
              cursor: 'pointer',
              boxShadow: `0 12px 20px ${colors.shellGlassShadow}, inset 0 1px 0 rgba(255,255,255,0.84)`,
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            }}
          >
            <X size={20} />
          </button>
        </div>
      }
      onClose={onClose}
      visible={visible}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 6,
          overscrollBehavior: 'contain',
        }}
        className="scrollbar-hide"
      >
        {items.length === 0
          ? emptyState
          : items.map((item, index) => <SwipeableInboxRow isLast={index === items.length - 1} item={item} key={item.id} onDelete={onDelete} />)}
      </div>
    </SocialBottomSheet>
  );
}
