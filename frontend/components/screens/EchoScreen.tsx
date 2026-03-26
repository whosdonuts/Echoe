'use client';

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from 'react';
import { ArrowLeft, Search, SlidersHorizontal, ChevronRight, Radio } from 'lucide-react';
import {
  EchoCity,
  EchoCollectionItem,
  EchoGalleryItem,
  allEchoCities,
  allCitiesOrbImage,
  getEchoCity,
  getEchoCityMineEchoes,
  getEchoCityOtherEchoes,
  getEchoGalleryItemsForCity,
  recentEchoCities,
} from '@/lib/data/echoMock';
import { formatEchoFullDate } from '@/lib/formatEchoDate';
import { colors } from '@/lib/theme/colors';
import { shellMetrics } from '@/lib/theme/layout';

type EchoView = 'main' | 'allCities' | 'cityDetail' | 'gallery';
type EchoDetailTab = 'mine' | 'others';
type CityOrigin = 'main' | 'allCities';
type WheelItem = { type: 'city'; city: EchoCity } | { type: 'all' };
type ArchiveSortKey = 'distance' | 'recent' | 'progress';
type ArchiveSlotPosition = { slotId: number; row: number; column: number; baseX: number; baseY: number };

const orbSize = 96;
const wheelRotationPerPixel = 0.0095;
const archiveSortOptions: ArchiveSortKey[] = ['distance', 'recent', 'progress'];
const archiveRowLengths = [4, 5, 6, 7, 6, 5, 4] as const;
const archiveSlotCount = 37;
const archiveMinScale = 0.3;
const archiveMaxScale = 1.1;
const wheelTapSnapDurationMs = 400;
const wheelCaptureVelocityThreshold = 1.1;
const wheelCaptureSpring = 30;
const wheelCaptureDamping = 11;
const wheelSettleVelocityFloor = 0.02;

const cityDistanceKm: Record<string, number> = {
  'toronto-on': 0,
  'etobicoke-on': 15,
  'mississauga-on': 27,
  'milton-on': 55,
  'hamilton-on': 74,
  'london-on': 192,
  'montreal-on': 542,
  'nyc-ny': 877,
  'orlando-fl': 1823,
  'seattle-wa': 4240,
  'kingston-cu': 3022,
  'barcelona-ca': 6554,
  'london-uk': 7220,
};

function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function withAlpha(hex: string, alpha: string) {
  if (!hex.startsWith('#') || hex.length !== 7) return hex;
  return `${hex}${alpha}`;
}
function joinMeta(parts: Array<string | undefined>) { return parts.filter(Boolean).join(' / '); }

function hexToRgba(hex: string, alpha: number) {
  if (!hex.startsWith('#') || hex.length !== 7) return hex;
  return `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)}, ${alpha})`;
}

/** Builds a more visible but still restrained haze palette from the selected orb metadata. */
function makeGlowFromCity(city: EchoCity): string[] {
  return [
    hexToRgba(city.glowPalette.core, 0.38),
    hexToRgba(city.glowPalette.mid, 0.34),
    hexToRgba(city.glowPalette.soft, 0.26),
    hexToRgba(city.glowPalette.wash, 0.16),
  ];
}
function formatCityVisitDate(city: Pick<EchoCity, 'visitedAt'>) {
  return formatEchoFullDate(city.visitedAt);
}
function distanceKmForCity(city: EchoCity) { return cityDistanceKm[city.id] ?? 9999; }
function searchArchiveCities(cities: EchoCity[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return cities;
  return cities.filter((city) =>
    [city.name, city.country, city.note, formatCityVisitDate(city), city.recencyLabel].some((v) => v.toLowerCase().includes(normalized)),
  );
}
function sortArchiveCities(cities: EchoCity[], sortKey: ArchiveSortKey) {
  const indexed = cities.map((city, index) => ({ city, index }));
  if (sortKey === 'distance') return indexed.sort((a, b) => distanceKmForCity(a.city) - distanceKmForCity(b.city) || a.index - b.index).map(({ city }) => city);
  if (sortKey === 'progress') return indexed.sort((a, b) => b.city.collectionProgress - a.city.collectionProgress || b.city.collectedCount - a.city.collectedCount || a.index - b.index).map(({ city }) => city);
  return indexed.sort((a, b) => a.index - b.index).map(({ city }) => city);
}
function createArchiveSlotPositions(itemSize: number) {
  const horizontalStep = itemSize * 1.07;
  const verticalStep = itemSize;
  let slotId = 0;
  return archiveRowLengths.flatMap((length, rowIndex) => {
    const centeredRow = rowIndex - Math.floor(archiveRowLengths.length / 2);
    const startX = -((length - 1) * horizontalStep) / 2;
    return Array.from({ length }, (_, column) => ({
      slotId: slotId++, row: rowIndex, column, baseX: startX + column * horizontalStep, baseY: centeredRow * verticalStep,
    }));
  });
}
function normalizeAngle(angle: number) {
  let n = angle % (Math.PI * 2);
  if (n <= -Math.PI) n += Math.PI * 2;
  if (n > Math.PI) n -= Math.PI * 2;
  return n;
}
function angularDistance(from: number, to: number) { return Math.abs(normalizeAngle(from - to)); }
function snapRotationToStep(rotation: number, stepAngle: number) { return Math.round(rotation / stepAngle) * stepAngle; }
function nearestRotationForIndex(index: number, currentRotation: number, stepAngle: number) {
  const base = -index * stepAngle;
  const turn = Math.PI * 2;
  const turnIndex = Math.round((currentRotation - base) / turn);
  const candidates = [turnIndex - 1, turnIndex, turnIndex + 1].map((v) => base + v * turn);
  return candidates.reduce((closest, candidate) =>
    Math.abs(candidate - currentRotation) < Math.abs(closest - currentRotation) ? candidate : closest,
  );
}


function ProgressRail({ progress }: { progress: number }) {
  return (
    <div style={{ width: '100%', height: 4, borderRadius: 999, backgroundColor: '#E8E1D9', overflow: 'hidden' }}>
      <div
        style={{
          height: '100%',
          borderRadius: 999,
          width: `${Math.max(10, Math.min(100, progress * 100))}%`,
          background: `linear-gradient(to right, ${colors.echoTrackFill}, ${colors.echoTrackFillSoft})`,
        }}
      />
    </div>
  );
}

function BackPill({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      style={{
        display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8,
        borderRadius: 999, paddingLeft: 13, paddingRight: 13, paddingTop: 10, paddingBottom: 10,
        backgroundColor: colors.echoGlass, border: `1px solid ${colors.echoLineSoft}`,
        cursor: 'pointer', color: colors.echoInk,
      }}
    >
      <ArrowLeft size={15} color={colors.echoInk} />
      <span style={{ color: colors.echoInk, fontSize: 13, fontWeight: 700 }}>{label}</span>
    </button>
  );
}

function FilterChip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      style={{
        borderRadius: 999, paddingLeft: 12, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
        backgroundColor: active ? colors.echoInk : colors.echoGlass,
        border: `1px solid ${active ? colors.echoInk : colors.echoLineSoft}`,
        cursor: 'pointer',
      }}
    >
      <span style={{ color: active ? '#FFFFFF' : colors.echoInk, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>
        {label.toUpperCase()}
      </span>
    </button>
  );
}

function WheelOrb({ item, active, x, y, zIndex, scale, opacity, onPress }: {
  item: WheelItem; active: boolean; x: number; y: number; zIndex: number; scale: number; opacity: number; onPress: () => void;
}) {
  const isAllOrb = item.type === 'all';
  const orbSrc = isAllOrb ? allCitiesOrbImage : item.city.image;
  const label = isAllOrb ? 'All' : item.city.name;

  return (
    <button
      onClick={onPress}
      style={{
        position: 'absolute',
        width: orbSize,
        height: orbSize,
        left: x - orbSize / 2,
        top: y - orbSize / 2,
        opacity,
        transform: `scale(${scale})`,
        zIndex,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'none', border: 'none', outline: 'none', cursor: 'pointer', padding: 0,
      }}
    >
      {isAllOrb ? (
        <div
          style={{
            width: orbSize,
            height: orbSize,
            borderRadius: '50%',
            overflow: 'hidden',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={orbSrc}
            alt={label}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              flexShrink: 0,
            }}
          />
        </div>
      ) : (
        <img
          src={orbSrc}
          alt={label}
          style={{ width: orbSize, height: orbSize, objectFit: 'contain', display: 'block' }}
        />
      )}
    </button>
  );
}

function ArchiveCityOrb({ city, focused, placeholder, scale, focus, opacity, itemSize, x, y, zIndex, onPress }: {
  city: EchoCity | null; focused: boolean; placeholder: boolean; scale: number; focus: number; opacity: number;
  itemSize: number; x: number; y: number; zIndex: number; onPress: () => void;
}) {
  const size = itemSize;
  const labelVisible = !placeholder && focus > 0.42;
  const progressVisible = !placeholder && focus > 0.72;
  const progressBarWidth = size * 0.48;
  const progressBottom = size * 0.12;
  const progressTrackHeight = Math.max(3, size * 0.038);

  return (
    <button
      onClick={onPress}
      style={{
        position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, zIndex,
        background: 'none', border: 'none', cursor: 'pointer', padding: 0,
        opacity, transform: `scale(${scale})`, transition: 'opacity 0.18s ease, transform 0.18s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {city ? (
        <div style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Render PNG as-is — no circular clip, no gradient overlay */}
          <img
            src={city.image}
            alt={city.name}
            style={{ width: size, height: size, objectFit: 'contain', display: 'block' }}
          />
          {labelVisible && (
            <span
              style={{
                position: 'absolute', bottom: size * 0.22, left: 4, right: 4,
                color: '#FFFDFB', fontSize: Math.max(8, size * 0.096), lineHeight: '1.15', fontWeight: 700,
                textAlign: 'center',
                opacity: 0.5 + focus * 0.5,
                textShadow: '0px 1px 5px rgba(14,12,10,0.80), 0px 0px 12px rgba(14,12,10,0.50)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}
            >
              {city.name}
            </span>
          )}
          {progressVisible && (
            <div
              style={{
                position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                bottom: progressBottom, width: progressBarWidth, height: progressTrackHeight,
                borderRadius: progressTrackHeight / 2, overflow: 'hidden',
                backgroundColor: 'rgba(255,255,255,0.22)', border: '1px solid rgba(255,255,255,0.16)',
              }}
            >
              <div
                style={{
                  position: 'absolute', left: 0, top: 0,
                  width: Math.max(progressTrackHeight, progressBarWidth * city.collectionProgress),
                  height: progressTrackHeight,
                  borderRadius: progressTrackHeight / 2,
                  background: `linear-gradient(to right, ${withAlpha(city.accent, 'E0')}, ${withAlpha(city.accent, 'FF')})`,
                }}
              />
            </div>
          )}
        </div>
      ) : (
        // Empty placeholder slot — subtle grey disc
        <div style={{ width: size * 0.72, height: size * 0.72, borderRadius: '50%', background: 'rgba(180,175,170,0.18)' }} />
      )}
    </button>
  );
}

function ArchiveCityCard({ city, onPress }: { city: EchoCity; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      style={{
        overflow: 'hidden', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14,
        borderRadius: 30, padding: 14,
        backgroundColor: colors.echoGlassHeavy, border: `1px solid ${colors.echoLineSoft}`,
        cursor: 'pointer', textAlign: 'left', position: 'relative', width: '100%',
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom right, #FFFFFF, ${withAlpha(city.aura[0], '78')}, ${withAlpha(city.aura[1], '3C')})`,
        }}
      />
      <div style={{ width: 76, height: 76, flexShrink: 0, position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={city.image} alt={city.name} style={{ width: 76, height: 76, objectFit: 'contain', display: 'block' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <span style={{ color: colors.echoInk, fontSize: 19, fontWeight: 700, letterSpacing: -0.4 }}>{city.name}</span>
          <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>{city.recencyLabel}</span>
        </div>
        <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 700 }}>{joinMeta([city.country, formatCityVisitDate(city)])}</span>
        <p style={{ color: colors.textSoft, fontSize: 13, lineHeight: '20px', fontWeight: 500, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{city.note}</p>
        <ProgressRail progress={city.collectionProgress} />
      </div>
      <ChevronRight size={18} color={colors.textMuted} style={{ position: 'relative', zIndex: 1, flexShrink: 0 }} />
    </button>
  );
}

function EchoCard({ item, mode, height, onPress }: { item: EchoCollectionItem; mode: EchoDetailTab; height: number; onPress: () => void }) {
  const locked = mode === 'mine' && !item.collected;
  return (
    <button
      disabled={locked}
      onClick={onPress}
      style={{
        overflow: 'hidden', borderRadius: 34, padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        backgroundColor: colors.echoPearl, minHeight: height, position: 'relative',
        border: 'none', cursor: locked ? 'default' : 'pointer', textAlign: 'left', width: '100%',
      }}
    >
      <img src={item.image} alt={item.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(24,20,18,0.14), rgba(22,18,17,0.78))' }} />
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ borderRadius: 999, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8, backgroundColor: withAlpha(item.tint, mode === 'mine' ? '38' : '24') }}>
          <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{mode === 'mine' ? 'Mine' : 'Popular'}</span>
        </div>
        {mode === 'others' ? (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingLeft: 10, paddingRight: 10, paddingTop: 8, paddingBottom: 8, backgroundColor: 'rgba(255,255,255,0.18)' }}>
            <Radio size={12} color="#FFFFFF" />
            <span style={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700 }}>{item.popularityCount}</span>
          </div>
        ) : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
        <p style={{ color: '#FFFFFF', fontSize: 29, fontWeight: 700, letterSpacing: -0.8, margin: 0 }}>{item.title}</p>
        <span style={{ color: 'rgba(255,255,255,0.76)', fontSize: 12, fontWeight: 700 }}>{joinMeta([item.area, item.dateLabel])}</span>
        <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: '20px', fontWeight: 500, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {locked ? 'Uncollected Echo. The shape remains visible, but the details stay veiled.' : item.note}
        </p>
        <span style={{ color: colors.echoGlowGoldSolid, fontSize: 12, fontWeight: 700 }}>{locked ? 'Locked' : mode === 'mine' ? 'Open gallery' : item.activityLabel ?? 'Open gallery'}</span>
      </div>
      {locked ? (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(248,244,239,0.56)' }} />
          <span style={{ color: colors.echoInk, fontSize: 14, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase', position: 'relative' }}>Uncollected</span>
        </div>
      ) : null}
    </button>
  );
}

function GalleryThumb({ item, active, onPress }: { item: EchoGalleryItem; active: boolean; onPress: () => void }) {
  return (
    <button
      onClick={onPress}
      style={{
        width: 112, height: 150, borderRadius: 28, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: 12, backgroundColor: colors.echoPearl, border: `1px solid ${active ? colors.echoInk : 'transparent'}`,
        cursor: 'pointer', position: 'relative', flexShrink: 0,
      }}
    >
      <img src={item.image} alt={item.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, rgba(22,18,17,0.62))' }} />
      <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, position: 'relative', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</span>
    </button>
  );
}

export function EchoScreen() {
  const screenRef = useRef<HTMLDivElement>(null);
  const [screenSize, setScreenSize] = useState({ width: 390, height: 844 });
  const wheelRotationRef = useRef(0);
  const panStartRotationRef = useRef(0);
  const panStartYRef = useRef(0);
  const isDraggingWheelRef = useRef(false);
  const archiveOffsetRef = useRef({ x: 0, y: 0 });
  const archivePanStartRef = useRef({ x: 0, y: 0 });
  const archivePanStartOffsetRef = useRef({ x: 0, y: 0 });
  const isDraggingArchiveRef = useRef(false);
  const archiveFrameRef = useRef<number | null>(null);
  const archivePendingOffsetRef = useRef({ x: 0, y: 0 });

  // Inertia / momentum refs — wheel
  const wheelVelocityRef = useRef(0);
  const wheelLastMoveYRef = useRef(0);
  const wheelLastMoveTimeRef = useRef(0);
  const wheelInertiaFrameRef = useRef<number | null>(null);
  const wheelSettleFrameRef = useRef<number | null>(null);

  // Inertia / momentum refs — archive pan
  const archiveVelocityRef = useRef({ x: 0, y: 0 });
  const archiveLastMoveRef = useRef({ x: 0, y: 0, time: 0 });
  const archiveInertiaFrameRef = useRef<number | null>(null);

  const [view, setView] = useState<EchoView>('main');
  const [cityOrigin, setCityOrigin] = useState<CityOrigin>('main');
  const [selectedCityId, setSelectedCityId] = useState(recentEchoCities[0].id);
  const [detailTab, setDetailTab] = useState<EchoDetailTab>('mine');
  const [selectedEchoId, setSelectedEchoId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [archiveSortKey, setArchiveSortKey] = useState<ArchiveSortKey>('recent');
  const [wheelRotation, setWheelRotation] = useState(0);
  const [archiveOffset, setArchiveOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function updateSize() {
      if (screenRef.current) {
        setScreenSize({ width: screenRef.current.clientWidth, height: screenRef.current.clientHeight });
      }
    }
    updateSize();
    const ro = new ResizeObserver(updateSize);
    if (screenRef.current) ro.observe(screenRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => {
    if (wheelInertiaFrameRef.current != null) cancelAnimationFrame(wheelInertiaFrameRef.current);
    if (wheelSettleFrameRef.current != null) cancelAnimationFrame(wheelSettleFrameRef.current);
  }, []);

  const deferredQuery = useDeferredValue(searchQuery);
  const wheelItems = useMemo<WheelItem[]>(() => [
    ...recentEchoCities.slice(0, 6).map((city) => ({ type: 'city' as const, city })),
    { type: 'all' as const },
    ...recentEchoCities.slice(6).map((city) => ({ type: 'city' as const, city })),
  ], []);
  const stepAngle = (Math.PI * 2) / wheelItems.length;
  const selectedCity = getEchoCity(selectedCityId) ?? recentEchoCities[0];
  const focusedCity = useMemo(() => {
    let closestCity = recentEchoCities[0];
    let closestDistance = Number.POSITIVE_INFINITY;
    wheelItems.forEach((item, index) => {
      if (item.type !== 'city') return;
      const itemAngle = index * stepAngle + wheelRotation;
      const distanceToFocus = angularDistance(itemAngle, 0);
      if (distanceToFocus < closestDistance) { closestDistance = distanceToFocus; closestCity = item.city; }
    });
    return closestCity;
  }, [stepAngle, wheelItems, wheelRotation]);

  const todayLabel = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }, []);

  const mineEchoes = getEchoCityMineEchoes(selectedCity.id);
  const otherEchoes = getEchoCityOtherEchoes(selectedCity.id);
  const galleryItems = getEchoGalleryItemsForCity(selectedCity.id);
  const featuredGalleryItem = galleryItems.find((item) => item.echoId === selectedEchoId) ?? galleryItems[0] ?? null;

  const { width, height } = screenSize;
  const bottomTabClearance = 134;
  const wheelStageHeight = Math.max(520, height - bottomTabClearance);
  const wheelRadius = Math.min(width * 0.58, wheelStageHeight * 0.28);
  const wheelCenterX = -width * 0.18;
  const wheelCenterY = wheelStageHeight * 0.52;
  const contentBottomPadding = shellMetrics.contentBottomPadding;
  const cardHeights = [244, 194, 232, 204, 224, 188];
  const archiveTopAreaTop = 12;
  const archiveTopChromeHeight = showFilters ? 148 : 108;
  const archiveStageTop = archiveTopAreaTop + archiveTopChromeHeight - 4;
  // Nav bar is ~80 px tall; stop just 4 px above it so the field fills to the edge
  const archiveStageBottom = 84;
  const archiveViewportHeight = Math.max(320, height - archiveStageTop - archiveStageBottom);
  const archiveCenter = useMemo(() => ({ x: width / 2, y: archiveViewportHeight / 2 }), [archiveViewportHeight, width]);
  const archiveItemSize = clamp(80 + width * 0.05, 96, 144);
  const archiveSlotPositions = useMemo(() => createArchiveSlotPositions(archiveItemSize), [archiveItemSize]);
  const archiveSlotPopulationOrder = useMemo(
    () => [...archiveSlotPositions].sort((l, r) => {
      const dd = Math.hypot(l.baseX, l.baseY) - Math.hypot(r.baseX, r.baseY);
      if (Math.abs(dd) > 0.01) return dd;
      return Math.atan2(l.baseY, l.baseX) - Math.atan2(r.baseY, r.baseX);
    }),
    [archiveSlotPositions],
  );
  const archiveSearchResults = useMemo(() => searchArchiveCities(allEchoCities, deferredQuery), [deferredQuery]);
  const archiveCities = useMemo(() => sortArchiveCities(archiveSearchResults, archiveSortKey).slice(0, archiveSlotCount), [archiveSearchResults, archiveSortKey]);
  const archiveSlots = useMemo(() => {
    const cityBySlotId = new Map<number, EchoCity>();
    archiveCities.forEach((city, index) => {
      const targetSlot = archiveSlotPopulationOrder[index];
      if (targetSlot) cityBySlotId.set(targetSlot.slotId, city);
    });
    return archiveSlotPositions.map((slot) => ({ ...slot, city: cityBySlotId.get(slot.slotId) ?? null }));
  }, [archiveCities, archiveSlotPopulationOrder, archiveSlotPositions]);

  const archiveBounds = useMemo(() => {
    if (!archiveSlotPositions.length) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    const orbExtent = (archiveItemSize * archiveMaxScale) / 2 + 8;
    const edgePaddingX = Math.max(18, archiveItemSize * 0.18);
    const edgePaddingY = Math.max(18, archiveItemSize * 0.18);
    const minBaseX = Math.min(...archiveSlotPositions.map((s) => s.baseX)) - orbExtent;
    const maxBaseX = Math.max(...archiveSlotPositions.map((s) => s.baseX)) + orbExtent;
    const minBaseY = Math.min(...archiveSlotPositions.map((s) => s.baseY)) - orbExtent;
    const maxBaseY = Math.max(...archiveSlotPositions.map((s) => s.baseY)) + orbExtent;
    let minX = width - edgePaddingX - archiveCenter.x - maxBaseX;
    let maxX = edgePaddingX - archiveCenter.x - minBaseX;
    let minY = archiveViewportHeight - edgePaddingY - archiveCenter.y - maxBaseY;
    let maxY = edgePaddingY - archiveCenter.y - minBaseY;
    if (minX > maxX) { const lx = (minX + maxX) / 2; minX = lx; maxX = lx; }
    if (minY > maxY) { const ly = (minY + maxY) / 2; minY = ly; maxY = ly; }
    return { minX, maxX, minY, maxY };
  }, [archiveCenter.x, archiveCenter.y, archiveItemSize, archiveSlotPositions, archiveViewportHeight, width]);

  function clampArchiveOffset(next: { x: number; y: number }) {
    return { x: clamp(next.x, archiveBounds.minX, archiveBounds.maxX), y: clamp(next.y, archiveBounds.minY, archiveBounds.maxY) };
  }

  useEffect(() => {
    setSelectedCityId((current) => (current === focusedCity.id ? current : focusedCity.id));
  }, [focusedCity.id]);

  useEffect(() => {
    if (view !== 'allCities') return;
    const clamped = clampArchiveOffset({ x: 0, y: 0 });
    archivePendingOffsetRef.current = clamped;
    archiveOffsetRef.current = clamped;
    setArchiveOffset(clamped);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, archiveCities]);

  function cancelWheelSettle() {
    if (wheelSettleFrameRef.current != null) {
      cancelAnimationFrame(wheelSettleFrameRef.current);
      wheelSettleFrameRef.current = null;
    }
  }

  function animateWheelTo(targetRotation: number, duration: number) {
    if (wheelInertiaFrameRef.current != null) {
      cancelAnimationFrame(wheelInertiaFrameRef.current);
      wheelInertiaFrameRef.current = null;
    }
    cancelWheelSettle();
    const startRot = wheelRotationRef.current;
    const delta = targetRotation - startRot;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = startRot + delta * eased;
      wheelRotationRef.current = current;
      setWheelRotation(current);
      if (t < 1) {
        wheelSettleFrameRef.current = requestAnimationFrame(tick);
      } else {
        wheelSettleFrameRef.current = null;
      }
    }
    wheelSettleFrameRef.current = requestAnimationFrame(tick);
  }

  function snapWheelTo(targetRotation: number) {
    animateWheelTo(targetRotation, wheelTapSnapDurationMs);
  }

  function getNearestSettledWheelRotation(rotation: number) {
    const snappedRotation = snapRotationToStep(rotation, stepAngle);
    return rotation + normalizeAngle(snappedRotation - rotation);
  }

  function snapArchiveToNode(node: { baseX: number; baseY: number }) {
    const target = clampArchiveOffset({ x: -node.baseX, y: -node.baseY });
    const startOffset = { ...archiveOffsetRef.current };
    const deltaX = target.x - startOffset.x;
    const deltaY = target.y - startOffset.y;
    const duration = 380;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = { x: startOffset.x + deltaX * eased, y: startOffset.y + deltaY * eased };
      archiveOffsetRef.current = current;
      archivePendingOffsetRef.current = current;
      setArchiveOffset({ ...current });
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  const archiveDistanceScaleRange = archiveMaxScale - archiveMinScale;
  const archiveLayoutBase = archiveSlots.map((slot) => {
    const x = archiveCenter.x + archiveOffset.x + slot.baseX;
    const y = archiveCenter.y + archiveOffset.y + slot.baseY;
    return { ...slot, x, y, distance: Math.hypot(x - archiveCenter.x, y - archiveCenter.y) };
  });
  const archiveScaleOrder = [...archiveLayoutBase].sort((l, r) => l.distance - r.distance).map((slot, index, ordered) => ({
    slotId: slot.slotId,
    scale: archiveMaxScale - (ordered.length <= 1 ? 0 : (index / (ordered.length - 1)) * archiveDistanceScaleRange),
  }));
  const archiveScaleMap = new Map(archiveScaleOrder.map((s) => [s.slotId, s.scale]));
  const archiveLayout = archiveLayoutBase.map((slot) => {
    const scale = archiveScaleMap.get(slot.slotId) ?? archiveMinScale;
    const focus = clamp((scale - archiveMinScale) / archiveDistanceScaleRange, 0, 1);
    return { ...slot, scale, focus, opacity: Math.max(0.18, Math.min(1, scale * scale)) };
  });
  const focusedArchiveSlotId = archiveLayout.reduce<{ slotId: number | null; distance: number }>(
    (closest, node) => node.distance < closest.distance ? { slotId: node.slotId, distance: node.distance } : closest,
    { slotId: null, distance: Number.POSITIVE_INFINITY },
  ).slotId ?? null;

  const wheelLayout = wheelItems.map((item, index) => {
    const angle = index * stepAngle + wheelRotation;
    const distanceToFocus = angularDistance(angle, 0);
    const emphasis = Math.max(0, 1 - distanceToFocus / 1.8);
    const scale = item.type === 'all' ? 0.82 + emphasis * 0.08 : 0.78 + emphasis * 0.22;
    const opacity = 0.22 + emphasis * 0.78;
    return {
      item, index, angle,
      active: item.type === 'city' && distanceToFocus < stepAngle * 0.38,
      x: wheelCenterX + Math.cos(angle) * wheelRadius,
      y: wheelCenterY + Math.sin(angle) * wheelRadius,
      zIndex: Math.round((Math.cos(angle) + 1) * 100),
      scale, opacity,
    };
  });

  // Derived state for the main view info panel
  const isCenteredAllOrb = wheelLayout.some(
    (entry) => entry.item.type === 'all' && angularDistance(entry.angle, 0) < stepAngle * 0.5,
  );
  const wheelInfoPanelLeft = wheelCenterX + wheelRadius + orbSize / 2 + 16;
  const wheelInfoPanelTop = wheelCenterY - 36;
  const infoCardTitle = isCenteredAllOrb ? 'All' : focusedCity.name;
  const infoCardSubtitle = isCenteredAllOrb ? 'Browse all cities' : formatCityVisitDate(focusedCity);
  const [cardGlowCore, cardGlowMid, cardGlowSoft, cardGlowWash] = isCenteredAllOrb
    ? [
        'rgba(94, 220, 240, 0.40)',
        'rgba(143, 213, 230, 0.32)',
        'rgba(221, 243, 239, 0.24)',
        'rgba(168, 214, 174, 0.10)',
      ]
    : makeGlowFromCity(focusedCity);

  function handleWheelItemPress(item: WheelItem, index: number, isActive: boolean) {
    if (item.type === 'all') { setView('allCities'); return; }
    if (isActive) { openCity(item.city.id, 'main'); return; }
    snapWheelTo(nearestRotationForIndex(index, wheelRotationRef.current, stepAngle));
  }

  function openCity(cityId: string, origin: CityOrigin) {
    setSelectedCityId(cityId); setCityOrigin(origin); setDetailTab('mine'); setSelectedEchoId(null); setView('cityDetail');
  }
  function openGallery(itemId: string, cityId: string) { setSelectedCityId(cityId); setSelectedEchoId(itemId); setView('gallery'); }
  function handleBack() {
    if (view === 'allCities') { setView('main'); return; }
    if (view === 'cityDetail') { setView(cityOrigin === 'allCities' ? 'allCities' : 'main'); return; }
    if (view === 'gallery') setView('cityDetail');
  }
  function handleArchiveOrbPress(node: { city: EchoCity | null; baseX: number; baseY: number; focused: boolean }) {
    if (node.focused && node.city) { openCity(node.city.id, 'allCities'); return; }
    snapArchiveToNode(node);
  }
  function snapArchiveToNearest() {
    if (!archiveLayout.length) return;
    const nearest = archiveLayout.reduce((closest, node) => node.distance < closest.distance ? node : closest);
    snapArchiveToNode(nearest);
  }

  // Wheel drag handlers
  function getClientY(e: ReactMouseEvent | ReactTouchEvent | MouseEvent | TouchEvent) {
    if ('touches' in e) return e.touches[0]?.clientY ?? 0;
    return (e as MouseEvent).clientY;
  }
  function getClientXY(e: ReactMouseEvent | ReactTouchEvent | MouseEvent | TouchEvent) {
    if ('touches' in e) { const t = e.touches[0]; return { x: t?.clientX ?? 0, y: t?.clientY ?? 0 }; }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  }

  function applyWheelInertia(initialVelocity: number) {
    if (wheelInertiaFrameRef.current != null) {
      cancelAnimationFrame(wheelInertiaFrameRef.current);
      wheelInertiaFrameRef.current = null;
    }
    const settleTargetRotation = getNearestSettledWheelRotation(
      wheelRotationRef.current + initialVelocity * 0.18,
    );
    let velocity = initialVelocity;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min(now - lastTime, 64);
      const dtSeconds = dt / 1000;
      lastTime = now;

      const currentRotation = wheelRotationRef.current;
      const settleError = normalizeAngle(settleTargetRotation - currentRotation);
      const speed = Math.abs(velocity);
      const captureInfluence = Math.max(0, 1 - speed / wheelCaptureVelocityThreshold);
      const proximityInfluence = Math.max(0, 1 - Math.abs(settleError) / (stepAngle * 0.55));
      const captureBlend = Math.max(captureInfluence, proximityInfluence * 0.35);

      // Keep the familiar free coast, then progressively guide residual motion
      // into the nearest centered slot without a separate snap phase.
      velocity *= Math.exp(-dt * 0.005);
      if (captureBlend > 0) {
        const guidedAcceleration =
          settleError * wheelCaptureSpring * captureBlend - velocity * wheelCaptureDamping * captureBlend;
        velocity += guidedAcceleration * dtSeconds;
      }

      const nextRotation = currentRotation + velocity * dtSeconds;
      wheelRotationRef.current = nextRotation;
      setWheelRotation(nextRotation);

      const remainingError = normalizeAngle(settleTargetRotation - nextRotation);
      const settleDeadband = Math.min(stepAngle * 0.012, 0.006);
      if (
        Math.abs(velocity) <= wheelSettleVelocityFloor * 0.72 &&
        Math.abs(remainingError) <= settleDeadband
      ) {
        wheelInertiaFrameRef.current = null;
        return;
      }

      if (
        Math.abs(velocity) > wheelSettleVelocityFloor ||
        Math.abs(remainingError) > settleDeadband
      ) {
        wheelInertiaFrameRef.current = requestAnimationFrame(tick);
      } else {
        wheelInertiaFrameRef.current = null;
      }
    }
    wheelInertiaFrameRef.current = requestAnimationFrame(tick);
  }

  function onWheelPointerDown(e: ReactMouseEvent | ReactTouchEvent) {
    // Cancel any in-progress inertia so the grab feels instant
    if (wheelInertiaFrameRef.current != null) {
      cancelAnimationFrame(wheelInertiaFrameRef.current);
      wheelInertiaFrameRef.current = null;
    }
    cancelWheelSettle();
    isDraggingWheelRef.current = true;
    panStartYRef.current = getClientY(e);
    panStartRotationRef.current = wheelRotationRef.current;
    wheelVelocityRef.current = 0;
    wheelLastMoveYRef.current = getClientY(e);
    wheelLastMoveTimeRef.current = performance.now();

    function onMove(ev: MouseEvent | TouchEvent) {
      if (!isDraggingWheelRef.current) return;
      const cy = getClientY(ev);
      const now = performance.now();
      const dt = now - wheelLastMoveTimeRef.current;
      if (dt > 0 && dt < 100) {
        // Negative because dragging down → wheel rotates forward (positive direction)
        wheelVelocityRef.current = -(cy - wheelLastMoveYRef.current) * wheelRotationPerPixel / (dt / 1000);
      }
      wheelLastMoveYRef.current = cy;
      wheelLastMoveTimeRef.current = now;

      const dy = cy - panStartYRef.current;
      const nextRot = panStartRotationRef.current - dy * wheelRotationPerPixel;
      wheelRotationRef.current = nextRot;
      setWheelRotation(nextRot);
    }
    function onUp() {
      if (!isDraggingWheelRef.current) return;
      isDraggingWheelRef.current = false;
      applyWheelInertia(wheelVelocityRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  }

  function applyArchiveInertia(initialVelocity: { x: number; y: number }) {
    if (archiveInertiaFrameRef.current != null) {
      cancelAnimationFrame(archiveInertiaFrameRef.current);
      archiveInertiaFrameRef.current = null;
    }
    let vx = initialVelocity.x;
    let vy = initialVelocity.y;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min(now - lastTime, 64);
      lastTime = now;
      // Exponential friction matching the wheel feel
      vx *= Math.exp(-dt * 0.005);
      vy *= Math.exp(-dt * 0.005);
      const next = clampArchiveOffset({
        x: archiveOffsetRef.current.x + vx * (dt / 1000),
        y: archiveOffsetRef.current.y + vy * (dt / 1000),
      });
      archiveOffsetRef.current = next;
      archivePendingOffsetRef.current = next;
      setArchiveOffset({ ...next });
      if (Math.abs(vx) > 5 || Math.abs(vy) > 5) {
        archiveInertiaFrameRef.current = requestAnimationFrame(tick);
      } else {
        archiveInertiaFrameRef.current = null;
      }
    }
    archiveInertiaFrameRef.current = requestAnimationFrame(tick);
  }

  function onArchivePointerDown(e: ReactMouseEvent | ReactTouchEvent) {
    // Cancel any in-progress inertia so the grab feels instant
    if (archiveInertiaFrameRef.current != null) {
      cancelAnimationFrame(archiveInertiaFrameRef.current);
      archiveInertiaFrameRef.current = null;
    }
    isDraggingArchiveRef.current = true;
    const { x, y } = getClientXY(e);
    archivePanStartRef.current = { x, y };
    archivePanStartOffsetRef.current = { ...archiveOffsetRef.current };
    archiveVelocityRef.current = { x: 0, y: 0 };
    archiveLastMoveRef.current = { x, y, time: performance.now() };

    function onMove(ev: MouseEvent | TouchEvent) {
      if (!isDraggingArchiveRef.current) return;
      const { x: cx, y: cy } = getClientXY(ev);
      const now = performance.now();
      const dt = now - archiveLastMoveRef.current.time;
      if (dt > 0 && dt < 100) {
        archiveVelocityRef.current = {
          x: (cx - archiveLastMoveRef.current.x) / dt * 1000,
          y: (cy - archiveLastMoveRef.current.y) / dt * 1000,
        };
      }
      archiveLastMoveRef.current = { x: cx, y: cy, time: now };

      const dx = cx - archivePanStartRef.current.x;
      const dy = cy - archivePanStartRef.current.y;
      const bounded = clampArchiveOffset({ x: archivePanStartOffsetRef.current.x + dx, y: archivePanStartOffsetRef.current.y + dy });
      archivePendingOffsetRef.current = bounded;
      if (archiveFrameRef.current == null) {
        archiveFrameRef.current = requestAnimationFrame(() => {
          archiveOffsetRef.current = { ...archivePendingOffsetRef.current };
          setArchiveOffset({ ...archivePendingOffsetRef.current });
          archiveFrameRef.current = null;
        });
      }
    }
    function onUp() {
      if (!isDraggingArchiveRef.current) return;
      isDraggingArchiveRef.current = false;
      // Free pan: coast to a natural stop, no snap-back to center
      applyArchiveInertia(archiveVelocityRef.current);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    }
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove);
    window.addEventListener('touchend', onUp);
  }

  return (
    <div
      ref={screenRef}
      style={{ width: '100%', height: '100%', backgroundColor: colors.echoPaper, position: 'relative', overflow: 'hidden' }}
    >
      {/* Atmosphere blurs */}
      {(view === 'cityDetail' || view === 'gallery') && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: -110, right: -70, width: 280, height: 280, borderRadius: 999, backgroundColor: colors.echoGlowRose, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', top: 180, left: -84, width: 230, height: 230, borderRadius: 999, backgroundColor: colors.echoGlowSky, filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: 110, right: -54, width: 220, height: 220, borderRadius: 999, backgroundColor: colors.echoGlowLilac, filter: 'blur(60px)' }} />
        </div>
      )}

      {/* MAIN VIEW - Wheel */}
      {view === 'main' && (
        <div style={{ flex: 1, position: 'relative', height: '100%' }}>
          {/* Top bar — left: title + date, right: search */}
          <div
            style={{
              position: 'absolute', left: shellMetrics.horizontalPadding, right: shellMetrics.horizontalPadding,
              top: shellMetrics.topPadding + 6, zIndex: 300, pointerEvents: 'none',
              display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ color: colors.echoInk, fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>Echoes</span>
              <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 400, letterSpacing: 0 }}>{todayLabel}</span>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setView('allCities'); }}
              style={{
                pointerEvents: 'auto', width: 40, height: 40, borderRadius: 20,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: colors.echoGlass, border: `1px solid ${colors.echoLineSoft}`,
                cursor: 'pointer', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <Search size={16} color={colors.echoInk} />
            </button>
          </div>

          {/* Wheel stage */}
          <div
            style={{ width: '100%', height: wheelStageHeight, overflow: 'hidden', position: 'relative' }}
            onMouseDown={onWheelPointerDown}
            onTouchStart={onWheelPointerDown}
          >
            {wheelLayout.map(({ item, index, active, x, y, zIndex, scale, opacity }) => (
              <WheelOrb
                active={active}
                item={item}
                key={item.type === 'all' ? 'all' : item.city.id}
                onPress={() => handleWheelItemPress(item, index, active)}
                opacity={opacity}
                scale={scale}
                x={x}
                y={y}
                zIndex={zIndex}
              />
            ))}

            {/* Focused orb info pill — shows for both city orbs and the All orb */}
            <div
              style={{
                position: 'absolute',
                left: Math.max(8, wheelInfoPanelLeft),
                right: shellMetrics.horizontalPadding,
                top: wheelInfoPanelTop,
                pointerEvents: 'none',
                zIndex: 250,
              }}
            >
              <div style={{ position: 'relative' }}>
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    inset: '-54px -116px -56px -8px',
                    overflow: 'visible',
                    pointerEvents: 'none',
                    zIndex: 0,
                    maskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.03) 10%, rgba(0, 0, 0, 0.28) 16%, rgba(0, 0, 0, 0.82) 24%, rgba(0, 0, 0, 1) 32%, rgba(0, 0, 0, 1) 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.03) 10%, rgba(0, 0, 0, 0.28) 16%, rgba(0, 0, 0, 0.82) 24%, rgba(0, 0, 0, 1) 32%, rgba(0, 0, 0, 1) 100%)',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '6%',
                      right: '24%',
                      top: '16%',
                      bottom: '24%',
                      opacity: 1,
                      filter: 'blur(20px)',
                      background: [
                        `radial-gradient(ellipse 52% 54% at 10% 50%, ${cardGlowCore} 0%, ${cardGlowCore} 22%, transparent 60%)`,
                        `radial-gradient(ellipse 40% 30% at 22% 34%, ${cardGlowMid} 0%, transparent 66%)`,
                        `radial-gradient(ellipse 30% 24% at 30% 70%, ${cardGlowSoft} 0%, transparent 72%)`,
                      ].join(', '),
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '10%',
                      right: '-14%',
                      top: '-4%',
                      bottom: '6%',
                      opacity: 0.7,
                      filter: 'blur(40px)',
                      background: [
                        `radial-gradient(ellipse 48% 30% at 18% 50%, ${cardGlowMid} 0%, transparent 60%)`,
                        `radial-gradient(ellipse 66% 24% at 44% 32%, ${cardGlowSoft} 0%, transparent 78%)`,
                        `radial-gradient(ellipse 90% 26% at 68% 70%, ${cardGlowWash} 0%, transparent 92%)`,
                      ].join(', '),
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      left: '16%',
                      right: '-38%',
                      top: '-18%',
                      bottom: '-14%',
                      opacity: 0.42,
                      filter: 'blur(68px)',
                      background: [
                        `radial-gradient(ellipse 40% 20% at 18% 50%, ${cardGlowCore} 0%, transparent 56%)`,
                        `radial-gradient(ellipse 80% 22% at 46% 42%, ${cardGlowWash} 0%, transparent 84%)`,
                        `radial-gradient(ellipse 122% 26% at 84% 58%, ${cardGlowSoft} 0%, transparent 95%)`,
                      ].join(', '),
                    }}
                  />
                </div>
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    padding: '16px 14px 14px 10px',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 3,
                    }}
                  >
                    <span
                      style={{
                        color: colors.echoInk,
                        fontSize: 17,
                        fontWeight: 700,
                        letterSpacing: -0.3,
                        lineHeight: '22px',
                        textShadow: '0 1px 18px rgba(255,252,248,0.30)',
                      }}
                    >
                      {infoCardTitle}
                    </span>
                    <span
                      style={{
                        color: colors.textSoft,
                        fontSize: 12,
                        fontWeight: 500,
                        letterSpacing: 0,
                        lineHeight: '16px',
                        textShadow: '0 1px 14px rgba(255,252,248,0.22)',
                      }}
                    >
                      {infoCardSubtitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ALL CITIES VIEW - Archive */}
      {view === 'allCities' && (
        <div style={{ flex: 1, backgroundColor: '#FFFFFF', height: '100%', position: 'relative' }}>
          {/* Top chrome */}
          <div
            style={{
              position: 'absolute', left: 0, right: 0, top: archiveTopAreaTop,
              paddingLeft: shellMetrics.horizontalPadding, paddingRight: shellMetrics.horizontalPadding,
              display: 'flex', flexDirection: 'column', gap: 10, zIndex: 140,
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <BackPill label="Echo" onPress={handleBack} />
              <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>
                {archiveCities.length} cities
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 24, paddingLeft: 16, paddingRight: 16, paddingTop: 13, paddingBottom: 13, backgroundColor: '#FFFFFF', border: '1px solid rgba(32, 28, 26, 0.09)', boxShadow: '0 10px 20px rgba(214,207,200,0.12)' }}>
                <Search size={16} color={colors.textMuted} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cities"
                  style={{ flex: 1, border: 'none', outline: 'none', backgroundColor: 'transparent', color: colors.echoInk, fontSize: 14, fontWeight: 500 }}
                />
              </div>
              <button
                onClick={() => setShowFilters((c) => !c)}
                style={{ width: 46, height: 46, borderRadius: 23, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', border: '1px solid rgba(32, 28, 26, 0.09)', cursor: 'pointer' }}
              >
                <SlidersHorizontal size={16} color={colors.echoInk} />
              </button>
            </div>
            {showFilters && (
              <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {archiveSortOptions.map((option) => (
                  <FilterChip active={archiveSortKey === option} key={option} label={option} onPress={() => setArchiveSortKey(option)} />
                ))}
              </div>
            )}
          </div>
          {/* Archive orb stage */}
          <div
            style={{ position: 'absolute', left: 0, right: 0, top: archiveStageTop, bottom: archiveStageBottom, overflow: 'hidden' }}
            onMouseDown={onArchivePointerDown}
            onTouchStart={onArchivePointerDown}
          >
            <div style={{ position: 'absolute', inset: 0 }}>
              <div style={{ position: 'absolute', left: archiveCenter.x, top: archiveCenter.y, transform: `translate(${archiveOffset.x}px, ${archiveOffset.y}px)`, width: 0, height: 0 }}>
                {archiveLayout.map((node) => (
                  <ArchiveCityOrb
                    city={node.city}
                    focus={node.focus}
                    focused={node.slotId === focusedArchiveSlotId}
                    itemSize={archiveItemSize}
                    key={node.slotId}
                    onPress={() => handleArchiveOrbPress({ city: node.city, baseX: node.baseX, baseY: node.baseY, focused: node.slotId === focusedArchiveSlotId })}
                    opacity={node.opacity}
                    placeholder={!node.city}
                    scale={node.scale}
                    x={node.baseX}
                    y={node.baseY}
                    zIndex={Math.round(node.scale * 1000)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CITY DETAIL VIEW */}
      {view === 'cityDetail' && (
        <div
          style={{ height: '100%', overflowY: 'auto', paddingTop: shellMetrics.topPadding, paddingLeft: shellMetrics.horizontalPadding, paddingRight: shellMetrics.horizontalPadding, paddingBottom: contentBottomPadding, display: 'flex', flexDirection: 'column', gap: 20 }}
          className="scrollbar-hide"
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <BackPill label={cityOrigin === 'allCities' ? 'All' : 'Echo'} onPress={handleBack} />
            <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>{selectedCity.country}</span>
          </div>
          {/* Hero */}
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 18, borderRadius: 34, padding: 18, backgroundColor: colors.echoGlassHeavy, border: `1px solid ${colors.echoLineSoft}` }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h1 style={{ color: colors.echoInk, fontSize: 34, fontWeight: 700, letterSpacing: -1, margin: 0 }}>{selectedCity.name}</h1>
              <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 700 }}>{joinMeta([selectedCity.country, formatCityVisitDate(selectedCity)])}</span>
              <p style={{ color: colors.textSoft, fontSize: 13, lineHeight: '20px', fontWeight: 500, margin: 0 }}>{selectedCity.note}</p>
              <ProgressRail progress={selectedCity.collectionProgress} />
            </div>
            <div style={{ width: 104, height: 104, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={selectedCity.image} alt={selectedCity.name} style={{ width: 104, height: 104, objectFit: 'contain', display: 'block' }} />
            </div>
          </div>
          {/* Toggle */}
          <div style={{ display: 'flex', flexDirection: 'row', gap: 6, padding: 4, borderRadius: 999, backgroundColor: colors.echoGlass, border: `1px solid ${colors.echoLineSoft}` }}>
            {(['mine', 'others'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setDetailTab(tab)}
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, paddingTop: 11, paddingBottom: 11, backgroundColor: detailTab === tab ? colors.echoInk : 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <span style={{ color: detailTab === tab ? '#FFFFFF' : colors.echoInk, fontSize: 13, fontWeight: 700 }}>{tab === 'mine' ? 'Mine' : 'Others'}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h2 style={{ color: colors.echoInk, fontSize: 26, fontWeight: 700, letterSpacing: -0.6, margin: 0 }}>
              {detailTab === 'mine' ? 'Your Echoes in this city' : 'Most active public Echoes'}
            </h2>
            <p style={{ color: colors.textSoft, fontSize: 14, lineHeight: '22px', fontWeight: 500, margin: 0 }}>
              {detailTab === 'mine' ? 'Collected pieces stay clear. Uncollected ones remain veiled and inaccessible.' : 'Ordered by popularity and activity so the strongest public signals surface first.'}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {(detailTab === 'mine' ? mineEchoes : otherEchoes).map((item, index) => (
              <EchoCard key={item.id} height={cardHeights[index % cardHeights.length]} item={item} mode={detailTab} onPress={() => openGallery(item.id, selectedCity.id)} />
            ))}
          </div>
        </div>
      )}

      {/* GALLERY VIEW */}
      {view === 'gallery' && featuredGalleryItem && (
        <div
          style={{ height: '100%', overflowY: 'auto', paddingTop: shellMetrics.topPadding, paddingLeft: shellMetrics.horizontalPadding, paddingRight: shellMetrics.horizontalPadding, paddingBottom: contentBottomPadding, display: 'flex', flexDirection: 'column', gap: 20 }}
          className="scrollbar-hide"
        >
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <BackPill label={selectedCity.name} onPress={handleBack} />
            <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Echo Gallery</span>
          </div>
          <div style={{ overflow: 'hidden', height: 364, borderRadius: 38, backgroundColor: colors.echoPearl, position: 'relative' }}>
            <img src={featuredGalleryItem.image} alt={featuredGalleryItem.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(255,255,255,0.04), rgba(22,18,17,0.14), rgba(22,18,17,0.78))' }} />
            <div style={{ position: 'absolute', left: 20, right: 20, bottom: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <span style={{ color: 'rgba(255,255,255,0.78)', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' }}>{selectedCity.name.toUpperCase()}</span>
              <h2 style={{ color: '#FFFFFF', fontSize: 34, fontWeight: 700, letterSpacing: -1, margin: 0 }}>{featuredGalleryItem.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 13, lineHeight: '20px', fontWeight: 500, margin: 0 }}>{featuredGalleryItem.caption}</p>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Browse the area</span>
            <div style={{ display: 'flex', flexDirection: 'row', gap: 12, overflowX: 'auto', paddingRight: 20 }} className="scrollbar-hide">
              {galleryItems.map((item) => (
                <GalleryThumb active={item.id === featuredGalleryItem.id} item={item} key={item.id} onPress={() => setSelectedEchoId(item.echoId)} />
              ))}
            </div>
          </div>
          <div style={{ borderRadius: 28, padding: 20, display: 'flex', flexDirection: 'column', gap: 8, backgroundColor: colors.echoGlassHeavy, border: `1px solid ${colors.echoLineSoft}` }}>
            <h3 style={{ color: colors.echoInk, fontSize: 22, fontWeight: 700, margin: 0 }}>{featuredGalleryItem.area}</h3>
            <p style={{ color: colors.textSoft, fontSize: 14, lineHeight: '22px', fontWeight: 500, margin: 0 }}>
              {joinMeta([selectedCity.country, formatCityVisitDate(selectedCity), featuredGalleryItem.source === 'mine' ? 'Mine' : 'Others'])}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
