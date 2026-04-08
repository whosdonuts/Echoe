import type { EchoOrbKey } from '@/lib/data/echoOrbAssets';
import { formatEchoFullDate } from '@/lib/formatEchoDate';

export type EchoFilterKey = 'city' | 'country' | 'date' | 'recency';

export type EchoGlowPalette = {
  core: string;
  mid: string;
  soft: string;
  wash: string;
};

export type EchoCity = {
  id: string;
  name: string;
  country: string;
  orbKey: EchoOrbKey;
  recencyLabel: string;
  visitedAt: string;
  collectionProgress: number;
  collectedCount: number;
  totalCount: number;
  image: string;
  accent: string;
  aura: [string, string];
  glowPalette: EchoGlowPalette;
  note: string;
};

export type EchoCollectionItem = {
  id: string;
  cityId: string;
  title: string;
  area: string;
  note: string;
  image: string;
  tint: string;
  aura: [string, string];
  collected: boolean;
  dateLabel: string;
  popularityCount?: number;
  activityLabel?: string;
};

export type EchoGalleryItem = {
  id: string;
  cityId: string;
  echoId: string;
  title: string;
  area: string;
  caption: string;
  image: string;
  tint: string;
  aspect: 'portrait' | 'square' | 'landscape';
  source: 'mine' | 'others';
};

function createGlowPalette(core: string, mid: string, soft: string, wash: string): EchoGlowPalette {
  return { core, mid, soft, wash };
}

const cityGlowPalettes = {
  'barcelona-ca': createGlowPalette('#96C09F', '#BED1A7', '#D8D398', '#D8D398'),
  'etobicoke-on': createGlowPalette('#A5C0DE', '#BECEE6', '#D7DDF1', '#D7DDF1'),
  'hamilton-on': createGlowPalette('#B296D1', '#D8B5E7', '#EAD0F7', '#EAD0F7'),
  'kingston-cu': createGlowPalette('#EEAA87', '#FAC9A5', '#FDDEBD', '#FDDEBD'),
  'london-on': createGlowPalette('#927FD3', '#C299DA', '#ECCEEE', '#ECCEEE'),
  'london-uk': createGlowPalette('#E49E8B', '#F1BFAA', '#FBD6C1', '#FBD6C1'),
  'milton-on': createGlowPalette('#D88364', '#F8A473', '#FCD091', '#FCD091'),
  'mississauga-on': createGlowPalette('#C98EC1', '#EDB8DE', '#FDD7FB', '#FDD7FB'),
  'montreal-on': createGlowPalette('#ACAE6E', '#DFB160', '#E3D7A0', '#E3D7A0'),
  'nyc-ny': createGlowPalette('#B2C0CC', '#CAE5E8', '#E5F5F0', '#E5F5F0'),
  'orlando-fl': createGlowPalette('#9BC098', '#C3DAAC', '#EEEEA0', '#EEEEA0'),
  'seattle-wa': createGlowPalette('#DD7D87', '#FD97A3', '#FECFD9', '#FECFD9'),
  'toronto-on': createGlowPalette('#E8AD90', '#FABF9C', '#FDE0B9', '#FDE0B9'),
} as const satisfies Record<string, EchoGlowPalette>;

const citySeeds: EchoCity[] = [
  // ── Main Echoes wheel (12) ────────────────────────────────────────────────
  {
    id: 'toronto-on',
    name: 'Toronto, ON',
    country: 'Canada',
    orbKey: 'gold',
    recencyLabel: 'Now',
    visitedAt: '2026-03-20',
    collectionProgress: 0.89,
    collectedCount: 19,
    totalCount: 22,
    image: '/echo-orbs/toronto-on.png',
    accent: '#D4AF84',
    aura: ['#F8E8D8', '#E9C9A5'],
    glowPalette: cityGlowPalettes['toronto-on'],
    note: 'Tall light, lake haze, and a skyline that still lands with cinematic certainty.',
  },
  {
    id: 'mississauga-on',
    name: 'Mississauga, ON',
    country: 'Canada',
    orbKey: 'lilac',
    recencyLabel: '2 h ago',
    visitedAt: '2026-03-19',
    collectionProgress: 0.61,
    collectedCount: 11,
    totalCount: 18,
    image: '/echo-orbs/mississauga-on.png',
    accent: '#B3A6C8',
    aura: ['#EFE8F6', '#D3C6E3'],
    glowPalette: cityGlowPalettes['mississauga-on'],
    note: 'Glass curves, dusk reflections, and a skyline that feels polished without trying.',
  },
  {
    id: 'milton-on',
    name: 'Milton, ON',
    country: 'Canada',
    orbKey: 'mint',
    recencyLabel: '5 h ago',
    visitedAt: '2026-03-18',
    collectionProgress: 0.64,
    collectedCount: 12,
    totalCount: 19,
    image: '/echo-orbs/milton-on.png',
    accent: '#98C4B4',
    aura: ['#E3F2EC', '#BADBCE'],
    glowPalette: cityGlowPalettes['milton-on'],
    note: 'Clean lines, distant towers, and a calm suburban horizon held in soft glass.',
  },
  {
    id: 'hamilton-on',
    name: 'Hamilton, ON',
    country: 'Canada',
    orbKey: 'rose',
    recencyLabel: 'Yesterday',
    visitedAt: '2026-03-17',
    collectionProgress: 0.58,
    collectedCount: 10,
    totalCount: 17,
    image: '/echo-orbs/hamilton-on.png',
    accent: '#D8A0A7',
    aura: ['#F7E0E4', '#E6BCC4'],
    glowPalette: cityGlowPalettes['hamilton-on'],
    note: 'Steel edges, escarpment air, and a horizon with more texture than gloss.',
  },
  {
    id: 'etobicoke-on',
    name: 'Etobicoke, ON',
    country: 'Canada',
    orbKey: 'sky',
    recencyLabel: '2 days ago',
    visitedAt: '2026-03-16',
    collectionProgress: 0.72,
    collectedCount: 13,
    totalCount: 18,
    image: '/echo-orbs/etobicoke-on.png',
    accent: '#96B8D6',
    aura: ['#E2EEF8', '#BCD4E8'],
    glowPalette: cityGlowPalettes['etobicoke-on'],
    note: 'Lakeshore quiet, towers behind the trees, and a light that arrives before the city does.',
  },
  {
    id: 'london-on',
    name: 'London, ON',
    country: 'Canada',
    orbKey: 'sky',
    recencyLabel: '3 days ago',
    visitedAt: '2026-03-15',
    collectionProgress: 0.73,
    collectedCount: 14,
    totalCount: 19,
    image: '/echo-orbs/london-on.png',
    accent: '#8FB5CC',
    aura: ['#DEEEF5', '#B8D2E2'],
    glowPalette: cityGlowPalettes['london-on'],
    note: 'River light, mirrored towers, and a colder blue that still reads intimate.',
  },
  {
    id: 'montreal-on',
    name: 'Montreal, ON',
    country: 'Canada',
    orbKey: 'coral',
    recencyLabel: '4 days ago',
    visitedAt: '2026-03-14',
    collectionProgress: 0.77,
    collectedCount: 15,
    totalCount: 20,
    image: '/echo-orbs/montreal-on.png',
    accent: '#D4956E',
    aura: ['#F8DCC8', '#E8B89A'],
    glowPalette: cityGlowPalettes['montreal-on'],
    note: 'Old stone, neon French, and a skyline that manages to feel both dense and open.',
  },
  {
    id: 'nyc-ny',
    name: 'NYC, NY',
    country: 'United States',
    orbKey: 'lilac',
    recencyLabel: '5 days ago',
    visitedAt: '2026-03-13',
    collectionProgress: 0.76,
    collectedCount: 15,
    totalCount: 20,
    image: '/echo-orbs/nyc-ny.png',
    accent: '#B6B1C7',
    aura: ['#ECEAF4', '#CEC9DD'],
    glowPalette: cityGlowPalettes['nyc-ny'],
    note: 'Steel, steam, and a skyline that looks engineered for memory.',
  },
  {
    id: 'orlando-fl',
    name: 'Orlando, FL',
    country: 'United States',
    orbKey: 'mint',
    recencyLabel: '1 week ago',
    visitedAt: '2026-03-11',
    collectionProgress: 0.55,
    collectedCount: 10,
    totalCount: 18,
    image: '/echo-orbs/orlando-fl.png',
    accent: '#9FCDBF',
    aura: ['#E4F3EE', '#C1E0D4'],
    glowPalette: cityGlowPalettes['orlando-fl'],
    note: 'Lake reflections, evening towers, and a skyline tuned for clean warm light.',
  },
  {
    id: 'seattle-wa',
    name: 'Seattle, WA',
    country: 'United States',
    orbKey: 'sky',
    recencyLabel: '9 days ago',
    visitedAt: '2026-03-08',
    collectionProgress: 0.62,
    collectedCount: 11,
    totalCount: 18,
    image: '/echo-orbs/seattle-wa.png',
    accent: '#93B8CC',
    aura: ['#DEEAF4', '#B8D0E0'],
    glowPalette: cityGlowPalettes['seattle-wa'],
    note: 'Pacific grey, needle silhouettes, and a skyline that earns every cloud it wears.',
  },
  {
    id: 'barcelona-ca',
    name: 'Barcelona, CA',
    country: 'Spain',
    orbKey: 'coral',
    recencyLabel: '11 days ago',
    visitedAt: '2026-03-07',
    collectionProgress: 0.86,
    collectedCount: 18,
    totalCount: 21,
    image: '/echo-orbs/barcelona-ca.png',
    accent: '#D99060',
    aura: ['#F8DACC', '#E8B488'],
    glowPalette: cityGlowPalettes['barcelona-ca'],
    note: 'Warm stone, long boulevards, and a skyline that feels edited by sunlight.',
  },
  {
    id: 'london-uk',
    name: 'London, UK',
    country: 'United Kingdom',
    orbKey: 'gold',
    recencyLabel: '2 weeks ago',
    visitedAt: '2026-03-03',
    collectionProgress: 0.81,
    collectedCount: 16,
    totalCount: 20,
    image: '/echo-orbs/london-uk.png',
    accent: '#C4A47E',
    aura: ['#F4E4D4', '#DFCAA4'],
    glowPalette: cityGlowPalettes['london-uk'],
    note: 'Grey sky, steel bridges, and a skyline that carries centuries without shouting about it.',
  },
  // ── All Cities only (1) ───────────────────────────────────────────────────
  {
    id: 'kingston-cu',
    name: 'Kingston, CU',
    country: 'Caribbean',
    orbKey: 'coral',
    recencyLabel: '3 weeks ago',
    visitedAt: '2026-02-28',
    collectionProgress: 0.67,
    collectedCount: 12,
    totalCount: 18,
    image: '/echo-orbs/kingston-cu.png',
    accent: '#D5906C',
    aura: ['#F8DACC', '#E8B490'],
    glowPalette: cityGlowPalettes['kingston-cu'],
    note: 'Heat shimmer, coastal brightness, and a skyline softened by tropical air.',
  },
];

export const allCitiesOrbImage = '/echo-orbs/all-earth.png';
export const allOrbGlowPalette = createGlowPalette('#5EDCF0', '#8FD5E6', '#DDF3EF', '#A8D6AE');

const mineTemplates = [
  {
    slug: 'river-light',
    title: 'River light',
    area: 'Waterfront edge',
    note: 'The light on the water made {city} feel newly invented for a minute.',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'station-air',
    title: 'Station air',
    area: 'Arrival hall',
    note: 'A soft draft ran through the concourse and carried {city} forward.',
    image:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'late-window',
    title: 'Late window',
    area: 'Side-street glass',
    note: 'Neon on glass and footsteps folding quietly into the curb.',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'morning-steps',
    title: 'Morning steps',
    area: 'Old stone steps',
    note: 'A bright slow start, almost too gentle to keep all to yourself.',
    image:
      'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'rooftop-breath',
    title: 'Rooftop breath',
    area: 'Upper terrace',
    note: 'The view held longer than the sentence I meant to leave behind in {city}.',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
  },
  {
    slug: 'market-hum',
    title: 'Market hum',
    area: 'Covered arcade',
    note: 'Warm voices and tinny music braided together by accident.',
    image:
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1200&q=80',
  },
];

const othersTemplates = [
  {
    slug: 'shared-dusk',
    title: 'Shared dusk',
    area: 'Public square',
    note: 'Everybody seems to leave the same kind of evening here.',
    image:
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
    popularityBase: 468,
    activityLabel: 'left this week',
  },
  {
    slug: 'harbor-chime',
    title: 'Harbor chime',
    area: 'Lower quay',
    note: 'Wind, metal, and a repeating tenderness people keep answering.',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    popularityBase: 389,
    activityLabel: 'active tonight',
  },
  {
    slug: 'after-rain',
    title: 'After rain',
    area: 'Market lane',
    note: 'People keep tagging wet pavement and the calm that follows it.',
    image:
      'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    popularityBase: 316,
    activityLabel: 'most replayed',
  },
  {
    slug: 'night-platform',
    title: 'Night platform',
    area: 'Transit pocket',
    note: 'A familiar mix of waiting, departure, and the echo of brakes.',
    image:
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1200&q=80',
    popularityBase: 244,
    activityLabel: 'quietly rising',
  },
];

const galleryAspectPattern: EchoGalleryItem['aspect'][] = [
  'portrait',
  'square',
  'square',
  'landscape',
  'square',
  'square',
];

export const echoFilterKeys: EchoFilterKey[] = ['city', 'country', 'date', 'recency'];
export const allEchoCities = citySeeds;
export const recentEchoCities = allEchoCities.slice(0, 12);

const mineEchoes: EchoCollectionItem[] = allEchoCities.flatMap((city, cityIndex) => {
  const visibleCount = Math.max(
    2,
    Math.min(mineTemplates.length - 1, Math.round(city.collectionProgress * mineTemplates.length)),
  );

  return mineTemplates.map((template, index) => ({
    id: `${city.id}-mine-${template.slug}`,
    cityId: city.id,
    title: template.title,
    area: template.area,
    note: template.note.replace('{city}', city.name),
    image: template.image,
    tint: city.accent,
    aura: city.aura,
    collected: index < visibleCount,
    dateLabel: `${formatEchoFullDate(city.visitedAt)} / saved ${Math.max(1, cityIndex + index)}d apart`,
  }));
});

const othersEchoes: EchoCollectionItem[] = allEchoCities.flatMap((city, cityIndex) =>
  othersTemplates.map((template, index) => ({
    id: `${city.id}-others-${template.slug}`,
    cityId: city.id,
    title: template.title,
    area: template.area,
    note: `${template.note} ${city.name} keeps pulling the same feeling back to the surface.`,
    image: template.image,
    tint: city.accent,
    aura: city.aura,
    collected: true,
    dateLabel: `${formatEchoFullDate(city.visitedAt)} / ${template.activityLabel}`,
    popularityCount: template.popularityBase - cityIndex * 8 - index * 11,
    activityLabel: template.activityLabel,
  })),
);

const galleryItems: EchoGalleryItem[] = allEchoCities.flatMap((city) => {
  const cityMine = mineEchoes.filter((item) => item.cityId === city.id);
  const cityOthers = othersEchoes.filter((item) => item.cityId === city.id);

  return [...cityMine, ...cityOthers].map((item, index) => ({
    id: `${item.id}-gallery`,
    cityId: city.id,
    echoId: item.id,
    title: item.title,
    area: item.area,
    caption: item.note,
    image: item.image,
    tint: city.accent,
    aspect: galleryAspectPattern[index % galleryAspectPattern.length] ?? 'square',
    source: item.id.includes('-mine-') ? 'mine' : 'others',
  }));
});

export function getEchoCity(cityId: string) {
  return allEchoCities.find((city) => city.id === cityId);
}

export function getEchoCityMineEchoes(cityId: string) {
  return mineEchoes.filter((item) => item.cityId === cityId);
}

export function getEchoCityOtherEchoes(cityId: string) {
  return [...othersEchoes]
    .filter((item) => item.cityId === cityId)
    .sort((a, b) => (b.popularityCount ?? 0) - (a.popularityCount ?? 0));
}

export function getEchoCollectionItem(itemId: string) {
  return mineEchoes.find((item) => item.id === itemId) ?? othersEchoes.find((item) => item.id === itemId);
}

export function getEchoGalleryItemsForCity(cityId: string) {
  return galleryItems.filter((item) => item.cityId === cityId);
}

export function filterEchoCities(cities: EchoCity[], query: string, filterKey: EchoFilterKey) {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return cities;
  }

  return cities.filter((city) => {
    if (filterKey === 'city') {
      return city.name.toLowerCase().includes(normalized) || city.note.toLowerCase().includes(normalized);
    }

    if (filterKey === 'country') {
      return city.country.toLowerCase().includes(normalized) || city.note.toLowerCase().includes(normalized);
    }

    if (filterKey === 'date') {
      return formatEchoFullDate(city.visitedAt).toLowerCase().includes(normalized);
    }

    return city.recencyLabel.toLowerCase().includes(normalized) || city.note.toLowerCase().includes(normalized);
  });
}
