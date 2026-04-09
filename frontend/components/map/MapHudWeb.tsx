'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

type MapHudWebProps = {
  currentCityLabel: string;
  nearbyCount: number;
  onSwitchCity: () => void;
  otherCityLabel: string;
  traveling: boolean;
};

export function MapHudWeb({ currentCityLabel, nearbyCount, onSwitchCity, otherCityLabel, traveling }: MapHudWebProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [panelWidth, setPanelWidth] = useState<number | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    function syncPanelWidth() {
      if (triggerRef.current) {
        setPanelWidth(triggerRef.current.offsetWidth);
      }
    }

    syncPanelWidth();
    window.addEventListener('resize', syncPanelWidth);

    return () => {
      window.removeEventListener('resize', syncPanelWidth);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        position: 'absolute',
        top: 18,
        left: 18,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'none',
        alignItems: 'flex-start',
      }}
    >
      <button
        ref={triggerRef}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        style={{
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 18px',
          borderRadius: 999,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,251,0.84))',
          border: '1px solid rgba(255,255,255,0.74)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: '0 20px 38px rgba(58,74,100,0.12), inset 0 1px 0 rgba(255,255,255,0.84)',
          pointerEvents: 'auto',
          cursor: 'pointer',
        }}
      >
        <span
          className="display-title"
          style={{
            margin: 0,
            color: 'rgba(32,39,51,0.84)',
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          Discover
        </span>
        <ChevronDown
          size={18}
          color="rgba(32,39,51,0.62)"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 240ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </button>

      {open ? (
        <div
          style={{
            alignSelf: 'flex-start',
            width: panelWidth ?? 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            padding: '16px 16px 14px',
            borderRadius: 24,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.94), rgba(248,250,251,0.86))',
            border: '1px solid rgba(255,255,255,0.76)',
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            boxShadow: '0 24px 42px rgba(58,74,100,0.14), inset 0 1px 0 rgba(255,255,255,0.86)',
            pointerEvents: 'auto',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ color: 'rgba(32,39,51,0.46)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {currentCityLabel}
            </span>
            <p style={{ margin: 0, color: 'rgba(32,39,51,0.82)', fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>
              {nearbyCount} nearby
            </p>
          </div>

          <div style={{ height: 1, background: 'rgba(198,206,218,0.42)' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ color: 'rgba(32,39,51,0.46)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Other cities
            </span>
            <button
              disabled={traveling}
              onClick={() => {
                setOpen(false);
                onSwitchCity();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                padding: '12px 14px',
                borderRadius: 18,
                border: '1px solid rgba(203,210,220,0.52)',
                background: traveling
                  ? 'linear-gradient(180deg, rgba(244,246,248,0.9), rgba(238,241,245,0.84))'
                  : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,247,250,0.94))',
                boxShadow: '0 14px 24px rgba(58,74,100,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                cursor: traveling ? 'default' : 'pointer',
              }}
            >
              <span style={{ color: traveling ? 'rgba(32,39,51,0.4)' : 'rgba(32,39,51,0.82)', fontSize: 14, fontWeight: 700 }}>
                {otherCityLabel}
              </span>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
