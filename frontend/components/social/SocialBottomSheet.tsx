'use client';

import { CSSProperties, PointerEvent, ReactNode, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { colors } from '@/lib/theme/colors';

type SocialBottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  header?: ReactNode;
  children: ReactNode;
  bodyStyle?: CSSProperties;
  contentClassName?: string;
  maxWidth?: number;
  zIndex?: number;
  expandedOnly?: boolean;
};

type SheetSnap = 'partial' | 'expanded';

type DragState = {
  pointerId: number;
  startOffset: number;
  startY: number;
};

const SHEET_TOP_GAP = 14;
const SHEET_MAX_HEIGHT = 860;
const PARTIAL_REVEAL_RATIO = 0.46;
export const SOCIAL_BOTTOM_SHEET_ENTER_EXIT_MS = 360;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function SocialBottomSheet({
  visible,
  onClose,
  header,
  children,
  bodyStyle,
  contentClassName,
  maxWidth = 480,
  zIndex = 200,
  expandedOnly = false,
}: SocialBottomSheetProps) {
  const closeTimerRef = useRef<number | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const dragOffsetRef = useRef(0);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const [isMounted, setIsMounted] = useState(visible);
  const [isOpen, setIsOpen] = useState(false);
  const [snap, setSnap] = useState<SheetSnap>('partial');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [overlayRoot, setOverlayRoot] = useState<HTMLElement | null>(() =>
    typeof document === 'undefined' ? null : document.getElementById('app-shell-overlays'),
  );
  const [containerHeight, setContainerHeight] = useState(() => (typeof window === 'undefined' ? 844 : window.innerHeight));

  useEffect(() => {
    setOverlayRoot(document.getElementById('app-shell-overlays'));
  }, []);

  useEffect(() => {
    if (!overlayRoot) return;

    const syncHeight = () => {
      setContainerHeight(overlayRoot.clientHeight || window.innerHeight);
    };

    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(overlayRoot);
    window.addEventListener('resize', syncHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', syncHeight);
    };
  }, [overlayRoot]);

  const setTrackedDragOffset = (nextOffset: number) => {
    dragOffsetRef.current = nextOffset;
    setDragOffset(nextOffset);
  };

  useEffect(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    if (visible) {
      setIsMounted(true);
      setSnap(expandedOnly ? 'expanded' : 'partial');
      setIsDragging(false);
      setTrackedDragOffset(0);

      const rafId = window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsOpen(true);
        });
      });

      return () => {
        window.cancelAnimationFrame(rafId);
      };
    }

    setIsOpen(false);
    setIsDragging(false);
    setTrackedDragOffset(0);

    closeTimerRef.current = window.setTimeout(() => {
      setIsMounted(false);
      closeTimerRef.current = null;
    }, SOCIAL_BOTTOM_SHEET_ENTER_EXIT_MS);

    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
    };
  }, [expandedOnly, visible]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  if (!isMounted || !overlayRoot) return null;

  const sheetHeight = Math.max(320, Math.min(containerHeight - SHEET_TOP_GAP, SHEET_MAX_HEIGHT));
  const partialOffset = expandedOnly ? 0 : Math.round(sheetHeight * (1 - PARTIAL_REVEAL_RATIO));
  const closedOffset = sheetHeight + 40;
  const settledOffset = expandedOnly ? 0 : snap === 'expanded' ? 0 : partialOffset;
  const translateY = !isOpen ? closedOffset : isDragging ? dragOffset : settledOffset;

  const endDrag = (pointerId?: number) => {
    const dragState = dragStateRef.current;
    if (!dragState) return;
    if (typeof pointerId === 'number' && dragState.pointerId !== pointerId) return;

    if (handleRef.current?.hasPointerCapture(dragState.pointerId)) {
      handleRef.current.releasePointerCapture(dragState.pointerId);
    }

    if (expandedOnly) {
      const closeThreshold = Math.max(120, Math.min(220, sheetHeight * 0.18));
      const shouldClose = dragOffsetRef.current >= closeThreshold;

      setIsDragging(false);
      dragStateRef.current = null;

      if (shouldClose) {
        onClose();
        return;
      }

      setTrackedDragOffset(0);
      return;
    }

    const nextSnap = dragOffsetRef.current <= partialOffset * 0.55 ? 'expanded' : 'partial';
    setSnap(nextSnap);
    setIsDragging(false);
    setTrackedDragOffset(nextSnap === 'expanded' ? 0 : partialOffset);
    dragStateRef.current = null;
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    dragStateRef.current = {
      pointerId: event.pointerId,
      startOffset: settledOffset,
      startY: event.clientY,
    };

    setIsDragging(true);
    setTrackedDragOffset(settledOffset);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const maxOffset = expandedOnly ? closedOffset : partialOffset;
    const rawOffset = dragState.startOffset + (event.clientY - dragState.startY);
    let nextOffset = clamp(rawOffset, 0, maxOffset);

    if (rawOffset < 0) {
      nextOffset = rawOffset * 0.24;
    } else if (rawOffset > maxOffset) {
      nextOffset = maxOffset + (rawOffset - maxOffset) * 0.24;
    }

    setTrackedDragOffset(nextOffset);
  };

  const sheet = (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundColor: 'rgba(54, 68, 94, 0.14)',
        opacity: isOpen ? 1 : 0,
        transition: `opacity ${SOCIAL_BOTTOM_SHEET_ENTER_EXIT_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        backdropFilter: `blur(${isOpen ? 18 : 0}px)`,
        WebkitBackdropFilter: `blur(${isOpen ? 18 : 0}px)`,
        pointerEvents: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth,
          height: sheetHeight,
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${colors.shellSurfaceSoft})`,
          borderTop: `1px solid ${colors.shellBorderSoft}`,
          boxShadow: `0 -24px 44px ${colors.shellShadowStrong}, inset 0 1px 0 rgba(255,255,255,0.9)`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : `transform ${SOCIAL_BOTTOM_SHEET_ENTER_EXIT_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          willChange: 'transform',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          ref={handleRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={(event) => endDrag(event.pointerId)}
          onPointerCancel={(event) => endDrag(event.pointerId)}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 30,
            paddingTop: 10,
            paddingBottom: 10,
            touchAction: 'none',
            cursor: isDragging ? 'grabbing' : 'ns-resize',
            flexShrink: 0,
          }}
        >
          <div style={{ width: 46, height: 5, borderRadius: 999, backgroundColor: 'rgba(138, 146, 157, 0.26)' }} />
        </div>

        {header}

        <div
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            ...bodyStyle,
          }}
          className={contentClassName}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(sheet, overlayRoot);
}
