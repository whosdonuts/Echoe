import londonRaw from '@/lib/features/map/data/london_echo_fragments_extended.json';
import westernRaw from '@/lib/features/map/data/western_echo_fragments_revised_fresh.json';
import { barcelonaCount, barcelonaUnlockedCount, barcelonaToFeatureCollection } from '@/lib/features/map/barcelona';
import { fragmentsToFeatureCollection } from '@/lib/features/map/geo';
import { LONDON_AMBIENT } from '@/lib/features/map/londonAmbient';
import type { FragmentFeatureCollection, WesternFragment } from '@/lib/features/map/types';

export const westernFragments = westernRaw as WesternFragment[];
export const londonJsonFragments = londonRaw as WesternFragment[];
export const londonFragments: WesternFragment[] = [...londonJsonFragments, ...LONDON_AMBIENT];

export const westernCount = westernFragments.length;
export const londonCount = londonFragments.length;
export const featuredCount = westernFragments.filter((fragment) => fragment.tag === 'Featured').length;

export const londonGeoJSON: FragmentFeatureCollection = fragmentsToFeatureCollection(londonFragments);
export const barcelonaGeoJSON = barcelonaToFeatureCollection();

export { barcelonaCount, barcelonaUnlockedCount };
