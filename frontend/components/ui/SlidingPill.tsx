'use client';

import { CSSProperties, ReactNode } from 'react';

export const ACTIVE_PILL_TRANSITION = '280ms cubic-bezier(0.22, 1, 0.36, 1)';

type SlidingPillProps = {
  activeIndex: number;
  optionCount: number;
  gap: number;
  inset: number;
  style?: CSSProperties;
  children: ReactNode;
};

export function SlidingPill({ activeIndex, optionCount, gap, inset, style, children }: SlidingPillProps) {
  const safeCount = Math.max(optionCount, 1);
  const safeIndex = Math.max(0, Math.min(activeIndex, safeCount - 1));

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: inset,
        bottom: inset,
        left: inset,
        width: `calc((100% - ${inset * 2}px - ${Math.max(0, safeCount - 1) * gap}px) / ${safeCount})`,
        transform: `translateX(calc(${safeIndex} * (100% + ${gap}px)))`,
        transition: `transform ${ACTIVE_PILL_TRANSITION}`,
        pointerEvents: 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
