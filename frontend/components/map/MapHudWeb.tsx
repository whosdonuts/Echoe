'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const panelRef = useRef<HTMLDivElement>(null);
  const [panelWidth, setPanelWidth] = useState<number | null>(null);
  const [panelHeight, setPanelHeight] = useState(0);

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

  useLayoutEffect(() => {
    function syncPanelHeight() {
      if (panelRef.current) {
        setPanelHeight(panelRef.current.scrollHeight);
      }
    }

    syncPanelHeight();
    window.addEventListener('resize', syncPanelHeight);

    return () => {
      window.removeEventListener('resize', syncPanelHeight);
    };
  }, [currentCityLabel, nearbyCount, otherCityLabel, traveling, panelWidth]);

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
      <div
        style={{
          alignSelf: 'flex-start',
          position: 'relative',
          width: panelWidth ?? 'fit-content',
          pointerEvents: 'auto',
        }}
      >
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            borderRadius: open ? 26 : 999,
            background: open
              ? 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(246,249,251,0.9))'
              : 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(248,250,251,0.84))',
            border: '1px solid rgba(255,255,255,0.74)',
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            boxShadow: open
              ? '0 18px 34px rgba(58,74,100,0.12), inset 0 1px 0 rgba(255,255,255,0.88)'
              : '0 20px 38px rgba(58,74,100,0.12), inset 0 1px 0 rgba(255,255,255,0.84)',
            transition: 'border-radius 360ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 360ms cubic-bezier(0.22, 1, 0.36, 1), background 360ms cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <button
            ref={triggerRef}
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'grid',
              gridTemplateColumns: '18px minmax(0, 1fr) 18px',
              alignItems: 'center',
              columnGap: 10,
              width: '100%',
              padding: '12px 18px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              appearance: 'none',
              transition: 'padding 320ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <span aria-hidden="true" style={{ width: 18, height: 18 }} />
            <span
              className="display-title"
              style={{
                margin: 0,
                color: 'rgba(32,39,51,0.84)',
                fontSize: 22,
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                textAlign: 'center',
              }}
            >
              Discover
            </span>
            <ChevronDown
              size={18}
              color="rgba(32,39,51,0.62)"
              style={{
                transform: open ? 'rotate(180deg) translateY(1px)' : 'rotate(0deg) translateY(0px)',
                transition: 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1)',
                justifySelf: 'end',
              }}
            />
          </button>
          <div
            aria-hidden={!open}
            style={{
              maxHeight: open ? panelHeight + 24 : 0,
              opacity: open ? 1 : 0,
              transform: open ? 'translateY(0) scaleY(1)' : 'translateY(-8px) scaleY(0.96)',
              transformOrigin: 'top center',
              overflow: 'hidden',
              filter: open ? 'blur(0px)' : 'blur(1px)',
              transition: 'max-height 360ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, transform 360ms cubic-bezier(0.22, 1, 0.36, 1), filter 220ms ease',
              pointerEvents: open ? 'auto' : 'none',
            }}
          >
            <div
              ref={panelRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                padding: '8px 16px 14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignSelf: 'center',
                  width: 'calc(100% - 10px)',
                  height: 1,
                  background: 'linear-gradient(90deg, rgba(198,206,218,0), rgba(198,206,218,0.48) 16%, rgba(198,206,218,0.48) 84%, rgba(198,206,218,0))',
                  opacity: open ? 1 : 0,
                  transition: 'opacity 220ms ease',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', textAlign: 'center' }}>
                <span style={{ color: 'rgba(32,39,51,0.46)', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {currentCityLabel}
                </span>
                <p style={{ margin: 0, color: 'rgba(32,39,51,0.82)', fontSize: 15, fontWeight: 700, letterSpacing: -0.2 }}>
                  {nearbyCount} nearby
                </p>
              </div>

              <div style={{ alignSelf: 'center', width: 'calc(100% - 10px)', height: 1, background: 'rgba(198,206,218,0.42)' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', textAlign: 'center' }}>
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
                    justifyContent: 'center',
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 18,
                    border: '1px solid rgba(203,210,220,0.52)',
                    background: traveling
                      ? 'linear-gradient(180deg, rgba(244,246,248,0.9), rgba(238,241,245,0.84))'
                      : 'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(244,247,250,0.94))',
                    boxShadow: '0 14px 24px rgba(58,74,100,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                    cursor: traveling ? 'default' : 'pointer',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ color: traveling ? 'rgba(32,39,51,0.4)' : 'rgba(32,39,51,0.82)', fontSize: 14, fontWeight: 700 }}>
                    {otherCityLabel}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
