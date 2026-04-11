'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Send, Music2, ChevronLeft, Mail, Volume2, VolumeX } from 'lucide-react';
import { SlidingPill } from '@/components/ui/SlidingPill';
import { uploadedExploreFeed, uploadedFriendsFeed, type UploadedExplorePost } from '@/lib/data/uploadedCityAssets';
import { colors } from '@/lib/theme/colors';

type ExploreFeedMode = 'friends' | 'explore';
type ExploreViewMode = 'feed' | 'inbox';

const EXPLORE_VIEW_MODE_EVENT = 'echo:explore-view-mode';

type ExplorePost = UploadedExplorePost;

const friendsFeed: ExplorePost[] = uploadedFriendsFeed;
const exploreFeed: ExplorePost[] = uploadedExploreFeed;

const headerControlButtonStyle: React.CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.12))',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(26px) saturate(180%)',
  WebkitBackdropFilter: 'blur(26px) saturate(180%)',
  boxShadow: '0 18px 34px rgba(17, 24, 39, 0.2), inset 0 1px 0 rgba(255,255,255,0.28)',
};

function buildProgressivePreviewSrc(src: string) {
  if (!src.startsWith('/')) return src;

  return `/_next/image?url=${encodeURIComponent(src)}&w=96&q=28`;
}

function ProgressiveExploreImage({
  alt,
  prioritized,
  src,
}: {
  alt: string;
  prioritized: boolean;
  src: string;
}) {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);

  useEffect(() => {
    setIsHighResLoaded(false);
  }, [src]);

  return (
    <>
      <img
        alt=""
        aria-hidden="true"
        decoding="async"
        loading={prioritized ? 'eager' : 'lazy'}
        src={buildProgressivePreviewSrc(src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'blur(18px) saturate(1.08)',
          transform: 'scale(1.04)',
          opacity: isHighResLoaded ? 0 : 1,
          transition: 'opacity 220ms ease',
        }}
      />
      <img
        alt={alt}
        decoding={prioritized ? 'sync' : 'async'}
        fetchPriority={prioritized ? 'high' : 'auto'}
        loading={prioritized ? 'eager' : 'lazy'}
        onLoad={() => setIsHighResLoaded(true)}
        src={src}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isHighResLoaded ? 1 : 0,
          transition: 'opacity 280ms ease',
        }}
      />
    </>
  );
}

const inboxItems = [
  {
    id: 'inbox-1',
    username: '@xavier',
    name: 'Xavier',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=320&q=80',
    preview: 'Echo sent',
    time: 'Now',
    unread: true,
  },
  {
    id: 'inbox-2',
    username: '@alex',
    name: 'Alex',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=320&q=80',
    preview: 'Echo sent',
    time: '18m',
    unread: true,
  },
  {
    id: 'inbox-3',
    username: '@ben',
    name: 'Ben',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&q=80',
    preview: 'Shared Echo with you',
    time: '1h',
    unread: false,
  },
  {
    id: 'inbox-4',
    username: '@daniel',
    name: 'Daniel',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=320&q=80',
    preview: 'if this trace makes me cry on the streetcar, I am billing you',
    time: '3h',
    unread: false,
  },
];

function TabToggle({ activeFeed, onChange }: { activeFeed: ExploreFeedMode; onChange: (next: ExploreFeedMode) => void }) {
  return (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', alignItems: 'center', gap: 2, width: 190, borderRadius: 999, padding: 4, background: `linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.12))`, border: '1px solid rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(26px) saturate(180%)', WebkitBackdropFilter: 'blur(26px) saturate(180%)', boxShadow: '0 18px 34px rgba(17, 24, 39, 0.2), inset 0 1px 0 rgba(255,255,255,0.28)' }}>
      <SlidingPill activeIndex={activeFeed === 'friends' ? 0 : 1} gap={2} inset={4} optionCount={2} style={{ borderRadius: 999 }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 999,
            background: `linear-gradient(180deg, rgba(39, 35, 34, 0.98), ${colors.activePill})`,
            boxShadow: `0 10px 20px ${colors.activePillShadow}, inset 0 1px 0 rgba(255,255,255,0.12)`,
          }}
        />
      </SlidingPill>
      {(['friends', 'explore'] as const).map((item) => {
        const active = item === activeFeed;
        return (
          <button
            key={item}
            onClick={() => onChange(item)}
            style={{
              width: '100%', borderRadius: 999, paddingLeft: 16, paddingRight: 16, paddingTop: 9, paddingBottom: 9, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent',
              border: 'none', cursor: 'pointer',
              boxShadow: 'none',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <span style={{ color: active ? colors.activePillText : 'rgba(240, 244, 252, 0.82)', fontSize: 14, fontWeight: 700, letterSpacing: 0.1 }}>
              {item === 'friends' ? 'Friends' : 'Explore'}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FeedActions({
  accent,
  liked,
  onToggleLike,
}: {
  accent: string;
  liked: boolean;
  onToggleLike: () => void;
}) {
  const overlayIconShadow = 'drop-shadow(0 4px 14px rgba(0, 0, 0, 0.42)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.52))';

  return (
    <div style={{ position: 'absolute', right: 18, bottom: 102, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <button
        type="button"
        aria-label={liked ? 'Unlike post' : 'Like post'}
        onClick={onToggleLike}
        style={{
          width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, background: 'transparent', border: 'none',
          transform: liked ? 'scale(1.04)' : 'scale(1)',
          transition: 'all 0.15s ease', cursor: 'pointer',
        }}
      >
        <Heart
          size={28}
          strokeWidth={2.15}
          color={liked ? '#FF8EA6' : colors.echoMainWhite}
          fill={liked ? '#FF8EA6' : 'none'}
          style={{ filter: overlayIconShadow }}
        />
      </button>
      <button
        type="button"
        aria-label="Comment on post"
        style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <MessageCircle size={27} strokeWidth={2.15} color={colors.echoMainWhite} style={{ filter: overlayIconShadow }} />
      </button>
      <button
        type="button"
        aria-label="Share post"
        style={{ width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <Send size={27} strokeWidth={2.15} color={colors.echoMainWhite} style={{ filter: overlayIconShadow }} />
      </button>
      <div style={{ width: 42, height: 42, borderRadius: 21, background: `linear-gradient(180deg, ${accent}, rgba(255, 255, 255, 0.24))`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 22px rgba(0, 0, 0, 0.24)', border: '1px solid rgba(255, 255, 255, 0.22)' }}>
        <div style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Music2 size={15} color={colors.echoMainWhite} style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.32))' }} />
        </div>
      </div>
    </div>
  );
}

function ExploreFeedCard({
  post,
  height,
  liked,
  onToggleLike,
  onBecomeActive,
  onSoundRejected,
  prioritized,
  soundEnabled,
}: {
  post: ExplorePost;
  height: number;
  liked: boolean;
  onToggleLike: () => void;
  onBecomeActive: (postId: string) => void;
  onSoundRejected: (postId: string) => void;
  prioritized: boolean;
  soundEnabled: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActiveMedia, setIsActiveMedia] = useState(prioritized);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const nextIsActive = entry.isIntersecting && entry.intersectionRatio >= 0.6;

        setIsActiveMedia(post.media.type === 'video' ? nextIsActive : false);

        if (nextIsActive) {
          onBecomeActive(post.id);
        }
      },
      {
        threshold: [0.35, 0.6, 0.85],
      },
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [onBecomeActive, post.id, post.media.type]);

  useEffect(() => {
    if (post.media.type !== 'video') return;

    const video = videoRef.current;

    if (!video) return;

    if (isActiveMedia) {
      video.muted = !soundEnabled;
      video.defaultMuted = !soundEnabled;
      video.volume = soundEnabled ? 1 : 0;
      const playback = video.play();
      playback?.catch(() => {
        if (!soundEnabled) return;

        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
        onSoundRejected(post.id);
        video.play()?.catch(() => undefined);
      });
      return;
    }

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;
    video.pause();
  }, [isActiveMedia, onSoundRejected, post.id, post.media.type, soundEnabled]);

  useEffect(() => {
    if (post.media.type !== 'video') return;
    setIsVideoReady(false);
    setHasVideoError(false);

    const video = videoRef.current;

    if (!video) return;

    video.load();
  }, [post.id, post.media.src, post.media.type]);

  return (
    <div ref={cardRef} style={{ width: '100%', height, backgroundColor: '#120D0A', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      {post.media.type === 'video' ? (
        <>
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(120% 88% at 50% -10%, rgba(255,255,255,0.14), rgba(255,255,255,0) 50%), linear-gradient(180deg, rgba(49,35,28,0.94), rgba(18,13,10,1))',
              opacity: isVideoReady ? 0 : 1,
              transition: 'opacity 220ms ease',
            }}
          />
          <video
            ref={videoRef}
            aria-label={`${post.city} by ${post.handle}`}
            autoPlay={isActiveMedia}
            loop
            muted={!soundEnabled || !isActiveMedia}
            onError={() => setHasVideoError(true)}
            onLoadedData={() => {
              setHasVideoError(false);
              setIsVideoReady(true);
            }}
            playsInline
            poster={post.media.poster}
            preload={prioritized ? 'auto' : 'metadata'}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: isVideoReady ? 1 : 0,
              transition: 'opacity 240ms ease',
            }}
          >
            {(post.media.sources ?? [{ src: post.media.src, type: 'video/mp4' }]).map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
          {hasVideoError && post.image ? (
            <ProgressiveExploreImage alt={post.city} prioritized={prioritized} src={post.image} />
          ) : null}
        </>
      ) : (
        <ProgressiveExploreImage alt={post.city} prioritized={prioritized} src={post.media.src} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(19, 13, 10, 0.20), rgba(19, 13, 10, 0.02) 42%, rgba(19, 13, 10, 0.34))' }} />
      {/* Overlay */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <FeedActions
          accent={post.accent}
          liked={liked}
          onToggleLike={onToggleLike}
        />
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
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 18, paddingRight: 18, paddingTop: 18, paddingBottom: 14, background: `linear-gradient(180deg, rgba(255,255,255,0.98), rgba(250,251,251,0.94))` }}>
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to Explore feed"
          style={{ position: 'absolute', left: 18, top: '50%', width: 32, height: 32, transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, background: 'transparent', border: 'none', boxShadow: 'none', cursor: 'pointer' }}
        >
          <ChevronLeft size={20} color={colors.text} />
        </button>
        <span className="display-title" style={{ color: colors.echoInk, fontSize: 22, fontWeight: 900, letterSpacing: -0.2 }}>Inbox</span>
      </div>
      <div style={{ paddingLeft: 18, paddingRight: 18, paddingTop: 6 }}>
        {inboxItems.map((item) => (
          <button
            key={item.id}
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 14, paddingBottom: 14, borderBottom: `1px solid ${colors.shellBorderSoft}`, width: '100%', minWidth: 0, background: 'none', border: 'none', borderBottomColor: colors.shellBorderSoft, borderBottomWidth: 1, borderBottomStyle: 'solid', cursor: 'pointer' }}
          >
            <Image
              alt={item.name}
              height={54}
              loading="lazy"
              sizes="54px"
              src={item.avatar}
              style={{ width: 54, height: 54, borderRadius: 27, objectFit: 'cover', flexShrink: 0 }}
              width={54}
            />
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'left' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: colors.echoInk, fontSize: 15, fontWeight: item.unread ? 700 : 600 }}>{item.name}</span>
                <span style={{ flexShrink: 0, color: item.unread ? colors.echoInk : colors.textMuted, fontSize: 12, fontWeight: item.unread ? 700 : 600 }}>{item.time}</span>
              </div>
              <span style={{ color: colors.shellAccentText, fontSize: 12, fontWeight: 600 }}>{item.username}</span>
              <span style={{ color: item.unread ? colors.echoInk : colors.textSoft, fontSize: 13, lineHeight: '18px', fontWeight: item.unread ? 700 : 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{item.preview}</span>
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
  const [activePostId, setActivePostId] = useState<string | null>(exploreFeed[0]?.id ?? null);
  const [soundEnabledPostId, setSoundEnabledPostId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const feedData = useMemo(() => (activeFeed === 'friends' ? friendsFeed : exploreFeed), [activeFeed]);
  const activePost = useMemo(
    () => feedData.find((post) => post.id === activePostId) ?? feedData[0] ?? null,
    [activePostId, feedData],
  );
  const postHeight = typeof window !== 'undefined' ? Math.max(window.innerHeight, 640) : 640;

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
    setActivePostId(feedData[0]?.id ?? null);
    setSoundEnabledPostId(null);
  }, [activeFeed]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent<ExploreViewMode>(EXPLORE_VIEW_MODE_EVENT, { detail: viewMode }));
  }, [viewMode]);

  useEffect(() => {
    return () => {
      window.dispatchEvent(new CustomEvent<ExploreViewMode>(EXPLORE_VIEW_MODE_EVENT, { detail: 'feed' }));
    };
  }, []);

  function toggleLike(postId: string) {
    setLikedPostIds((current) => ({ ...current, [postId]: !current[postId] }));
  }

  function toggleActivePostSound() {
    if (!activePost || activePost.media.type !== 'video') return;

    setSoundEnabledPostId((current) => (current === activePost.id ? null : activePost.id));
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
        {feedData.map((post, index) => (
          <div key={post.id} style={{ scrollSnapAlign: 'start', height: postHeight }}>
            <ExploreFeedCard
              height={postHeight}
              liked={Boolean(likedPostIds[post.id])}
              onBecomeActive={setActivePostId}
              onSoundRejected={(postId) => {
                setSoundEnabledPostId((current) => (current === postId ? null : current));
              }}
              onToggleLike={() => toggleLike(post.id)}
              post={post}
              prioritized={index === 0}
              soundEnabled={soundEnabledPostId === post.id}
            />
          </div>
        ))}
      </div>
      {/* Top controls overlay */}
      <div style={{ position: 'absolute', top: 8, left: 0, right: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 14, paddingRight: 14, pointerEvents: 'none' }}>
        {activePost?.media.type === 'video' ? (
          <button
            type="button"
            aria-label={soundEnabledPostId === activePost.id ? 'Mute video audio' : 'Enable video audio'}
            onClick={toggleActivePostSound}
            style={{
              ...headerControlButtonStyle,
              cursor: 'pointer',
              pointerEvents: 'auto',
            }}
          >
            {soundEnabledPostId === activePost.id ? (
              <Volume2 size={20} strokeWidth={2.2} color={colors.echoMainWhite} style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.38))' }} />
            ) : (
              <VolumeX size={20} strokeWidth={2.2} color={colors.echoMainWhite} style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.38))' }} />
            )}
          </button>
        ) : (
          <div style={{ ...headerControlButtonStyle, opacity: 0, pointerEvents: 'none' }} />
        )}
        <div style={{ pointerEvents: 'auto' }}>
          <TabToggle activeFeed={activeFeed} onChange={setActiveFeed} />
        </div>
        <button
          onClick={() => setViewMode('inbox')}
          style={{ ...headerControlButtonStyle, cursor: 'pointer', pointerEvents: 'auto' }}
        >
          <Mail size={20} color={colors.echoMainWhite} />
        </button>
      </div>
    </div>
  );
}
