const uploadBasePath = '/city-uploads';
const jordanHandle = '@jordan';

export type UploadedExplorePost = {
  id: string;
  author: string;
  handle: string;
  avatar?: string;
  image?: string;
  media: {
    type: 'image' | 'video';
    src: string;
    poster?: string;
    sources?: Array<{
      src: string;
      type: string;
    }>;
  };
  city: string;
  location: string;
  music: string;
  accent: string;
};

export type UploadedMineEcho = {
  title: string;
  area: string;
  note: string;
  image: string;
};

export type UploadedOtherEcho = UploadedMineEcho & {
  activityLabel: string;
};

export type UploadedProfileFavorite = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  image: string;
  badge?: string;
};

type UploadedPlacement = 'explore' | 'friends' | 'user-echoes' | 'other';

type UploadedCityAsset = {
  id: string;
  cityId: string;
  city: string;
  author: string;
  handle: string;
  image: string;
  placement: UploadedPlacement;
  accent: string;
};

function assetPath(filename: string) {
  return `${uploadBasePath}/${filename}`;
}

function slugifySegment(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function authorFromHandle(handle: string) {
  const name = handle.replace(/^@/, '').trim();
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function displayCityName(city: string) {
  return city
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizePlacementLabel(value: string): UploadedPlacement {
  const normalized = value.trim().toLowerCase().replace(/\s+/g, '-');

  if (normalized === 'my-echoes') return 'user-echoes';
  if (normalized === 'explore' || normalized === 'friends' || normalized === 'user-echoes' || normalized === 'other') {
    return normalized;
  }

  throw new Error(`Unsupported uploaded placement "${value}"`);
}

function parseUploadedFilename(filename: string) {
  const extensionMatch = filename.match(/\.([^.]+)$/);

  if (!extensionMatch) {
    throw new Error(`Unsupported uploaded filename "${filename}"`);
  }

  let basename = filename.slice(0, -extensionMatch[0].length).trim();
  let variant = 1;

  const variantMatch = basename.match(/\((\d+)\)\s*$/);

  if (variantMatch?.index !== undefined) {
    variant = Number(variantMatch[1]);
    basename = basename.slice(0, variantMatch.index).trim();
  }

  const match = basename.match(/^(.+?)\s+(@[^\s]+)\s+\(([^)]+)\)$/i);

  if (!match) {
    throw new Error(`Unsupported uploaded filename "${filename}"`);
  }

  const [, city, handle, placementLabel] = match;

  return {
    city: displayCityName(city),
    handle: handle.trim().toLowerCase(),
    placement: normalizePlacementLabel(placementLabel),
    variant,
  };
}

function uploadedMediaPath(filename: string) {
  const { city, handle, placement, variant } = parseUploadedFilename(filename);
  const extension = filename.split('.').pop()?.toLowerCase() ?? 'mov';
  const variantSuffix = variant > 1 ? `-${variant}` : '';

  return assetPath(
    `${slugifySegment(city)}-${slugifySegment(handle.replace(/^@/, ''))}-${slugifySegment(placement)}${variantSuffix}.${extension}`,
  );
}

function uploadedMp4Path(filename: string) {
  const { city, handle, placement, variant } = parseUploadedFilename(filename);
  const variantSuffix = variant > 1 ? `-${variant}` : '';

  return assetPath(
    `${slugifySegment(city)}-${slugifySegment(handle.replace(/^@/, ''))}-${slugifySegment(placement)}${variantSuffix}.mp4`,
  );
}

function isJordanAsset(asset: UploadedCityAsset) {
  return asset.handle.toLowerCase() === jordanHandle;
}

function groupByCity<T extends { cityId: string }, TResult>(
  items: T[],
  mapItem: (item: T, index: number) => TResult,
): Partial<Record<string, TResult[]>> {
  const grouped: Partial<Record<string, TResult[]>> = {};

  for (const item of items) {
    const cityItems = grouped[item.cityId] ?? [];
    cityItems.push(mapItem(item, cityItems.length));
    grouped[item.cityId] = cityItems;
  }

  return grouped;
}

function activityLabelForPlacement(placement: UploadedPlacement) {
  if (placement === 'explore') return 'from Explore';
  if (placement === 'friends') return 'from Friends';
  return 'shared by others';
}

function areaLabelForPlacement(placement: UploadedPlacement) {
  if (placement === 'explore') return 'Explore surface';
  if (placement === 'friends') return 'Friends surface';
  return 'Shared city moment';
}

const uploadedCityAssets: UploadedCityAsset[] = [
  {
    id: 'barcelona-alex-explore',
    cityId: 'barcelona-ca',
    city: 'Barcelona',
    author: 'Alex',
    handle: '@alex',
    image: assetPath('barcelona-alex-explore.jpg'),
    placement: 'explore',
    accent: '#6482AD',
  },
  {
    id: 'barcelona-xavier-friends-1',
    cityId: 'barcelona-ca',
    city: 'Barcelona',
    author: 'Xavier',
    handle: '@xavier',
    image: assetPath('barcelona-xavier-friends-1.jpg'),
    placement: 'friends',
    accent: '#7A9BC8',
  },
  {
    id: 'barcelona-xavier-friends-2',
    cityId: 'barcelona-ca',
    city: 'Barcelona',
    author: 'Xavier',
    handle: '@xavier',
    image: assetPath('barcelona-xavier-friends-2.jpg'),
    placement: 'friends',
    accent: '#8EA8CB',
  },
  {
    id: 'barcelona-xavier-friends-3',
    cityId: 'barcelona-ca',
    city: 'Barcelona',
    author: 'Xavier',
    handle: '@xavier',
    image: assetPath('barcelona-xavier-friends-3.jpg'),
    placement: 'friends',
    accent: '#A1B4D9',
  },
  {
    id: 'barcelona-jordan-mine-1',
    cityId: 'barcelona-ca',
    city: 'Barcelona',
    author: 'Jordan',
    handle: '@jordan',
    image: assetPath('barcelona-jordan-my-echoes-1.jpg'),
    placement: 'user-echoes',
    accent: '#D99060',
  },
  {
    id: 'barcelona-jordan-mine-2',
    cityId: 'barcelona-ca',
    city: 'Barcelona',
    author: 'Jordan',
    handle: '@jordan',
    image: assetPath('barcelona-jordan-my-echoes-2.jpg'),
    placement: 'user-echoes',
    accent: '#D99060',
  },
  {
    id: 'barcelona-jordan-mine-3',
    cityId: 'barcelona-ca',
    city: 'Barcelona',
    author: 'Jordan',
    handle: '@jordan',
    image: assetPath('barcelona-jordan-my-echoes-3.jpg'),
    placement: 'user-echoes',
    accent: '#D99060',
  },
  {
    id: 'kingston-jordan-mine-1',
    cityId: 'kingston-cu',
    city: 'Kingston',
    author: 'Jordan',
    handle: '@jordan',
    image: assetPath('kingston-jordan-my-echoes.jpeg'),
    placement: 'user-echoes',
    accent: '#D5906C',
  },
  {
    id: 'london-alex-other',
    cityId: 'london-on',
    city: 'London',
    author: 'Alex',
    handle: '@alex',
    image: assetPath('london-alex-other.jpeg'),
    placement: 'other',
    accent: '#8FB5CC',
  },
  {
    id: 'london-daniel-explore',
    cityId: 'london-on',
    city: 'London',
    author: 'Daniel',
    handle: '@daniel',
    image: assetPath('london-daniel-explore.jpeg'),
    placement: 'explore',
    accent: '#7EA7C6',
  },
  {
    id: 'london-somy-explore',
    cityId: 'london-on',
    city: 'London',
    author: 'Somy',
    handle: '@somy',
    image: assetPath('london-somy-explore.jpeg'),
    placement: 'explore',
    accent: '#97B4D5',
  },
  {
    id: 'london-jordan-mine-1',
    cityId: 'london-on',
    city: 'London',
    author: 'Jordan',
    handle: '@jordan',
    image: assetPath('london-jordan-my-echoes-1.jpeg'),
    placement: 'user-echoes',
    accent: '#8FB5CC',
  },
  {
    id: 'london-jordan-mine-2',
    cityId: 'london-on',
    city: 'London',
    author: 'Jordan',
    handle: '@jordan',
    image: assetPath('london-jordan-my-echoes-2.jpeg'),
    placement: 'user-echoes',
    accent: '#8FB5CC',
  },
  {
    id: 'milton-ella-friends-1',
    cityId: 'milton-on',
    city: 'Milton',
    author: 'Ella',
    handle: '@ella',
    image: assetPath('milton-ella-friends-1.jpeg'),
    placement: 'friends',
    accent: '#8CC3AE',
  },
  {
    id: 'milton-ella-friends-2',
    cityId: 'milton-on',
    city: 'Milton',
    author: 'Ella',
    handle: '@ella',
    image: assetPath('milton-ella-friends-2.jpg'),
    placement: 'friends',
    accent: '#9CCCB8',
  },
  {
    id: 'milton-joseph-explore',
    cityId: 'milton-on',
    city: 'Milton',
    author: 'Joseph',
    handle: '@joseph',
    image: assetPath('milton-joseph-explore.jpg'),
    placement: 'explore',
    accent: '#7CB3A1',
  },
  {
    id: 'milton-jordan-mine-1',
    cityId: 'milton-on',
    city: 'Milton',
    author: 'Jordan',
    handle: '@jordan',
    image: assetPath('milton-jordan-my-echoes.jpeg'),
    placement: 'user-echoes',
    accent: '#98C4B4',
  },
  {
    id: 'orlando-mikhai-friends',
    cityId: 'orlando-fl',
    city: 'Orlando',
    author: 'Mikhai',
    handle: '@mikhai',
    image: assetPath('orlando-mikhai-friends.jpeg'),
    placement: 'friends',
    accent: '#9FCDBF',
  },
  {
    id: 'orlando-jordan-mine-1',
    cityId: 'orlando-fl',
    city: 'Orlando',
    author: 'Jordan',
    handle: '@jordan',
    image: assetPath('orlando-jordan-my-echoes-1.jpeg'),
    placement: 'user-echoes',
    accent: '#9FCDBF',
  },
  {
    id: 'seattle-jordan-mine-1',
    cityId: 'seattle-wa',
    city: 'Seattle',
    author: 'Jordan',
    handle: '@jordan',
    image: assetPath('seattle-jordan-my-echoes.jpeg'),
    placement: 'user-echoes',
    accent: '#93B8CC',
  },
  {
    id: 'toronto-adrian-explore',
    cityId: 'toronto-on',
    city: 'Toronto',
    author: 'Adrian',
    handle: '@adrian',
    image: assetPath('toronto-adrian-explore.jpeg'),
    placement: 'explore',
    accent: '#7393BA',
  },
  {
    id: 'toronto-ben-friends',
    cityId: 'toronto-on',
    city: 'Toronto',
    author: 'Ben',
    handle: '@ben',
    image: assetPath('toronto-ben-friends.jpeg'),
    placement: 'friends',
    accent: '#90A6C8',
  },
  {
    id: 'toronto-daniel-explore',
    cityId: 'toronto-on',
    city: 'Toronto',
    author: 'Daniel',
    handle: '@daniel',
    image: assetPath('toronto-daniel-explore.jpeg'),
    placement: 'explore',
    accent: '#8EA8CB',
  },
  {
    id: 'toronto-dylan-explore',
    cityId: 'toronto-on',
    city: 'Toronto',
    author: 'Dylan',
    handle: '@dylan',
    image: assetPath('toronto-dylan-explore.jpeg'),
    placement: 'explore',
    accent: '#5D7AA3',
  },
  {
    id: 'toronto-jordan-mine-1',
    cityId: 'toronto-on',
    city: 'Toronto',
    author: 'Jordan',
    handle: '@jordan',
    image: assetPath('toronto-jordan-my-echoes.jpeg'),
    placement: 'user-echoes',
    accent: '#D4AF84',
  },
];

const baseUploadedExploreFeed: UploadedExplorePost[] = uploadedCityAssets
  .filter((asset) => asset.placement === 'explore')
  .map((asset) => ({
    id: asset.id,
    author: asset.author,
    handle: asset.handle,
    avatar: asset.image,
    image: asset.image,
    media: {
      type: 'image',
      src: asset.image,
    },
    city: asset.city,
    location: `Explore / ${asset.city}`,
    music: 'Collected nearby',
    accent: asset.accent,
  }));

const baseUploadedFriendsFeed: UploadedExplorePost[] = uploadedCityAssets
  .filter((asset) => asset.placement === 'friends')
  .map((asset) => ({
    id: asset.id,
    author: asset.author,
    handle: asset.handle,
    avatar: asset.image,
    image: asset.image,
    media: {
      type: 'image',
      src: asset.image,
    },
    city: asset.city,
    location: `Friends / ${asset.city}`,
    music: 'Shared city loop',
    accent: asset.accent,
  }));

type FeedVideoOverride = {
  accent: string;
  filename: string;
  insertAfterId?: string;
  poster?: string;
  replacePostId?: string;
};

const exploreVideoOverrides: FeedVideoOverride[] = [
  {
    accent: '#7CB3A1',
    filename: 'Hamilton @joseph (explore).mov',
    replacePostId: 'milton-joseph-explore',
  },
  {
    accent: '#7D9CC3',
    filename: 'Toronto @mikhai (explore).MOV',
    insertAfterId: 'toronto-dylan-explore',
  },
  {
    accent: '#8CC6C0',
    filename: 'Bavaro @daniel (explore).MOV',
  },
  {
    accent: '#7DB8C7',
    filename: 'bavaro @daniel (explore) (2).MOV',
    insertAfterId: 'bavaro-daniel-explore',
  },
];

const friendsVideoOverrides: FeedVideoOverride[] = [
  {
    accent: '#89CBBE',
    filename: 'Bavaro @tochi (friends).MOV',
  },
];

function createVideoFeedPost({ accent, filename, poster }: FeedVideoOverride): UploadedExplorePost {
  const parsed = parseUploadedFilename(filename);
  const variantSuffix = parsed.variant > 1 ? `-${parsed.variant}` : '';
  const feedLabel = parsed.placement === 'friends' ? 'Friends' : 'Explore';
  const musicLabel = parsed.placement === 'friends' ? 'Shared city loop' : 'Collected nearby';

  return {
    id: `${slugifySegment(parsed.city)}-${slugifySegment(parsed.handle.replace(/^@/, ''))}-${parsed.placement}${variantSuffix}`,
    author: authorFromHandle(parsed.handle),
    handle: parsed.handle,
    image: poster,
    media: {
      type: 'video',
      src: uploadedMp4Path(filename),
      poster,
      sources: [
        {
          src: uploadedMp4Path(filename),
          type: 'video/mp4',
        },
        {
          src: uploadedMediaPath(filename),
          type: 'video/quicktime',
        },
      ],
    },
    city: parsed.city,
    location: `${feedLabel} / ${parsed.city}`,
    music: musicLabel,
    accent,
  };
}

function mergeVideoOverrides(posts: UploadedExplorePost[], overrides: FeedVideoOverride[]) {
  const mergedPosts = [...posts];

  for (const override of overrides) {
    const replacementPost = createVideoFeedPost(override);

    if (override.replacePostId) {
      const replaceIndex = mergedPosts.findIndex((post) => post.id === override.replacePostId);

      if (replaceIndex >= 0) {
        mergedPosts.splice(replaceIndex, 1, replacementPost);
        continue;
      }
    }

    if (override.insertAfterId) {
      const insertAfterIndex = mergedPosts.findIndex((post) => post.id === override.insertAfterId);

      if (insertAfterIndex >= 0) {
        mergedPosts.splice(insertAfterIndex + 1, 0, replacementPost);
        continue;
      }
    }

    mergedPosts.push(replacementPost);
  }

  return mergedPosts;
}

export const uploadedExploreFeed: UploadedExplorePost[] = mergeVideoOverrides(baseUploadedExploreFeed, exploreVideoOverrides);

export const uploadedFriendsFeed: UploadedExplorePost[] = mergeVideoOverrides(baseUploadedFriendsFeed, friendsVideoOverrides);

export const uploadedMineEchoesByCity = groupByCity(
  uploadedCityAssets.filter((asset) => asset.placement === 'user-echoes' && isJordanAsset(asset)),
  (asset, index): UploadedMineEcho => ({
    title: `${asset.city} Echo ${String(index + 1).padStart(2, '0')}`,
    area: 'Jordan archive',
    note: `Jordan saved this ${asset.city} moment to the owner archive.`,
    image: asset.image,
  }),
);

export const uploadedOtherEchoesByCity = groupByCity(
  uploadedCityAssets.filter((asset) => !isJordanAsset(asset) && asset.placement !== 'user-echoes'),
  (asset): UploadedOtherEcho => ({
    title: `${asset.author} in ${asset.city}`,
    area: areaLabelForPlacement(asset.placement),
    note: `${asset.handle} shared this ${asset.city} moment for the public city archive.`,
    image: asset.image,
    activityLabel: activityLabelForPlacement(asset.placement),
  }),
);

export const uploadedProfileFavorites: UploadedProfileFavorite[] = [
  {
    id: 'favorite-toronto-owner',
    title: 'Toronto Favorite',
    subtitle: 'Jordan owner favorite',
    meta: 'Toronto / saved to Favorites',
    image: assetPath('toronto-jordan-favorites.jpeg'),
    badge: 'Favorite',
  },
  {
    id: 'favorite-barcelona-owner',
    title: 'Barcelona Favorite',
    subtitle: 'Jordan owner archive',
    meta: 'Barcelona / Jordan',
    image: assetPath('barcelona-jordan-my-echoes-1.jpg'),
  },
  {
    id: 'favorite-london-owner',
    title: 'London Favorite',
    subtitle: 'Jordan owner archive',
    meta: 'London / Jordan',
    image: assetPath('london-jordan-my-echoes-2.jpeg'),
  },
];

export const webFallbackEchoesByCity = {
  'mississauga-on': [
    {
      title: 'Absolute World',
      area: 'City Centre skyline',
      note: 'A sharp Mississauga skyline anchor built around one of the city\'s most recognizable towers.',
      image: '/city-fallbacks/mississauga-absolute-world.jpg',
    },
    {
      title: 'Port Credit light',
      area: 'Port Credit waterfront',
      note: 'Lakefront air and evening color that feels rooted in Mississauga rather than generic shoreline filler.',
      image: '/city-fallbacks/mississauga-port-credit.jpg',
    },
  ],
  'hamilton-on': [
    {
      title: 'Bayfront sunrise',
      area: 'Hamilton harbour',
      note: 'A clean Hamilton waterfront view with real industrial and bayfront identity.',
      image: '/city-fallbacks/hamilton-sunrise-skyline.jpg',
    },
    {
      title: 'Harbour industry',
      area: 'Industrial waterfront',
      note: 'A more textured Hamilton skyline that keeps the city\'s steel-and-water character intact.',
      image: '/city-fallbacks/hamilton-industrial-skyline.jpg',
    },
  ],
  'etobicoke-on': [
    {
      title: 'Sheldon lookout',
      area: 'Humber Bay overlook',
      note: 'A recognizable Etobicoke-to-downtown waterfront perspective instead of a generic skyline insert.',
      image: '/city-fallbacks/etobicoke-sheldon-lookout-1.jpg',
    },
    {
      title: 'Lakeshore dusk',
      area: 'Humber Bay shoreline',
      note: 'Another Humber Bay view that keeps the lakefront identity specific to Etobicoke.',
      image: '/city-fallbacks/etobicoke-sheldon-lookout-2.jpg',
    },
  ],
  'montreal-on': [
    {
      title: 'Old Port skyline',
      area: 'Old Port marina',
      note: 'A Montreal waterfront scene with immediate skyline recognition and stronger place identity.',
      image: '/city-fallbacks/montreal-old-port-1.jpg',
    },
    {
      title: 'Harbour line',
      area: 'Old Port edge',
      note: 'A second Montreal harbour view that stays urban, specific, and premium.',
      image: '/city-fallbacks/montreal-old-port-2.jpg',
    },
  ],
  'nyc-ny': [
    {
      title: 'Brooklyn frame',
      area: 'Brooklyn Bridge approach',
      note: 'An instantly readable New York scene with landmark structure and dense skyline identity.',
      image: '/city-fallbacks/nyc-brooklyn-bridge.jpg',
    },
    {
      title: 'Queensboro light',
      area: 'East River skyline',
      note: 'A second New York landmark view that feels cinematic without slipping into random stock filler.',
      image: '/city-fallbacks/nyc-queensboro-bridge.jpg',
    },
  ],
  'london-uk': [
    {
      title: 'Tower Bridge dusk',
      area: 'Tower Bridge',
      note: 'A clear London landmark image that carries the city immediately.',
      image: '/city-fallbacks/london-uk-tower-bridge-1.jpg',
    },
    {
      title: 'River approach',
      area: 'Thames skyline',
      note: 'A second London riverside landmark view for non-generic fallback coverage.',
      image: '/city-fallbacks/london-uk-tower-bridge-2.jpg',
    },
  ],
  'kingston-cu': [
    {
      title: 'Waterfront line',
      area: 'Kingston harbour',
      note: 'A Caribbean waterfront image that reads as a real Kingston, Jamaica city edge.',
      image: '/city-fallbacks/kingston-jamaica-waterfront.jpg',
    },
  ],
  'seattle-wa': [
    {
      title: 'Needle view',
      area: 'Seattle waterfront',
      note: 'A specific Seattle skyline scene anchored by the Space Needle for cleaner fallback identity.',
      image: '/city-fallbacks/seattle-waterfront-space-needle.jpg',
    },
  ],
} as const satisfies Partial<Record<string, UploadedMineEcho[]>>;
