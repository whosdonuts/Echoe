export type SocialTone = 'terracotta' | 'sand' | 'clay' | 'cream' | 'neutral';
export type SocialBadgeTone = 'accent' | 'sand' | 'soft' | 'neutral';

export type SocialAvatarRecord = {
  id: string;
  name: string;
  tone: SocialTone;
  active?: boolean;
};

export type FriendActivity = SocialAvatarRecord & {
  summary: string;
  time: string;
  badgeLabel?: string;
  badgeTone?: SocialBadgeTone;
};

export type DiscoverFriend = SocialAvatarRecord & {
  top: number;
  left: number;
  size: number;
  label?: string;
};

export type LeaderboardPodiumEntry = {
  id: string;
  name: string;
  points: string;
  tone: SocialTone;
  pedestalHeight: number;
  rank: 1 | 2 | 3;
};

export type LeaderboardRow = {
  rank: number;
  name: string;
  points: string;
  highlight?: boolean;
};

export type TradeOffer = SocialAvatarRecord & {
  info: string;
  emphasized?: boolean;
  setTitle: string;
  yourItem: string;
  yourMeta: string;
  friendItem: string;
  friendMeta: string;
  statusLabel: string;
  statusText: string;
};

export type InboxItem = SocialAvatarRecord & {
  preview: string;
  time: string;
};

export const activeFriends: SocialAvatarRecord[] = [
  { id: 'alex', name: 'Alex', tone: 'terracotta', active: true },
  { id: 'xavier', name: 'Xavier', tone: 'sand', active: true },
  { id: 'ben', name: 'Ben', tone: 'clay', active: true },
  { id: 'daniel', name: 'Daniel', tone: 'neutral' },
  { id: 'dylan', name: 'Dylan', tone: 'terracotta', active: true },
];

export const friendActivities: FriendActivity[] = [
  {
    id: 'activity-alex',
    name: 'Alex',
    tone: 'terracotta',
    active: true,
    summary: 'Shared a new fragment from Mile End rooftop.',
    time: '2m',
    badgeLabel: 'Active',
    badgeTone: 'accent',
  },
  {
    id: 'activity-xavier',
    name: 'Xavier',
    tone: 'sand',
    active: true,
    summary: 'Opened a trade request for River Light.',
    time: '18m',
    badgeLabel: 'Trade',
    badgeTone: 'neutral',
  },
  {
    id: 'activity-ben',
    name: 'Ben',
    tone: 'clay',
    summary: 'Commented on your Lisbon echo collection.',
    time: '1h',
    badgeLabel: 'Reply',
    badgeTone: 'neutral',
  },
  {
    id: 'activity-ella',
    name: 'Ella',
    tone: 'terracotta',
    summary: 'Finished a fragment set and moved up the leaderboard.',
    time: '3h',
    badgeLabel: 'Top 5',
    badgeTone: 'sand',
  },
];

export const discoverFriends: DiscoverFriend[] = [
  { id: 'discover-alex', name: 'Alex', tone: 'terracotta', top: 28, left: 18, size: 58 },
  { id: 'discover-xavier', name: 'Xavier', tone: 'sand', top: 76, left: 118, size: 52 },
  {
    id: 'discover-ben',
    name: 'Ben',
    tone: 'terracotta',
    top: 24,
    left: 230,
    size: 60,
    label: 'Ben',
  },
  { id: 'discover-daniel', name: 'Daniel', tone: 'neutral', top: 116, left: 296, size: 42 },
  { id: 'discover-dylan', name: 'Dylan', tone: 'clay', top: 176, left: 36, size: 60 },
  { id: 'discover-ella', name: 'Ella', tone: 'sand', top: 228, left: 146, size: 48 },
  { id: 'discover-joseph', name: 'Joseph', tone: 'terracotta', top: 208, left: 236, size: 56 },
  {
    id: 'discover-adrian',
    name: 'Adrian',
    tone: 'terracotta',
    top: 330,
    left: 72,
    size: 54,
    label: 'Adrian',
  },
  { id: 'discover-somy', name: 'Somy', tone: 'neutral', top: 378, left: 66, size: 48 },
  {
    id: 'discover-mikhai',
    name: 'Mikhai',
    tone: 'terracotta',
    top: 328,
    left: 184,
    size: 60,
  },
  {
    id: 'discover-ben-chip',
    name: 'Ben',
    tone: 'clay',
    top: 424,
    left: 144,
    size: 58,
    label: 'Ben',
  },
  { id: 'discover-daniel-chip', name: 'Daniel', tone: 'sand', top: 474, left: 278, size: 50 },
];

export const leaderboardPodium: LeaderboardPodiumEntry[] = [
  {
    id: 'podium-1',
    name: 'Alex',
    points: '9,860 pts',
    tone: 'terracotta',
    pedestalHeight: 132,
    rank: 1,
  },
  {
    id: 'podium-2',
    name: 'Xavier',
    points: '8,420 pts',
    tone: 'clay',
    pedestalHeight: 96,
    rank: 2,
  },
  {
    id: 'podium-3',
    name: 'Ella',
    points: '7,930 pts',
    tone: 'sand',
    pedestalHeight: 84,
    rank: 3,
  },
];

export const leaderboardRows: LeaderboardRow[] = [
  { rank: 4, name: 'Ben', points: '6,980', highlight: true },
  { rank: 5, name: 'Daniel', points: '6,420' },
  { rank: 6, name: 'Dylan', points: '6,080' },
  { rank: 7, name: 'Adrian', points: '5,740' },
  { rank: 8, name: 'Joseph', points: '5,360' },
];

export const tradeOffers: TradeOffer[] = [
  {
    id: 'trade-xavier',
    name: 'Xavier',
    tone: 'terracotta',
    info: 'You give River Light. You receive Station Air.',
    emphasized: true,
    setTitle: 'UNO Set',
    yourItem: 'River Light',
    yourMeta: 'Rare fragment',
    friendItem: 'Station Air',
    friendMeta: 'Open for swap',
    statusLabel: 'Pending',
    statusText: 'Awaiting confirmation from Xavier.',
  },
  {
    id: 'trade-ben',
    name: 'Ben',
    tone: 'sand',
    info: 'You give Station Air. You receive Blue Hour.',
    setTitle: 'Night Transit',
    yourItem: 'Station Air',
    yourMeta: 'Duplicate fragment',
    friendItem: 'Blue Hour',
    friendMeta: 'Missing from your set',
    statusLabel: 'Ready',
    statusText: 'Ben has marked this swap as available right now.',
  },
  {
    id: 'trade-daniel',
    name: 'Daniel',
    tone: 'clay',
    info: 'You give Station Air. You receive River Light.',
    setTitle: 'Golden Hour',
    yourItem: 'Station Air',
    yourMeta: 'Spare fragment',
    friendItem: 'River Light',
    friendMeta: 'Wanted by you',
    statusLabel: 'Open',
    statusText: 'Daniel is open to a direct one-for-one exchange.',
  },
  {
    id: 'trade-adrian',
    name: 'Adrian',
    tone: 'terracotta',
    info: 'You give Blue Hour. You receive City Glow.',
    emphasized: true,
    setTitle: 'City Signals',
    yourItem: 'Blue Hour',
    yourMeta: 'Common duplicate',
    friendItem: 'City Glow',
    friendMeta: 'Rare fragment',
    statusLabel: 'Pending',
    statusText: 'Adrian has seen the request and has not responded yet.',
  },
  {
    id: 'trade-ella',
    name: 'Ella',
    tone: 'neutral',
    info: 'You give Harbor Line. You receive Rooftop Echo.',
    setTitle: 'Studio Set',
    yourItem: 'Harbor Line',
    yourMeta: 'Duplicate fragment',
    friendItem: 'Rooftop Echo',
    friendMeta: 'Needed to complete set',
    statusLabel: 'Suggested',
    statusText: 'This trade matches both of your missing pieces.',
  },
];

export const inboxItems: InboxItem[] = [
  {
    id: 'inbox-xavier',
    name: 'Xavier',
    tone: 'terracotta',
    preview: 'Sent you a new trade request.',
    time: 'Now',
    active: true,
  },
  {
    id: 'inbox-alex',
    name: 'Alex',
    tone: 'clay',
    preview: 'Shared a fragment from Mile End rooftop.',
    time: '18m',
    active: true,
  },
  {
    id: 'inbox-ben',
    name: 'Ben',
    tone: 'sand',
    preview: 'Moved up in Communities this afternoon.',
    time: '1h',
  },
];
