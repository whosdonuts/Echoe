'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Heart, MessageCircle, Send, Music2, ChevronLeft, Mail } from 'lucide-react';
import { colors } from '@/lib/theme/colors';

type ExploreFeedMode = 'friends' | 'explore';
type ExploreViewMode = 'feed' | 'inbox';

type ExplorePost = {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  image: string;
  city: string;
  location: string;
  music: string;
  accent: string;
};

const friendsFeed: ExplorePost[] = [
  {
    id: 'friend-harbor',
    author: 'Lina',
    handle: '@linaside',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80',
    city: 'Toronto',
    location: 'Old Port ferry wall',
    music: 'Soft ferry cables',
    accent: '#87A3C9',
  },
  {
    id: 'friend-cafe',
    author: 'Mara',
    handle: '@maraleone',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    city: 'Toronto',
    location: 'Prince Street Cafe',
    music: 'Espresso hiss loop',
    accent: '#9AAFD6',
  },
  {
    id: 'friend-station',
    author: 'Noah',
    handle: '@noahnorth',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80',
    city: 'Toronto',
    location: 'Union platform 5',
    music: 'Rain over brakes',
    accent: '#7B95BC',
  },
];

const exploreFeed: ExplorePost[] = [
  {
    id: 'explore-quay',
    author: 'Collected nearby',
    handle: '@echo.explore',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    city: 'Toronto',
    location: 'Queens Quay',
    music: 'Blue hour ferry horn',
    accent: '#6482AD',
  },
  {
    id: 'explore-arcade',
    author: 'City trace',
    handle: '@echo.explore',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=1200&q=80',
    city: 'Toronto',
    location: 'St. Lawrence Arcade',
    music: 'Market after-rain',
    accent: '#8EA8CB',
  },
  {
    id: 'explore-bridge',
    author: 'City trace',
    handle: '@echo.explore',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1200&q=80',
    city: 'Toronto',
    location: 'Bathurst footbridge',
    music: 'Night wind loop',
    accent: '#A1B4D9',
  },
  {
    id: 'explore-underpass',
    author: 'Collected nearby',
    handle: '@echo.explore',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80',
    image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=80',
    city: 'Toronto',
    location: 'Lower Simcoe underpass',
    music: 'Wet tire reverb',
    accent: '#5D7AA3',
  },
];

const inboxItems = [
  {
    id: 'inbox-1',
    username: '@linaside',
    name: 'Lina',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80',
    preview: 'Echo sent',
    time: 'Now',
  },
  {
    id: 'inbox-2',
    username: '@maraleone',
    name: 'Mara',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=320&q=80',
    preview: 'Echo sent',
    time: '18m',
  },
  {
    id: 'inbox-3',
    username: '@noahnorth',
    name: 'Noah',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
    preview: 'Shared Echo with you',
    time: '1h',
  },
  {
    id: 'inbox-4',
    username: '@julesafter6',
    name: 'Jules',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80',
    preview: 'if this trace makes me cry on the streetcar, I am billing you',
    time: '3h',
  },
];

function TabToggle({ activeFeed, onChange }: { activeFeed: ExploreFeedMode; onChange: (next: ExploreFeedMode) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 2, borderRadius: 999, padding: 4, background: `linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.12))`, border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(26px) saturate(180%)', WebkitBackdropFilter: 'blur(26px) saturate(180%)', boxShadow: '0 18px 34px rgba(17, 24, 39, 0.2), inset 0 1px 0 rgba(255,255,255,0.28)' }}>
      {(['friends', 'explore'] as const).map((item) => {
        const active = item === activeFeed;
        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            style={{
              minWidth: 90, borderRadius: 999, paddingLeft: 16, paddingRight: 16, paddingTop: 9, paddingBottom: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? 'linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(255,255,255,0.86))' : 'transparent',
              border: 'none', cursor: 'pointer',
              boxShadow: active ? '0 10px 20px rgba(16, 18, 24, 0.16)' : 'none',
            }}
          >
            <span style={{ color: active ? colors.text : 'rgba(240, 244, 252, 0.82)', fontSize: 14, fontWeight: 700, letterSpacing: 0.1 }}>
              {item === 'friends' ? 'Friends' : 'Explore'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FeedActions({ accent, liked, onToggleLike }: { accent: string; liked: boolean; onToggleLike: () => void }) {
  return (
    <div style={{ position: 'absolute', right: 16, bottom: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <button
        onClick={onToggleLike}
        style={{
          width: 50, height: 50, borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: liked
            ? `linear-gradient(180deg, rgba(255,255,255,0.76), rgba(255,255,255,0.56))`
            : 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.12))',
          border: `1px solid ${liked ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.18)'}`,
          backdropFilter: 'blur(22px) saturate(180%)',
          WebkitBackdropFilter: 'blur(22px) saturate(180%)',
          boxShadow: liked ? '0 20px 32px rgba(74, 104, 142, 0.24)' : '0 18px 30px rgba(10, 12, 20, 0.2)',
          transform: liked ? 'scale(1.04)' : 'scale(1)',
          transition: 'all 0.15s ease', cursor: 'pointer',
        }}
      >
        <Heart size={24} color={liked ? colors.shellAccentText : colors.echoMainWhite} fill={liked ? colors.shellAccentText : 'none'} />
      </button>
      <button style={{ width: 50, height: 50, borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.12))', border: '1px solid rgba(255, 255, 255, 0.18)', backdropFilter: 'blur(22px) saturate(180%)', WebkitBackdropFilter: 'blur(22px) saturate(180%)', boxShadow: '0 18px 30px rgba(10, 12, 20, 0.2)', cursor: 'pointer' }}>
        <MessageCircle size={23} color={colors.echoMainWhite} />
      </button>
      <button style={{ width: 50, height: 50, borderRadius: 25, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.12))', border: '1px solid rgba(255, 255, 255, 0.18)', backdropFilter: 'blur(22px) saturate(180%)', WebkitBackdropFilter: 'blur(22px) saturate(180%)', boxShadow: '0 18px 30px rgba(10, 12, 20, 0.2)', cursor: 'pointer' }}>
        <Send size={23} color={colors.echoMainWhite} />
      </button>
      <div style={{ width: 54, height: 54, borderRadius: 27, border: `1px solid rgba(255,255,255,0.22)`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.1))', backdropFilter: 'blur(22px) saturate(180%)', WebkitBackdropFilter: 'blur(22px) saturate(180%)', boxShadow: '0 18px 30px rgba(10, 12, 20, 0.2)' }}>
        <div style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Music2 size={16} color={colors.echoMainWhite} />
        </div>
      </div>
    </div>
  );
}

function ExploreFeedCard({ post, height, liked, onToggleLike }: { post: ExplorePost; height: number; liked: boolean; onToggleLike: () => void }) {
  return (
    <div style={{ width: '100%', height, backgroundColor: '#120D0A', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      {/* Background image */}
      <img src={post.image} alt={post.city} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(19, 13, 10, 0.20), rgba(19, 13, 10, 0.02) 42%, rgba(19, 13, 10, 0.34))' }} />
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <FeedActions accent={post.accent} liked={liked} onToggleLike={onToggleLike} />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 220, background: 'linear-gradient(to bottom, rgba(8,6,5,0), rgba(8,6,5,0.14), rgba(8,6,5,0.36))' }} />
        <div style={{ position: 'absolute', left: 18, right: 96, bottom: 100, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ color: colors.echoMainWhite, fontSize: 16, fontWeight: 700 }}>{post.city}</span>
          <span style={{ color: 'rgba(255, 255, 255, 0.82)', fontSize: 13, fontWeight: 600 }}>{post.handle}</span>
        </div>
      </div>
    </div>
  );
}

function InboxPlaceholder({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: colors.echoOffWhiteBackground, height: '100%', overflowY: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, paddingLeft: 18, paddingRight: 18, paddingTop: 16, paddingBottom: 18, borderBottom: `1px solid ${colors.shellBorderSoft}`, background: `linear-gradient(180deg, rgba(255,255,255,0.96), ${colors.shellSurfaceSoft})` }}>
        <button
          onClick={onBack}
          style={{ width: 42, height: 42, borderRadius: 21, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(180deg, rgba(255,255,255,0.94), ${colors.shellSurfaceSoft})`, border: `1px solid ${colors.shellBorderSoft}`, boxShadow: `0 14px 24px ${colors.shellShadow}`, cursor: 'pointer' }}
        >
          <ChevronLeft size={20} color={colors.text} />
        </button>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ color: colors.echoInk, fontSize: 24, fontWeight: 700 }}>Inbox</span>
          <span style={{ color: colors.textSoft, fontSize: 13, fontWeight: 500 }}>Only friends can message you on Echo.</span>
        </div>
      </div>
      <div style={{ paddingLeft: 18, paddingRight: 18, paddingTop: 8 }}>
        {inboxItems.map((item) => (
          <button
            key={item.id}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 14, paddingBottom: 14, borderBottom: `1px solid ${colors.shellBorderSoft}`, width: '100%', background: 'none', border: 'none', borderBottomColor: colors.shellBorderSoft, borderBottomWidth: 1, borderBottomStyle: 'solid', cursor: 'pointer' }}
          >
            <img src={item.avatar} alt={item.name} style={{ width: 54, height: 54, borderRadius: 27, objectFit: 'cover', flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ color: colors.echoInk, fontSize: 15, fontWeight: 700 }}>{item.name}</span>
                <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 700 }}>{item.time}</span>
              </div>
              <span style={{ color: colors.shellAccentText, fontSize: 12, fontWeight: 600 }}>{item.username}</span>
              <span style={{ color: colors.textSoft, fontSize: 13, lineHeight: '18px', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{item.preview}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ExploreScreen() {
  const [activeFeed, setActiveFeed] = useState<ExploreFeedMode>('explore');
  const [viewMode, setViewMode] = useState<ExploreViewMode>('feed');
  const [likedPostIds, setLikedPostIds] = useState<Record<string, boolean>>({});
  const listRef = useRef<HTMLDivElement>(null);

  const feedData = useMemo(() => (activeFeed === 'friends' ? friendsFeed : exploreFeed), [activeFeed]);
  const postHeight = typeof window !== 'undefined' ? Math.max(window.innerHeight, 640) : 640;

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [activeFeed]);

  function toggleLike(postId: string) {
    setLikedPostIds((current) => ({ ...current, [postId]: !current[postId] }));
  }

  if (viewMode === 'inbox') {
    return <InboxPlaceholder onBack={() => setViewMode('feed')} />;
  }

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#120D0A', position: 'relative', overflow: 'hidden' }}>
      {/* Paged feed scroll */}
      <div
        ref={listRef}
        style={{ width: '100%', height: '100%', overflowY: 'scroll', scrollSnapType: 'y mandatory' }}
        className="scrollbar-hide"
      >
        {feedData.map((post) => (
          <div key={post.id} style={{ scrollSnapAlign: 'start', height: postHeight }}>
            <ExploreFeedCard height={postHeight} liked={Boolean(likedPostIds[post.id])} onToggleLike={() => toggleLike(post.id)} post={post} />
          </div>
        ))}
      </div>
      {/* Top controls overlay */}
      <div style={{ position: 'absolute', top: 8, left: 0, right: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 14, paddingRight: 14, pointerEvents: 'none' }}>
        <div style={{ width: 44 }} />
        <div style={{ pointerEvents: 'auto' }}>
          <TabToggle activeFeed={activeFeed} onChange={setActiveFeed} />
        </div>
        <button
          onClick={() => setViewMode('inbox')}
          style={{ width: 44, height: 44, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.12))', border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(26px) saturate(180%)', WebkitBackdropFilter: 'blur(26px) saturate(180%)', boxShadow: '0 18px 34px rgba(17, 24, 39, 0.2), inset 0 1px 0 rgba(255,255,255,0.28)', cursor: 'pointer', pointerEvents: 'auto' }}
        >
          <Mail size={20} color={colors.echoMainWhite} />
        </button>
      </div>
    </div>
  );
}
