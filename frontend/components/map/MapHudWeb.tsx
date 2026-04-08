import { barcelonaCount, barcelonaUnlockedCount, featuredCount, londonCount, westernCount } from '@/lib/features/map/runtimeData';

type MapHudWebProps = {
  tokenLoaded: boolean;
};

export function MapHudWeb({ tokenLoaded }: MapHudWebProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 18,
        left: 18,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          alignSelf: 'flex-start',
          padding: '11px 18px',
          borderRadius: 999,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.76))',
          border: '1px solid rgba(255,255,255,0.74)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: '0 20px 38px rgba(58,74,100,0.12), inset 0 1px 0 rgba(255,255,255,0.84)',
          pointerEvents: 'auto',
        }}
      >
        <h1
          style={{
            margin: 0,
            color: 'rgba(32,39,51,0.64)',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          Discover
        </h1>
      </div>
      <div
        style={{
          alignSelf: 'flex-start',
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
          padding: '14px 15px',
          borderRadius: 22,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.84), rgba(255,255,255,0.68))',
          border: '1px solid rgba(255,255,255,0.72)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          boxShadow: '0 20px 40px rgba(58,74,100,0.12), inset 0 1px 0 rgba(255,255,255,0.82)',
          pointerEvents: 'auto',
        }}
      >
        <StatRow color="#6B8AB6" text={`${westernCount} campus - ${londonCount} city`} />
        <StatRow color="#8298C6" text={`${featuredCount} featured`} />
        <StatRow color="#9EABCF" text={`${barcelonaCount} Barcelona - ${barcelonaUnlockedCount} unlocked`} />
        <StatRow color={tokenLoaded ? '#059669' : '#dc2626'} text={`Token: ${tokenLoaded ? 'loaded' : 'missing'}`} />
      </div>
    </div>
  );
}

function StatRow({ color, text }: { color: string; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: 999,
          background: color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span style={{ color: 'rgba(32,39,51,0.56)', fontSize: 11, fontWeight: 600 }}>{text}</span>
    </div>
  );
}
