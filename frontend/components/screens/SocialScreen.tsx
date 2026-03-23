'use client';

import { ReactNode, useMemo, useState } from 'react';
import { ArrowLeftRight, X } from 'lucide-react';
import {
  activeFriends,
  discoverFriends,
  friendActivities,
  inboxItems,
  leaderboardPodium,
  leaderboardRows,
  tradeOffers,
  type TradeOffer,
} from '@/lib/data/socialMock';
import { colors } from '@/lib/theme/colors';
import { shellMetrics } from '@/lib/theme/layout';
import { SocialAvatar } from '@/components/social/SocialAvatar';
import { SocialFriendCard } from '@/components/social/SocialFriendCard';
import { SocialInboxSheet } from '@/components/social/SocialInboxSheet';
import {
  SocialCard,
  SocialIconButton,
  SocialLogoBadge,
  SocialSegmentedControl,
  type SegmentOption,
} from '@/components/social/SocialPrimitives';
import { SocialTradeRow } from '@/components/social/SocialTradeRow';

type PrimaryTab = 'leaderboard' | 'friends' | 'trading';
type FriendsView = 'home' | 'list';
type LeaderboardScope = 'friends' | 'communities';

const primaryOptions: SegmentOption[] = [
  { key: 'leaderboard', label: 'Leaderboard' },
  { key: 'friends', label: 'Friends' },
  { key: 'trading', label: 'Trading' },
];

const friendsViewOptions: SegmentOption[] = [
  { key: 'home', label: 'Activity' },
  { key: 'list', label: 'Friends list' },
];

const leaderboardScopeOptions: SegmentOption[] = [
  { key: 'friends', label: 'Friends' },
  { key: 'communities', label: 'Communities' },
];

function SectionHeader({
  icon,
  title,
  subtitle,
  rightContent,
}: {
  icon: string;
  title: string;
  subtitle: string;
  rightContent?: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <SocialLogoBadge accent={icon !== 'people-outline'} icon={icon} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 2 }}>
          <span style={{ color: colors.echoOliveBronze, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Social</span>
          <h2 style={{ color: colors.text, fontSize: 31, fontWeight: 700, letterSpacing: -0.7, margin: 0, fontFamily: 'Georgia, serif' }}>{title}</h2>
          <p style={{ color: colors.textSoft, fontSize: 13, lineHeight: '19px', fontWeight: 500, margin: 0 }}>{subtitle}</p>
        </div>
      </div>
      {rightContent}
    </div>
  );
}

function TradeDetailSheet({ trade, visible, onClose }: { trade: TradeOffer | null; visible: boolean; onClose: () => void }) {
  if (!trade) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, display: visible ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'flex-end',
        backgroundColor: 'rgba(32, 24, 20, 0.20)', zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxHeight: '88%', borderTopLeftRadius: 32, borderTopRightRadius: 32,
          backgroundColor: colors.echoMainWhite, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 26,
          boxShadow: '0 -8px 26px rgba(86, 33, 13, 0.16)', display: 'flex', flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 12 }}>
          <div style={{ width: 46, height: 5, borderRadius: 999, backgroundColor: '#DDD2C6' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <SocialAvatar name={trade.name} size={52} tone={trade.tone} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ color: colors.echoOliveBronze, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Trade proposal</span>
              <span style={{ color: colors.text, fontSize: 24, fontWeight: 700, letterSpacing: -0.4, fontFamily: 'Georgia, serif' }}>{trade.name}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.echoOffWhiteBackground, border: '1px solid rgba(226, 215, 205, 0.88)', cursor: 'pointer' }}
          >
            <X size={20} color={colors.echoDarkCocoa} />
          </button>
        </div>
        <p style={{ color: colors.textSoft, fontSize: 13, lineHeight: '19px', fontWeight: 500, paddingTop: 10, margin: 0 }}>
          Review the swap in place, then dismiss the sheet to return to the trade list.
        </p>
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 16 }} className="scrollbar-hide">
          <SocialCard style={{ gap: 16, padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ flex: 1, color: colors.text, fontSize: 24, fontWeight: 700, letterSpacing: -0.5, fontFamily: 'Georgia, serif' }}>{trade.setTitle}</span>
              <div style={{ borderRadius: 999, backgroundColor: '#F8E3DA', paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
                <span style={{ color: colors.echoDeepTerracotta, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>{trade.statusLabel}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ color: colors.echoOliveBronze, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>You</span>
                <div style={{ width: '100%', minHeight: 142, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 24, paddingLeft: 12, paddingRight: 12, paddingTop: 18, paddingBottom: 18, gap: 6, backgroundColor: '#F7E4A6' }}>
                  <span style={{ color: colors.echoDarkCocoa, fontSize: 15, lineHeight: '19px', fontWeight: 700, textAlign: 'center' }}>{trade.yourItem}</span>
                  <span style={{ color: colors.echoOliveBronze, fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{trade.yourMeta}</span>
                </div>
              </div>
              <div style={{ width: 46, height: 46, borderRadius: 23, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF8F3', border: '1px solid rgba(226, 215, 205, 0.88)' }}>
                <ArrowLeftRight size={18} color={colors.echoDeepTerracotta} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ color: colors.echoOliveBronze, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{trade.name}</span>
                <div style={{ width: '100%', minHeight: 142, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 24, paddingLeft: 12, paddingRight: 12, paddingTop: 18, paddingBottom: 18, gap: 6, backgroundColor: '#F4DFD7' }}>
                  <span style={{ color: colors.echoDarkCocoa, fontSize: 15, lineHeight: '19px', fontWeight: 700, textAlign: 'center' }}>{trade.friendItem}</span>
                  <span style={{ color: colors.echoOliveBronze, fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{trade.friendMeta}</span>
                </div>
              </div>
            </div>
            <button style={{ borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.echoPrimaryTerracotta, paddingTop: 14, paddingBottom: 14, border: 'none', cursor: 'pointer', width: '100%' }}>
              <span style={{ color: colors.echoMainWhite, fontSize: 14, fontWeight: 700, letterSpacing: 0.2 }}>Propose Trade</span>
            </button>
          </SocialCard>
          <SocialCard style={{ gap: 8, padding: 16 }}>
            <span style={{ color: colors.echoOliveBronze, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Trade status</span>
            <span style={{ color: colors.text, fontSize: 18, lineHeight: '24px', fontWeight: 700 }}>{trade.statusText}</span>
            <p style={{ color: colors.textSoft, fontSize: 13, lineHeight: '19px', fontWeight: 500, margin: 0 }}>The proposal stays inside Social so you can review details without leaving the current list.</p>
          </SocialCard>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
            <button style={{ flex: 1, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.echoMainWhite, border: '1px solid rgba(226, 215, 205, 0.88)', paddingTop: 14, paddingBottom: 14, cursor: 'pointer' }}>
              <span style={{ color: colors.echoDarkCocoa, fontSize: 13, fontWeight: 700, letterSpacing: 0.2 }}>Cancel Trade</span>
            </button>
            <button style={{ flex: 1, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F6F0E8', border: 'none', paddingTop: 14, paddingBottom: 14, cursor: 'pointer' }}>
              <span style={{ color: colors.echoOliveBronze, fontSize: 13, fontWeight: 700, letterSpacing: 0.2 }}>View Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SocialScreen() {
  const [primaryTab, setPrimaryTab] = useState<PrimaryTab>('friends');
  const [friendsView, setFriendsView] = useState<FriendsView>('home');
  const [leaderboardScope, setLeaderboardScope] = useState<LeaderboardScope>('communities');
  const [inboxVisible, setInboxVisible] = useState(false);
  const [selectedTradeId, setSelectedTradeId] = useState<string | null>(null);

  const contentBottomPadding = shellMetrics.contentBottomPadding;

  const podiumEntries = useMemo(() => {
    const first = leaderboardPodium.find((entry) => entry.rank === 1);
    const second = leaderboardPodium.find((entry) => entry.rank === 2);
    const third = leaderboardPodium.find((entry) => entry.rank === 3);
    return [third, first, second].filter(Boolean) as typeof leaderboardPodium;
  }, []);

  const selectedTrade = useMemo(() => tradeOffers.find((offer) => offer.id === selectedTradeId) ?? null, [selectedTradeId]);

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: colors.echoOffWhiteBackground, display: 'flex', flexDirection: 'column' }}>
      {/* Shared header */}
      <div style={{ paddingTop: shellMetrics.topPadding, paddingLeft: shellMetrics.horizontalPadding, paddingRight: shellMetrics.horizontalPadding, paddingBottom: 14, backgroundColor: colors.echoOffWhiteBackground, borderBottom: '1px solid rgba(226, 215, 205, 0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 368 }}>
          <SocialSegmentedControl activeKey={primaryTab} fullWidth onChange={(next) => setPrimaryTab(next as PrimaryTab)} options={primaryOptions} />
        </div>
      </div>

      {/* Scrollable content */}
      <div
        style={{ flex: 1, overflowY: 'auto', paddingTop: 22, paddingLeft: shellMetrics.horizontalPadding, paddingRight: shellMetrics.horizontalPadding, paddingBottom: contentBottomPadding, display: 'flex', flexDirection: 'column', gap: 24 }}
        className="scrollbar-hide"
      >
        {primaryTab === 'friends' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SectionHeader
              icon="people-outline"
              subtitle="Keep close activity, discovery, and trading circles in one place."
              title="Friends"
              rightContent={
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <SocialIconButton icon="mail-outline" onPress={() => setInboxVisible(true)} />
                  <SocialIconButton
                    accent={friendsView === 'list'}
                    icon="person-add-outline"
                    onPress={() => setFriendsView((c) => (c === 'home' ? 'list' : 'home'))}
                  />
                </div>
              }
            />
            <SocialSegmentedControl activeKey={friendsView} compact onChange={(next) => setFriendsView(next as FriendsView)} options={friendsViewOptions} style={{ alignSelf: 'flex-start' }} />

            {friendsView === 'home' ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 999, backgroundColor: '#FFFFFF', border: '1px solid rgba(226, 215, 205, 0.88)', paddingLeft: 12, paddingRight: 12, paddingTop: 9, paddingBottom: 9 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sage }} />
                    <span style={{ color: colors.echoDarkCocoa, fontSize: 12, fontWeight: 700, letterSpacing: 0.2 }}>5 active now</span>
                  </div>
                </div>
                <SocialCard style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 16, gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ color: colors.echoOliveBronze, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Live circle</span>
                    <span style={{ color: colors.text, fontSize: 22, fontWeight: 700, letterSpacing: -0.35, fontFamily: 'Georgia, serif' }}>Friends currently active</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'row', gap: 14, overflowX: 'auto', paddingRight: 8 }} className="scrollbar-hide">
                    {activeFriends.map((friend) => (
                      <div key={friend.id} style={{ width: 76, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <SocialAvatar active={friend.active} name={friend.name} tone={friend.tone} />
                        <span style={{ width: '100%', color: colors.textSoft, fontSize: 12, fontWeight: 600, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {friend.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </SocialCard>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {friendActivities.map((activity) => (
                    <SocialFriendCard
                      active={activity.active}
                      badgeLabel={activity.badgeLabel}
                      badgeTone={activity.badgeTone}
                      key={activity.id}
                      name={activity.name}
                      summary={activity.summary}
                      time={activity.time}
                      tone={activity.tone}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ color: colors.echoOliveBronze, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Friends list</span>
                  <h3 style={{ color: colors.text, fontSize: 24, fontWeight: 700, letterSpacing: -0.45, margin: 0, fontFamily: 'Georgia, serif' }}>Your Social circle</h3>
                  <p style={{ color: colors.textSoft, fontSize: 13, lineHeight: '19px', fontWeight: 500, margin: 0 }}>A clean overview of everyone you collect, trade, and stay active with.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                  {discoverFriends.map((friend) => (
                    <SocialCard key={friend.id} style={{ alignItems: 'center', justifyContent: 'center', gap: 12, minHeight: 138, paddingLeft: 10, paddingRight: 10, paddingTop: 16, paddingBottom: 16, minWidth: 100, flex: 1 }}>
                      <SocialAvatar name={friend.name} size={64} tone={friend.tone} />
                      <span style={{ color: colors.text, fontSize: 13, lineHeight: '18px', fontWeight: 700, textAlign: 'center', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{friend.name}</span>
                    </SocialCard>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {primaryTab === 'leaderboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SectionHeader
              icon="trophy-outline"
              subtitle="Community points reflect traded fragments, shared echoes, and active replies."
              title="Leaderboard"
            />
            <SocialSegmentedControl activeKey={leaderboardScope} compact onChange={(next) => setLeaderboardScope(next as LeaderboardScope)} options={leaderboardScopeOptions} style={{ alignSelf: 'flex-start' }} />
            <SocialCard style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 20, gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ color: colors.echoOliveBronze, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Weekly spotlight</span>
                <span style={{ color: colors.text, fontSize: 22, fontWeight: 700, letterSpacing: -0.35, fontFamily: 'Georgia, serif' }}>Top circles this week</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 12, paddingTop: 8 }}>
                {podiumEntries.map((entry) => {
                  const isFirst = entry.rank === 1;
                  return (
                    <div key={entry.id} style={{ flex: isFirst ? 1.15 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ minWidth: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, paddingLeft: 8, paddingRight: 8, paddingTop: 5, paddingBottom: 5, backgroundColor: isFirst ? '#F8E3DA' : '#F7F2EB' }}>
                        <span style={{ color: isFirst ? colors.echoDeepTerracotta : colors.echoOliveBronze, fontSize: 11, fontWeight: 700 }}>{entry.rank}</span>
                      </div>
                      <SocialAvatar name={entry.name} size={isFirst ? 76 : 66} tone={entry.tone} />
                      <span style={{ color: colors.text, fontSize: isFirst ? 14 : 13, lineHeight: '17px', fontWeight: 700, textAlign: 'center' }}>{entry.name}</span>
                      <span style={{ color: isFirst ? colors.echoDeepTerracotta : colors.echoOliveBronze, fontSize: 11, fontWeight: 700, textAlign: 'center' }}>{entry.points}</span>
                      <div style={{ width: '100%', height: entry.pedestalHeight, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: isFirst ? '#F2D5C8' : '#F6EAE0' }} />
                    </div>
                  );
                })}
              </div>
            </SocialCard>
            <SocialCard style={{ padding: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 12 }}>
                <span style={{ color: colors.echoOliveBronze, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Rankings</span>
                <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Updated this week</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: 18, backgroundColor: '#FBF6F0', paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10 }}>
                {['Rank', 'Name', 'Points'].map((label, i) => (
                  <span key={label} style={{ flex: i === 1 ? 1.6 : 0.6, color: colors.echoOliveBronze, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</span>
                ))}
              </div>
              {leaderboardRows.map((row) => (
                <div key={row.rank} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 2, paddingRight: 2, paddingTop: 13, paddingBottom: 13, borderBottom: '1px solid rgba(239, 230, 220, 0.88)' }}>
                  <div style={{ flex: 0.6, display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F7F2EB', marginRight: 10 }}>
                      <span style={{ color: colors.echoOliveBronze, fontSize: 12, fontWeight: 700 }}>{row.rank}</span>
                    </div>
                  </div>
                  <span style={{ flex: 1.6, color: colors.text, fontSize: 14, fontWeight: 600 }}>{row.name}</span>
                  <span style={{ flex: 0.6, color: row.highlight ? colors.echoDeepTerracotta : colors.text, fontSize: 14, fontWeight: row.highlight ? 700 : 600 }}>{row.points}</span>
                </div>
              ))}
            </SocialCard>
          </div>
        )}

        {primaryTab === 'trading' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <SectionHeader
              icon="swap-horizontal"
              subtitle="Open a trade opportunity from the list below and review the full proposal without leaving this screen."
              title="Trading"
              rightContent={
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <SocialIconButton icon="mail-outline" onPress={() => setInboxVisible(true)} />
                </div>
              }
            />
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div style={{ borderRadius: 999, backgroundColor: '#F8E3DA', paddingLeft: 12, paddingRight: 12, paddingTop: 9, paddingBottom: 9 }}>
                <span style={{ color: colors.echoDeepTerracotta, fontSize: 12, fontWeight: 700, letterSpacing: 0.2 }}>{tradeOffers.length} tradeable fragments available</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {tradeOffers.map((offer) => (
                <SocialTradeRow emphasized={offer.emphasized} info={offer.info} key={offer.id} name={offer.name} onPress={() => setSelectedTradeId(offer.id)} tone={offer.tone} />
              ))}
            </div>
          </div>
        )}
      </div>

      <SocialInboxSheet items={inboxItems} onClose={() => setInboxVisible(false)} visible={inboxVisible} />
      <TradeDetailSheet onClose={() => setSelectedTradeId(null)} trade={selectedTrade} visible={selectedTrade !== null} />
    </div>
  );
}
