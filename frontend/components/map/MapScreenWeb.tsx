'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Map, {
  Layer,
  Marker,
  Popup,
  Source,
  type LayerProps,
  type MapMouseEvent,
  type MapRef,
} from 'react-map-gl/mapbox';
import type { ErrorEvent, Map as MapboxMap, MapStyleDataEvent, RasterDEMSourceSpecification } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { BARCELONA_ALL, BARCELONA_CENTER } from '@/lib/features/map/barcelona';
import { barcelonaCount, londonCount, londonGeoJSON, westernCount, westernFragments } from '@/lib/features/map/runtimeData';
import { getTagColor, isAcebFragment, isPremiumTag, isUnlockedTag } from '@/lib/features/map/geo';
import type { CityMode, PopupInfo, WesternFragment } from '@/lib/features/map/types';
import { DEMO_WALK_PATH, WALK_DURATION_MS, WALK_START, easeInOutQuad, interpolateRoute } from '@/lib/features/map/walkPath';
import { AcebFlowWeb } from './AcebFlowWeb';
import { MapHudWeb } from './MapHudWeb';

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? '';
const PRIMARY_DISCOVER_MAP_STYLE = 'mapbox://styles/jordanrob/cmnt7r3c5000q01rw1rc28t62';
const FALLBACK_DISCOVER_MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';
const BCN_ARRIVAL_ZOOM = 13.2;
const BCN_DETAIL_ZOOM = 14.25;
const INITIAL_WESTERN_ZOOM = 15.15;
const DEFAULT_CITY_PITCH = 60;
const DEFAULT_CITY_BEARING = -24;
const DISCOVER_TERRAIN_SOURCE_ID = 'discover-dem';
const DISCOVER_TERRAIN_SOURCE: RasterDEMSourceSpecification = {
  type: 'raster-dem',
  url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
  tileSize: 512,
  maxzoom: 14,
};

const DISCOVER_PING_GLOW_RADIUS: any = ['interpolate', ['linear'], ['zoom'], 10, 2.1, 12, 3.2, 14, 4.45, 16, 5.2];
const DISCOVER_PING_CORE_RADIUS: any = ['interpolate', ['linear'], ['zoom'], 10, 1.5, 12, 2.16, 14, 2.98, 16, 3.5];
const DISCOVER_PING_STROKE_WIDTH: any = ['interpolate', ['linear'], ['zoom'], 10, 0.2, 12, 0.28, 14, 0.34, 16, 0.42];
const DISCOVER_PING_STROKE_COLOR = 'rgba(8, 10, 14, 0.96)';
const DISCOVER_PING_COLOR_MATCH: any = ['match', ['get', 'tag'], 'Featured', '#B9893A', 'Rare', '#6F5CB3', 'Social', '#5B80B1', 'Archive', '#7F68A4', 'Unlocked', '#C29A42', 'Legendary', '#D1A152', '#7A8492'];
const DISCOVER_PING_GLOW_COLOR_MATCH: any = ['match', ['get', 'tag'], 'Featured', 'rgba(191,145,74,0.14)', 'Rare', 'rgba(113,90,173,0.13)', 'Social', 'rgba(91,128,177,0.13)', 'Archive', 'rgba(128,104,164,0.13)', 'Unlocked', 'rgba(194,154,66,0.15)', 'Legendary', 'rgba(205,161,82,0.15)', 'rgba(122,132,146,0.10)'];

const londonGlowLayer: LayerProps = {
  id: 'london-glow', type: 'circle', source: 'london', maxzoom: 14,
  paint: {
    'circle-radius': DISCOVER_PING_GLOW_RADIUS,
    'circle-color': DISCOVER_PING_GLOW_COLOR_MATCH,
    'circle-blur': 0.84,
    'circle-opacity': 0.72,
  },
};

const londonCoreLayer: LayerProps = {
  id: 'london-core', type: 'circle', source: 'london', maxzoom: 14,
  paint: {
    'circle-radius': DISCOVER_PING_CORE_RADIUS,
    'circle-color': DISCOVER_PING_COLOR_MATCH,
    'circle-stroke-width': DISCOVER_PING_STROKE_WIDTH,
    'circle-stroke-color': DISCOVER_PING_STROKE_COLOR,
    'circle-opacity': 0.98,
  },
};

export function MapScreenWeb() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapRef>(null);
  const rafRef = useRef<number>(0);
  const resizeRafRef = useRef<number>(0);
  const walkStartRef = useRef<number>(0);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const mountedRef = useRef(false);
  const mapReadyRef = useRef(false);
  const [mapStyle, setMapStyle] = useState(PRIMARY_DISCOVER_MAP_STYLE);
  const [mapStyleFailedOver, setMapStyleFailedOver] = useState(false);
  const [popupInfo, setPopupInfo] = useState<PopupInfo | null>(null);
  const [rippleKey, setRippleKey] = useState<string | null>(null);
  const [selectedMarkerKey, setSelectedMarkerKey] = useState<string | null>(null);
  const [playerPos, setPlayerPos] = useState({ lng: WALK_START[0], lat: WALK_START[1] });
  const [walking, setWalking] = useState(false);
  const [walkDone, setWalkDone] = useState(false);
  const [cityMode, setCityMode] = useState<CityMode>('western');
  const [traveling, setTraveling] = useState(false);
  const [travelLabel, setTravelLabel] = useState('');
  const [bcnRevealed, setBcnRevealed] = useState(false);
  const [bcnHeroesVisible, setBcnHeroesVisible] = useState(false);
  const [acebOpen, setAcebOpen] = useState(false);

  const tokenLoaded = TOKEN.length > 0 && TOKEN !== 'your_mapbox_token_here';
  const isWestern = cityMode === 'western';
  const isBarcelona = cityMode === 'barcelona';
  const currentCityLabel = isWestern ? 'London' : 'Barcelona';
  const otherCityLabel = isWestern ? 'Barcelona' : 'London';
  const nearbyCount = isWestern ? westernCount + londonCount : barcelonaCount;
  const westernRegular = useMemo(() => westernFragments.filter((f) => !isPremiumTag(f.tag)), []);
  const westernPremium = useMemo(() => westernFragments.filter((f) => isPremiumTag(f.tag)), []);

  const resizeMap = useCallback(() => {
    if (!mountedRef.current) return;

    const map = mapRef.current?.getMap();
    const root = rootRef.current;

    if (!map || !root) return;
    if (root.clientWidth === 0 || root.clientHeight === 0) return;
    mapReadyRef.current = true;

    try {
      map.resize();
    } catch (error) {
      console.error('Discover map resize failed.', error);
    }
  }, []);

  const scheduleMapResize = useCallback(() => {
    if (!mountedRef.current) return;

    cancelAnimationFrame(resizeRafRef.current);
    resizeRafRef.current = requestAnimationFrame(() => {
      resizeRafRef.current = requestAnimationFrame(() => {
        resizeMap();
      });
    });
  }, [resizeMap]);

  const ensureDiscover3D = useCallback((map: MapboxMap | undefined | null) => {
    if (!mountedRef.current || !map || !map.isStyleLoaded()) return;

    try {
      const style = map.getStyle();
      if (style?.terrain || map.getTerrain()) return;
      if (!map.getSource(DISCOVER_TERRAIN_SOURCE_ID)) {
        map.addSource(DISCOVER_TERRAIN_SOURCE_ID, DISCOVER_TERRAIN_SOURCE);
      }
      map.setTerrain({ source: DISCOVER_TERRAIN_SOURCE_ID, exaggeration: 1.15 });
    } catch (error) {
      console.error('Discover map terrain initialization failed.', error);
    }
  }, []);

  const clearScheduledEffects = useCallback(() => {
    timeoutRefs.current.forEach((h) => clearTimeout(h));
    timeoutRefs.current = [];
    cancelAnimationFrame(rafRef.current);
    cancelAnimationFrame(resizeRafRef.current);
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      mapReadyRef.current = false;
      clearScheduledEffects();
    };
  }, [clearScheduledEffects]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    scheduleMapResize();

    const handleWindowResize = () => {
      scheduleMapResize();
    };

    window.addEventListener('resize', handleWindowResize);

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => {
          scheduleMapResize();
        });

    observer?.observe(root);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      observer?.disconnect();
    };
  }, [scheduleMapResize]);

  const scheduleTimeout = useCallback((cb: () => void, delay: number) => {
    const h = setTimeout(() => {
      if (!mountedRef.current) return;
      cb();
    }, delay);
    timeoutRefs.current.push(h);
  }, []);

  const fragmentKey = useCallback((fragment: WesternFragment, prefix = '') => `${prefix}${fragment.lng},${fragment.lat}`, []);

  const focusPopup = useCallback((fragment: WesternFragment, key: string) => {
    if (!mountedRef.current) return;
    setPopupInfo({ lng: fragment.lng, lat: fragment.lat, title: fragment.title, subtitle: fragment.subtitle, tag: fragment.tag });
    setSelectedMarkerKey(key);
    setRippleKey(null);
  }, []);

  const handleFragmentClick = useCallback(
    (fragment: WesternFragment, prefix = '') => {
      if (traveling) return;
      const key = fragmentKey(fragment, prefix);
      const acebFragment = isAcebFragment(fragment);
      setPopupInfo(null);
      setSelectedMarkerKey(acebFragment ? null : key);
      setRippleKey(key);
      if (acebFragment) {
        scheduleTimeout(() => { setRippleKey(null); setSelectedMarkerKey(null); setAcebOpen(true); }, 380);
        return;
      }
      scheduleTimeout(() => focusPopup(fragment, key), 380);
    },
    [focusPopup, fragmentKey, scheduleTimeout, traveling],
  );

  const handleMapClick = useCallback(
    (event: MapMouseEvent) => {
      if (!mountedRef.current) return;
      if (traveling) return;
      const feature = event.features?.[0];
      if (!feature || feature.geometry.type !== 'Point') { setPopupInfo(null); setSelectedMarkerKey(null); return; }
      const layerId = feature.layer?.id;
      if (layerId !== 'london-core') { setPopupInfo(null); setSelectedMarkerKey(null); return; }
      const coords = feature.geometry.coordinates as [number, number];
      const props = feature.properties as Record<string, unknown>;
      setPopupInfo({ lng: coords[0], lat: coords[1], title: String(props.title ?? ''), subtitle: String(props.subtitle ?? ''), tag: String(props.tag ?? '') });
      setSelectedMarkerKey(null);
      setRippleKey(null);
    },
    [traveling],
  );

  const handleMapError = useCallback((event: ErrorEvent) => {
    if (!mountedRef.current) return;
    if (mapStyleFailedOver || mapStyle !== PRIMARY_DISCOVER_MAP_STYLE) return;
    console.error('Discover map primary style failed to load, falling back to dark-v11.', {
      style: PRIMARY_DISCOVER_MAP_STYLE,
      message: event.error?.message,
    });
    setMapStyle(FALLBACK_DISCOVER_MAP_STYLE);
    setMapStyleFailedOver(true);
  }, [mapStyle, mapStyleFailedOver]);

  const handleMapLoad = useCallback(() => {
    if (!mountedRef.current) return;
    mapReadyRef.current = true;
    ensureDiscover3D(mapRef.current?.getMap());
    scheduleMapResize();
  }, [ensureDiscover3D, scheduleMapResize]);

  const handleMapStyleData = useCallback((_event: MapStyleDataEvent) => {
    if (!mountedRef.current) return;
    ensureDiscover3D(mapRef.current?.getMap());
    scheduleMapResize();
  }, [ensureDiscover3D, scheduleMapResize]);

  const startWalk = useCallback(() => {
    if (walking || walkDone || traveling) return;
    setPopupInfo(null);
    setSelectedMarkerKey(null);
    setWalking(true);
    walkStartRef.current = performance.now();
    const tick = (now: number) => {
      if (!mountedRef.current) return;
      const progress = Math.min((now - walkStartRef.current) / WALK_DURATION_MS, 1);
      const eased = easeInOutQuad(progress);
      const [lng, lat] = interpolateRoute(DEMO_WALK_PATH, eased);
      setPlayerPos({ lng, lat });
      mapRef.current?.easeTo({ center: [lng, lat], duration: 60, easing: (v: number) => v });
      if (progress < 1) { rafRef.current = requestAnimationFrame(tick); }
      else { setWalking(false); setWalkDone(true); }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [traveling, walkDone, walking]);

  const travelToBarcelona = useCallback(() => {
    const map = mapRef.current;
    if (!map || traveling || isBarcelona) return;
    clearScheduledEffects();
    setTraveling(true); setPopupInfo(null); setSelectedMarkerKey(null);
    setTravelLabel('Leaving London, Ontario...'); setWalking(false);
    map.easeTo({ zoom: 4.5, pitch: 45, bearing: 30, duration: 2400, easing: (v: number) => 1 - Math.pow(1 - v, 3) });
    scheduleTimeout(() => {
      setTravelLabel('Traveling to Barcelona...');
      setCityMode('barcelona'); setBcnRevealed(false); setBcnHeroesVisible(false);
      map.flyTo({ center: [BARCELONA_CENTER.lng, BARCELONA_CENTER.lat], zoom: 5, pitch: 40, bearing: -15, duration: 3200, essential: true });
      scheduleTimeout(() => {
        setTravelLabel('Arriving in Barcelona...');
        map.flyTo({ center: [BARCELONA_CENTER.lng, BARCELONA_CENTER.lat], zoom: BCN_ARRIVAL_ZOOM, pitch: DEFAULT_CITY_PITCH, bearing: DEFAULT_CITY_BEARING, duration: 2800, essential: true });
        scheduleTimeout(() => setBcnRevealed(true), 1200);
        scheduleTimeout(() => setBcnHeroesVisible(true), 2000);
        scheduleTimeout(() => {
          map.easeTo({ center: [BARCELONA_CENTER.lng, BARCELONA_CENTER.lat], zoom: BCN_DETAIL_ZOOM, pitch: DEFAULT_CITY_PITCH, bearing: DEFAULT_CITY_BEARING, duration: 1200 });
          scheduleTimeout(() => { setTraveling(false); setTravelLabel(''); }, 1300);
        }, 2800);
      }, 3200);
    }, 2500);
  }, [clearScheduledEffects, isBarcelona, scheduleTimeout, traveling]);

  const travelToWestern = useCallback(() => {
    const map = mapRef.current;
    if (!map || traveling || isWestern) return;
    clearScheduledEffects();
    setTraveling(true); setPopupInfo(null); setSelectedMarkerKey(null);
    setTravelLabel('Leaving Barcelona...'); setBcnHeroesVisible(false);
    map.easeTo({ zoom: 4.5, pitch: 45, bearing: -30, duration: 2400, easing: (v: number) => 1 - Math.pow(1 - v, 3) });
    scheduleTimeout(() => {
      setTravelLabel('Returning to Western...');
      setCityMode('western'); setBcnRevealed(false);
      map.flyTo({ center: [WALK_START[0], WALK_START[1]], zoom: 5, pitch: 40, bearing: 15, duration: 3200, essential: true });
      scheduleTimeout(() => {
        setTravelLabel('Arriving at Western...');
        map.flyTo({ center: [WALK_START[0], WALK_START[1]], zoom: INITIAL_WESTERN_ZOOM, pitch: DEFAULT_CITY_PITCH, bearing: DEFAULT_CITY_BEARING, duration: 2800, essential: true });
        scheduleTimeout(() => { setTraveling(false); setTravelLabel(''); }, 3000);
      }, 3200);
    }, 2500);
  }, [clearScheduledEffects, isWestern, scheduleTimeout, traveling]);

  if (!tokenLoaded) {
    return (
      <div className="map-web-root" ref={rootRef}>
        <div className="map-missing-card">
          <div className="map-missing-icon">!</div>
          <p className="map-missing-title">Mapbox token missing</p>
          <p className="map-missing-body">Copy <code>.env.local.example</code> to <code>.env.local</code> and set <code>NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN</code>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-web-root" ref={rootRef}>
      <MapHudWeb
        currentCityLabel={currentCityLabel}
        nearbyCount={nearbyCount}
        onSwitchCity={isWestern ? travelToBarcelona : travelToWestern}
        otherCityLabel={otherCityLabel}
        traveling={traveling}
      />
      <Map
        attributionControl={false}
        cursor="auto"
        interactiveLayerIds={isWestern ? ['london-core'] : undefined}
        initialViewState={{ longitude: WALK_START[0], latitude: WALK_START[1], zoom: INITIAL_WESTERN_ZOOM, pitch: DEFAULT_CITY_PITCH, bearing: DEFAULT_CITY_BEARING }}
        mapStyle={mapStyle}
        mapboxAccessToken={TOKEN}
        maxZoom={18}
        minZoom={2}
        onClick={handleMapClick}
        onError={handleMapError}
        onLoad={handleMapLoad}
        onStyleData={handleMapStyleData}
        ref={mapRef}
        reuseMaps
        style={{ width: '100%', height: '100%' }}
      >
        {isWestern ? (
          <Source data={londonGeoJSON as GeoJSON.FeatureCollection} id="london" type="geojson">
            <Layer {...londonGlowLayer} />
            <Layer {...londonCoreLayer} />
          </Source>
        ) : null}

        {isWestern && !traveling
          ? westernRegular.map((fragment) => renderOrb(fragment, false, selectedMarkerKey === fragmentKey(fragment), rippleKey === fragmentKey(fragment), () => handleFragmentClick(fragment)))
          : null}

        {isWestern && !traveling
          ? westernPremium.map((fragment) => renderOrb(fragment, true, selectedMarkerKey === fragmentKey(fragment, 'p-'), rippleKey === fragmentKey(fragment, 'p-'), () => handleFragmentClick(fragment, 'p-'), 'p-'))
          : null}

        {isWestern && !traveling ? (
          <Marker anchor="center" latitude={playerPos.lat} longitude={playerPos.lng}>
            <div className="player-halo">
              <div className="player-halo__outer" />
              <div className="player-halo__ring" />
              <div className="player-halo__core" />
            </div>
          </Marker>
        ) : null}

        {isBarcelona && bcnHeroesVisible && !traveling
          ? BARCELONA_ALL.map((fragment) => renderOrb(fragment, isPremiumTag(fragment.tag), selectedMarkerKey === fragmentKey(fragment, 'bcn-'), rippleKey === fragmentKey(fragment, 'bcn-'), () => handleFragmentClick(fragment, 'bcn-'), 'bcn-'))
          : null}

        {popupInfo && !traveling ? (
          <Popup anchor="bottom" className="echoes-popup" closeOnClick={false} latitude={popupInfo.lat} longitude={popupInfo.lng} maxWidth="280px" offset={18} onClose={() => { setPopupInfo(null); setSelectedMarkerKey(null); }}>
            <div style={{ padding: 12 }}>
              <h3 style={{ margin: '0 0 4px', color: isUnlockedTag(popupInfo.tag) ? '#6B88B0' : 'rgba(32,39,51,0.88)', fontSize: 14, fontWeight: 700 }}>
                {popupInfo.title}
              </h3>
              <p style={{ margin: 0, color: 'rgba(95,108,125,0.78)', fontSize: 11 }}>{popupInfo.subtitle}</p>
              <div style={{ marginTop: 10 }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: 999,
                    border: `1px solid ${getTagColor(popupInfo.tag).core}30`,
                    background: getTagColor(popupInfo.tag).badge,
                    color: getTagColor(popupInfo.tag).core,
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  {isUnlockedTag(popupInfo.tag) ? 'Unlocked' : popupInfo.tag}
                </span>
              </div>
            </div>
          </Popup>
        ) : null}
      </Map>

      {isWestern && !traveling ? (
        <div className="demo-walk-btn-wrap">
          <button
            className={`demo-walk-btn ${walking ? 'demo-walk-btn--active' : ''} ${walkDone ? 'demo-walk-btn--done' : ''}`}
            disabled={walking || walkDone}
            onClick={startWalk}
          >
            {walkDone ? 'Arrived - tap the fragment' : walking ? 'Walking...' : 'Simulate Walk'}
          </button>
        </div>
      ) : null}

      {traveling ? (
        <div className="travel-overlay">
          <div className="travel-overlay__content">
            <div className="travel-overlay__spinner" />
            <span className="travel-overlay__label">{travelLabel}</span>
          </div>
        </div>
      ) : null}

      <AcebFlowWeb onClose={() => setAcebOpen(false)} visible={acebOpen} />
    </div>
  );
}

function renderOrb(fragment: WesternFragment, premium: boolean, active: boolean, rippleVisible: boolean, onClick: () => void, prefix = '') {
  const key = `${prefix}${fragment.lng},${fragment.lat}`;
  const color = getTagColor(fragment.tag);
  const unlocked = isUnlockedTag(fragment.tag);
  return (
    <Marker anchor="center" key={key} latitude={fragment.lat} longitude={fragment.lng}>
      <div
        className={`echo-orb${premium ? ' echo-orb--premium' : ''}`}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
      >
        <div
          className={['echo-orb__glow', premium ? 'echo-orb__glow--premium' : '', unlocked ? 'echo-orb__glow--unlocked' : '', active ? 'echo-orb__glow--active' : ''].filter(Boolean).join(' ')}
          style={{ background: color.glow }}
        />
        <div
          className={['echo-orb__shell', premium ? 'echo-orb__shell--premium' : '', active ? 'echo-orb__shell--active' : ''].filter(Boolean).join(' ')}
        />
        <div
          className={['echo-orb__core', premium ? 'echo-orb__core--premium' : '', unlocked ? 'echo-orb__core--unlocked' : '', active ? 'echo-orb__core--active' : ''].filter(Boolean).join(' ')}
          style={{ background: color.core }}
        />
        {unlocked ? <div className="echo-orb__status" style={{ background: color.core }} /> : null}
        {rippleVisible ? <div className="echo-ripple" style={{ borderColor: color.core }} /> : null}
      </div>
    </Marker>
  );
}
