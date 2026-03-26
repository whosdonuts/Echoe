'use client';

import type { CSSProperties } from 'react';
import { colors } from '@/lib/theme/colors';
import styles from './OrbGlowLabelRow.module.css';

type OrbGlowLabelRowProps = {
  orbSrc: string;
  orbAlt: string;
  title: string;
  subtitle?: string;
  glowColors?: string[];
  className?: string;
  orbSize?: number;
  intensity?: number;
};

type GlowStyleVars = CSSProperties & {
  '--orb-size': string;
  '--row-gap': string;
  '--glow-c1': string;
  '--glow-c2': string;
  '--glow-c3': string;
  '--glow-c4': string;
  '--glow-core-opacity': string;
  '--glow-mid-opacity': string;
  '--glow-wash-opacity': string;
  '--glow-core-blur': string;
  '--glow-mid-blur': string;
  '--glow-wash-blur': string;
  '--glow-halo-scale': string;
};

const defaultGlowColors = [
  'rgba(233, 167, 142, 0.34)',
  'rgba(243, 214, 139, 0.24)',
  'rgba(231, 155, 138, 0.16)',
  'rgba(255, 244, 227, 0.12)',
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function getGlowPalette(glowColors: string[] | undefined) {
  const palette = glowColors && glowColors.length >= 2 ? glowColors.slice(0, 4) : defaultGlowColors;
  const [c1, c2, c3 = c1, c4 = c2] = palette;
  return [c1, c2, c3, c4] as const;
}

export function OrbGlowLabelRow({
  orbSrc,
  orbAlt,
  title,
  subtitle,
  glowColors,
  className,
  orbSize = 68,
  intensity = 0.92,
}: OrbGlowLabelRowProps) {
  const [glowC1, glowC2, glowC3, glowC4] = getGlowPalette(glowColors);
  const glowStrength = clamp(intensity, 0.45, 1.4);
  const rowClassName = [styles.row, className].filter(Boolean).join(' ');
  const resolvedGap = clamp(Math.round(orbSize * 0.28), 14, 24);

  const glowVars: GlowStyleVars = {
    '--orb-size': `${orbSize}px`,
    '--row-gap': `${resolvedGap}px`,
    '--glow-c1': glowC1,
    '--glow-c2': glowC2,
    '--glow-c3': glowC3,
    '--glow-c4': glowC4,
    '--glow-core-opacity': `${0.88 * glowStrength}`,
    '--glow-mid-opacity': `${0.64 * glowStrength}`,
    '--glow-wash-opacity': `${0.48 * glowStrength}`,
    '--glow-core-blur': `${28 + glowStrength * 16}px`,
    '--glow-mid-blur': `${54 + glowStrength * 22}px`,
    '--glow-wash-blur': `${84 + glowStrength * 34}px`,
    '--glow-halo-scale': `${1 + (glowStrength - 1) * 0.12}`,
  };

  return (
    <div className={rowClassName} style={glowVars}>
      <div className={styles.orbWrap}>
        <img alt={orbAlt} className={styles.orb} src={orbSrc} />
      </div>

      <div className={styles.textSide}>
        <div aria-hidden className={styles.haze}>
          <div className={`${styles.layer} ${styles.core}`} />
          <div className={`${styles.layer} ${styles.mid}`} />
          <div className={`${styles.layer} ${styles.wash}`} />
        </div>

        <div className={styles.copy}>
          <span className={styles.title}>{title}</span>
          {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
        </div>
      </div>
    </div>
  );
}

export const orbGlowLabelRowDefaults = {
  glowColors: defaultGlowColors,
  orbSize: 68,
  intensity: 0.92,
  titleColor: colors.echoInk,
  subtitleColor: colors.textMuted,
};
