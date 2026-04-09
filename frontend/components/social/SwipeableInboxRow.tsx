'use client';

import { PointerEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { InboxItem } from '@/lib/data/socialMock';
import { colors } from '@/lib/theme/colors';
import { SocialAvatar } from './SocialAvatar';

type SwipeableInboxRowProps = {
  item: InboxItem;
  isLast: boolean;
  onDelete: (id: string) => void;
};

const INTENT_THRESHOLD = 8;
const REVEAL_WIDTH = 112;
const REMOVE_DURATION_MS = 220;

type DragState = {
  intent: 'pending' | 'horizontal' | 'vertical';
  pointerId: number;
  startOffset: number;
  startX: number;
  startY: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function SwipeableInboxRow({ item, isLast, onDelete }: SwipeableInboxRowProps) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const deleteTimeoutRef = useRef<number | null>(null);
  const offsetXRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [rowHeight, setRowHeight] = useState<number | null>(null);
  const [rowWidth, setRowWidth] = useState(0);

  useLayoutEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    const measure = () => {
      setRowHeight(node.offsetHeight);
      setRowWidth(node.offsetWidth);
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current !== null) {
        window.clearTimeout(deleteTimeoutRef.current);
      }
    };
  }, []);

  const maxSwipe = Math.max(REVEAL_WIDTH + 24, Math.min(rowWidth * 0.82, 168));
  const deleteThreshold = Math.min(maxSwipe - 10, Math.max(88, rowWidth * 0.28));
  const revealProgress = maxSwipe > 0 ? clamp(Math.abs(offsetX) / maxSwipe, 0, 1) : 0;
  const revealOpacity = isDeleting ? 1 : revealProgress * 0.94;

  const setOffset = (nextOffset: number) => {
    offsetXRef.current = nextOffset;
    setOffsetX(nextOffset);
  };

  const releasePointer = (pointerId: number) => {
    const node = rowRef.current;
    if (node?.hasPointerCapture(pointerId)) {
      node.releasePointerCapture(pointerId);
    }
  };

  const finishDelete = () => {
    if (isDeleting) return;

    setIsDragging(false);
    setIsDeleting(true);
    setOffset(-(rowWidth || 320));

    deleteTimeoutRef.current = window.setTimeout(() => {
      onDelete(item.id);
    }, REMOVE_DURATION_MS);
  };

  const resetRow = () => {
    setIsDragging(false);
    setOffset(0);
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isDeleting) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    dragStateRef.current = {
      intent: 'pending',
      pointerId: event.pointerId,
      startOffset: offsetXRef.current,
      startX: event.clientX,
      startY: event.clientY,
    };
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    const node = rowRef.current;
    if (!dragState || !node || dragState.pointerId !== event.pointerId || isDeleting) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (dragState.intent === 'pending') {
      if (Math.abs(deltaX) < INTENT_THRESHOLD && Math.abs(deltaY) < INTENT_THRESHOLD) return;

      if (deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
        dragState.intent = 'horizontal';
        setIsDragging(true);
        node.setPointerCapture(event.pointerId);
      } else {
        dragState.intent = 'vertical';
        dragStateRef.current = null;
        return;
      }
    }

    if (dragState.intent !== 'horizontal') return;

    event.preventDefault();

    let nextOffset = dragState.startOffset + deltaX;
    nextOffset = Math.min(nextOffset, 0);

    if (nextOffset < -maxSwipe) {
      nextOffset = -maxSwipe - (Math.abs(nextOffset) - maxSwipe) * 0.18;
    }

    setOffset(clamp(nextOffset, -(rowWidth || maxSwipe), 0));
  };

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    if (dragState.intent === 'horizontal') {
      releasePointer(event.pointerId);

      if (Math.abs(offsetXRef.current) >= deleteThreshold) {
        finishDelete();
      } else {
        resetRow();
      }
    }

    dragStateRef.current = null;
  };

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        height: isDeleting ? 0 : rowHeight ?? 'auto',
        opacity: isDeleting ? 0 : 1,
        marginBottom: isDeleting || isLast ? 0 : 12,
        transition: 'height 220ms cubic-bezier(0.22, 1, 0.36, 1), margin-bottom 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 18,
          borderRadius: 24,
          background: 'linear-gradient(180deg, rgba(221, 72, 72, 0.96), rgba(194, 47, 47, 0.96))',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
          pointerEvents: 'none',
          opacity: revealOpacity,
          transition: isDragging || isDeleting ? 'none' : 'opacity 220ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FFF8F8' }}>
          <Trash2 size={18} />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: 0.2 }}>Delete</span>
        </div>
      </div>

      <div
        ref={rowRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 13,
          borderRadius: 22,
          background: `linear-gradient(180deg, rgba(255,255,255,0.72), rgba(245,248,252,0.42))`,
          border: '1px solid rgba(255,255,255,0.42)',
          boxShadow: '0 1px 0 rgba(214, 221, 230, 0.82), inset 0 1px 0 rgba(255,255,255,0.76)',
          paddingLeft: 14,
          paddingRight: 14,
          paddingTop: 13,
          paddingBottom: 13,
          transform: `translateX(${offsetX}px)`,
          transition: isDragging ? 'none' : 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
          touchAction: 'pan-y',
          userSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          willChange: 'transform',
          backdropFilter: 'blur(14px) saturate(135%)',
          WebkitBackdropFilter: 'blur(14px) saturate(135%)',
        }}
      >
        <SocialAvatar active={item.active} name={item.name} size={50} tone={item.tone} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 10,
            }}
          >
            <span style={{ flex: 1, color: colors.text, fontSize: 15, fontWeight: 700, minWidth: 0 }}>{item.name}</span>
            <span
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                flexShrink: 0,
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
    </div>
  );
}
