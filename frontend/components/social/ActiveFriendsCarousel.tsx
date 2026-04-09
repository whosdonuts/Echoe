'use client';

import { PointerEvent, WheelEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { SocialAvatarRecord } from '@/lib/data/socialMock';
import { colors } from '@/lib/theme/colors';
import { SocialAvatar } from '@/components/social/SocialAvatar';

type ActiveFriendsCarouselProps = {
  friends: SocialAvatarRecord[];
};

const ITEM_WIDTH = 76;
const ITEM_GAP = 14;
const SIDE_PADDING = 10;
const REPEAT_SETS = 5;
const CENTER_SET_INDEX = Math.floor(REPEAT_SETS / 2);
const AUTO_DRIFT_PX_PER_SECOND = 10;
const RESUME_DELAY_MS = 2000;
const DRAG_INTENT_THRESHOLD = 8;

type DragState = {
  intent: 'pending' | 'horizontal' | 'vertical';
  pointerId: number;
  startPosition: number;
  startX: number;
  startY: number;
};

function buildRepeatedFriends(friends: SocialAvatarRecord[]) {
  const repeated: Array<{ friend: SocialAvatarRecord; repeatIndex: number }> = [];

  for (let repeatIndex = 0; repeatIndex < REPEAT_SETS; repeatIndex += 1) {
    for (const friend of friends) {
      repeated.push({ friend, repeatIndex });
    }
  }

  return repeated;
}

function mod(value: number, base: number) {
  if (base === 0) return 0;
  return ((value % base) + base) % base;
}

export function ActiveFriendsCarousel({ friends }: ActiveFriendsCarouselProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const positionRef = useRef(0);
  const resumeAtRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const repeatedFriends = buildRepeatedFriends(friends);
  const canLoop = friends.length > 1;
  const cycleWidth = friends.length * (ITEM_WIDTH + ITEM_GAP);

  const applyTrackTransform = () => {
    const track = trackRef.current;
    if (!track || !canLoop || cycleWidth === 0) return;

    const wrappedPosition = mod(positionRef.current, cycleWidth);
    const translateX = wrappedPosition - CENTER_SET_INDEX * cycleWidth;
    track.style.transform = `translate3d(${translateX}px, 0, 0)`;
  };

  const pauseAutoplay = (delayMs = RESUME_DELAY_MS) => {
    resumeAtRef.current = performance.now() + delayMs;
  };

  useLayoutEffect(() => {
    positionRef.current = 0;
    applyTrackTransform();
    lastFrameTimeRef.current = 0;
  }, [cycleWidth, canLoop]);

  useEffect(() => {
    if (!canLoop) return;

    let frameId = 0;

    const step = (timestamp: number) => {
      if (lastFrameTimeRef.current === 0) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsedMs = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      if (!dragStateRef.current && timestamp >= resumeAtRef.current) {
        positionRef.current += (AUTO_DRIFT_PX_PER_SECOND * elapsedMs) / 1000;
        applyTrackTransform();
      }

      frameId = window.requestAnimationFrame(step);
    };

    frameId = window.requestAnimationFrame(step);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [canLoop, cycleWidth]);

  const endDrag = (pointerId?: number) => {
    const dragState = dragStateRef.current;
    const viewport = viewportRef.current;
    if (!dragState) return;
    if (typeof pointerId === 'number' && dragState.pointerId !== pointerId) return;

    if (viewport?.hasPointerCapture(dragState.pointerId)) {
      viewport.releasePointerCapture(dragState.pointerId);
    }

    dragStateRef.current = null;
    setIsDragging(false);
    pauseAutoplay();
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!canLoop) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    dragStateRef.current = {
      intent: 'pending',
      pointerId: event.pointerId,
      startPosition: positionRef.current,
      startX: event.clientX,
      startY: event.clientY,
    };

    pauseAutoplay();
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const dragState = dragStateRef.current;
    const viewport = viewportRef.current;
    if (!dragState || !viewport || dragState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (dragState.intent === 'pending') {
      if (Math.abs(deltaX) < DRAG_INTENT_THRESHOLD && Math.abs(deltaY) < DRAG_INTENT_THRESHOLD) return;

      if (Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
        dragState.intent = 'horizontal';
        viewport.setPointerCapture(event.pointerId);
        setIsDragging(true);
      } else {
        dragState.intent = 'vertical';
        dragStateRef.current = null;
        return;
      }
    }

    if (dragState.intent !== 'horizontal') return;

    event.preventDefault();
    positionRef.current = dragState.startPosition + deltaX;
    applyTrackTransform();
    pauseAutoplay();
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!canLoop) return;

    const dominantDelta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (dominantDelta === 0) return;

    positionRef.current -= dominantDelta;
    applyTrackTransform();
    pauseAutoplay();
  };

  return (
    <div
      ref={viewportRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(event) => endDrag(event.pointerId)}
      onPointerCancel={(event) => endDrag(event.pointerId)}
      onPointerLeave={(event) => {
        if (event.pointerType !== 'mouse') {
          endDrag(event.pointerId);
        }
      }}
      onWheel={handleWheel}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: 'calc(100% + 32px)',
        marginLeft: -16,
        marginRight: -16,
        paddingLeft: SIDE_PADDING,
        paddingRight: SIDE_PADDING,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'pan-y',
        userSelect: 'none',
      }}
      aria-label="Friends currently active"
    >
      <div
        ref={trackRef}
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: ITEM_GAP,
          width: 'max-content',
          willChange: 'transform',
        }}
      >
        {repeatedFriends.map(({ friend, repeatIndex }, index) => (
          <div
            key={`${friend.id}-${repeatIndex}-${index}`}
            aria-hidden={repeatIndex !== CENTER_SET_INDEX}
            style={{ width: ITEM_WIDTH, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}
          >
            <SocialAvatar active={friend.active} name={friend.name} tone={friend.tone} />
            <span
              style={{
                width: '100%',
                color: colors.textSoft,
                fontSize: 12,
                fontWeight: 600,
                textAlign: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {friend.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
