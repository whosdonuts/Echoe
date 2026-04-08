import { OrbGlowLabelRow, orbGlowLabelRowDefaults } from '@/components/ui/OrbGlowLabelRow';
import { colors } from '@/lib/theme/colors';

export default function OrbGlowDemoPage() {
  return (
    <main
      style={{
        minHeight: '100%',
        padding: '32px 20px 120px',
        background: `linear-gradient(180deg, ${colors.backgroundWarm} 0%, ${colors.background} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 28,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span
          style={{
            color: colors.textMuted,
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 0.7,
            textTransform: 'uppercase',
          }}
        >
          Orb Glow Label Row
        </span>
        <h1
          style={{
            color: colors.echoInk,
            fontSize: 28,
            lineHeight: '32px',
            fontWeight: 800,
            letterSpacing: -0.5,
            margin: 0,
          }}
        >
          Reusable text-side glow treatment
        </h1>
        <p
          style={{
            color: colors.textSoft,
            fontSize: 14,
            lineHeight: '21px',
            maxWidth: 360,
            margin: 0,
          }}
        >
          The orb image stays sharp and untouched. Only the right-side text region gets the layered
          ambient haze.
        </p>
      </div>

      <section
        style={{
          borderRadius: 28,
          padding: 24,
          background: 'rgba(255, 252, 248, 0.78)',
          border: `1px solid ${colors.echoLineSoft}`,
          boxShadow: '0 18px 48px rgba(53, 40, 33, 0.08)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        <OrbGlowLabelRow
          orbAlt="All cities"
          orbSize={78}
          orbSrc="/echo-orbs/all-earth.png"
          subtitle="Browse all cities"
          title="All"
        />

        <OrbGlowLabelRow
          glowColors={[
            'rgba(225, 136, 116, 0.34)',
            'rgba(242, 196, 124, 0.26)',
            'rgba(244, 164, 141, 0.16)',
            'rgba(255, 242, 228, 0.14)',
          ]}
          intensity={1.04}
          orbAlt="Barcelona"
          orbSize={72}
          orbSrc="/echo-orbs/barcelona-ca.png"
          subtitle="Apr 02"
          title="Barcelona"
        />
      </section>

      <section
        style={{
          borderRadius: 24,
          padding: 20,
          background: 'rgba(255, 255, 255, 0.56)',
          border: `1px solid ${colors.borderSoft}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <span
          style={{
            color: colors.echoInk,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: -0.2,
          }}
        >
          Usage example
        </span>
        <pre
          style={{
            margin: 0,
            whiteSpace: 'pre-wrap',
            color: colors.textSoft,
            fontSize: 12,
            lineHeight: '18px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          }}
        >
{`<OrbGlowLabelRow
  orbSrc="/echo-orbs/all-earth.png"
  orbAlt="All cities"
  title="All"
  subtitle="Browse all cities"
  glowColors={${JSON.stringify(orbGlowLabelRowDefaults.glowColors)}}
  orbSize={${orbGlowLabelRowDefaults.orbSize}}
  intensity={${orbGlowLabelRowDefaults.intensity}}
/>`}
        </pre>
      </section>
    </main>
  );
}
