'use client';

import { CSSProperties, ReactNode, ComponentProps } from 'react';
import { LucideIcon, Map, Radio, Users, Compass, User, Mail, UserPlus, Trophy, ArrowLeftRight } from 'lucide-react';
import { colors } from '@/lib/theme/colors';

export type SegmentOption = {
  key: string;
  label: string;
};

type SocialSegmentedControlProps = {
  options: ReadonlyArray<SegmentOption>;
  activeKey: string;
  onChange: (nextKey: string) => void;
  style?: CSSProperties;
  fullWidth?: boolean;
  compact?: boolean;
};

type SocialIconButtonProps = {
  icon: string;
  onPress: () => void;
  accent?: boolean;
  style?: CSSProperties;
};

type SocialLogoBadgeProps = {
  icon: string;
  accent?: boolean;
};

type SocialCardProps = {
  children: ReactNode;
  style?: CSSProperties;
};

function getIcon(iconName: string): ReactNode {
  const iconMap: Record<string, ReactNode> = {
    'mail-outline': <Mail size={18} />,
    'person-add-outline': <UserPlus size={18} />,
    'trophy-outline': <Trophy size={18} />,
    'swap-horizontal': <ArrowLeftRight size={18} />,
    'people-outline': <Users size={18} />,
    'map-outline': <Map size={18} />,
    'radio-outline': <Radio size={18} />,
    'compass-outline': <Compass size={18} />,
    'person-outline': <User size={18} />,
  };
  return iconMap[iconName] ?? <span style={{ fontSize: 14 }}>●</span>;
}

export function SocialSegmentedControl({
  options,
  activeKey,
  onChange,
  style,
  fullWidth = false,
  compact = false,
}: SocialSegmentedControlProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        padding: 5,
        borderRadius: 24,
        backgroundColor: '#FFFDF9',
        border: '1px solid rgba(225, 214, 203, 0.88)',
        boxShadow: '0 8px 16px rgba(84, 56, 41, 0.10)',
        ...style,
      }}
    >
      {options.map((option) => {
        const active = option.key === activeKey;
        return (
          <button
            key={option.key}
            onClick={() => onChange(option.key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 18,
              paddingLeft: 14,
              paddingRight: 14,
              paddingTop: compact ? 9 : 11,
              paddingBottom: compact ? 9 : 11,
              flex: fullWidth ? 1 : undefined,
              backgroundColor: active ? colors.echoPrimaryTerracotta : 'transparent',
              boxShadow: active ? '0 6px 12px rgba(218, 115, 82, 0.26)' : 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <span
              style={{
                color: active ? colors.echoMainWhite : colors.echoOliveBronze,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.2,
              }}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SocialIconButton({ icon, onPress, accent = false, style }: SocialIconButtonProps) {
  return (
    <button
      onClick={onPress}
      style={{
        width: 42,
        height: 42,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 21,
        backgroundColor: accent ? colors.echoPrimaryTerracotta : '#FFFFFF',
        border: `1px solid ${accent ? colors.echoPrimaryTerracotta : 'rgba(226, 215, 205, 0.86)'}`,
        boxShadow: '0 6px 12px rgba(84, 56, 41, 0.08)',
        cursor: 'pointer',
        color: accent ? colors.echoMainWhite : colors.echoDarkCocoa,
        ...style,
      }}
    >
      {getIcon(icon)}
    </button>
  );
}

export function SocialLogoBadge({ icon, accent = true }: SocialLogoBadgeProps) {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
        border: `1px solid ${accent ? 'rgba(227, 172, 150, 0.36)' : 'rgba(225, 214, 203, 0.86)'}`,
        backgroundColor: accent ? '#FBE8DE' : '#F8F2EB',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 19,
          backgroundColor: 'rgba(255, 255, 255, 0.66)',
          color: accent ? colors.echoDeepTerracotta : colors.echoOliveBronze,
        }}
      >
        {getIcon(icon)}
      </div>
    </div>
  );
}

export function SocialCard({ children, style }: SocialCardProps) {
  return (
    <div
      style={{
        borderRadius: 28,
        backgroundColor: '#FFFEFC',
        border: '1px solid rgba(226, 215, 205, 0.9)',
        boxShadow: '0 10px 20px rgba(75, 52, 39, 0.10)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
