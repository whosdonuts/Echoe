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

function TradeDetailSheet({ trade, visible, onClose }: { trade: TradeOffer | null; visible: boolean; onClose: () => void }) {
  if (!trade) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, display: visible ? 'flex' : 'none', flexDirection: 'column', justifyContent: 'flex-end',
        backgroundColor: 'rgba(50, 64, 90, 0.14)', zIndex: 1000, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          maxHeight: '88%', borderTopLeftRadius: 32, borderTopRightRadius: 32,
          background: `linear-gradient(180deg, rgba(255,255,255,0.98), ${colors.shellSurfaceSoft})`, paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 26,
          borderTop: `1px solid ${colors.shellBorderSoft}`, boxShadow: `0 -24px 44px ${colors.shellShadowStrong}, inset 0 1px 0 rgba(255,255,255,0.88)`, display: 'flex', flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: 12 }}>
          <div style={{ width: 46, height: 5, borderRadius: 999, backgroundColor: 'rgba(138, 146, 157, 0.26)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <SocialAvatar name={trade.name} size={52} tone={trade.tone} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Trade proposal</span>
              <span style={{ color: colors.text, fontSize: 24, fontWeight: 700, letterSpacing: -0.4 }}>{trade.name}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 40, height: 40, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(180deg, rgba(255,255,255,0.94), ${colors.shellSurfaceSoft})`, border: `1px solid ${colors.shellBorderSoft}`, boxShadow: `0 12px 20px ${colors.shellShadow}`, cursor: 'pointer' }}
          >
            <X size={20} color={colors.text} />
          </button>
        </div>
        <p style={{ color: colors.textSoft, fontSize: 13, lineHeight: '19px', fontWeight: 500, paddingTop: 10, margin: 0 }}>
          Review the swap in place, then dismiss the sheet to return to the trade list.
        </p>
        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 16 }} className="scrollbar-hide">
          <SocialCard style={{ gap: 16, padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ flex: 1, color: colors.text, fontSize: 24, fontWeight: 700, letterSpacing: -0.5 }}>{trade.setTitle}</span>
              <div style={{ borderRadius: 999, backgroundColor: colors.shellAccentSurface, paddingLeft: 12, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}>
                <span style={{ color: colors.shellAccentText, fontSize: 11, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>{trade.statusLabel}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>You</span>
                <div style={{ width: '100%', minHeight: 142, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 24, paddingLeft: 12, paddingRight: 12, paddingTop: 18, paddingBottom: 18, gap: 6, background: `linear-gradient(180deg, rgba(255,255,255,0.96), ${colors.shellSurfaceMuted})`, border: `1px solid ${colors.shellBorderSoft}` }}>
                  <span style={{ color: colors.text, fontSize: 15, lineHeight: '19px', fontWeight: 700, textAlign: 'center' }}>{trade.yourItem}</span>
                  <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{trade.yourMeta}</span>
                </div>
              </div>
              <div style={{ width: 46, height: 46, borderRadius: 23, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(180deg, rgba(255,255,255,0.94), ${colors.shellSurfaceSoft})`, border: `1px solid ${colors.shellBorderSoft}` }}>
                <ArrowLeftRight size={18} color={colors.shellAccent} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <span style={{ color: colors.textMuted, fontSize: 12, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{trade.name}</span>
                <div style={{ width: '100%', minHeight: 142, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: 24, paddingLeft: 12, paddingRight: 12, paddingTop: 18, paddingBottom: 18, gap: 6, background: `linear-gradient(180deg, ${colors.shellAccentSurface}, rgba(255,255,255,0.92))`, border: `1px solid rgba(95, 125, 165, 0.18)` }}>
                  <span style={{ color: colors.text, fontSize: 15, lineHeight: '19px', fontWeight: 700, textAlign: 'center' }}>{trade.friendItem}</span>
                  <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 600, textAlign: 'center' }}>{trade.friendMeta}</span>
                </div>
              </div>
            </div>
            <button style={{ borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(180deg, ${colors.shellAccent}, ${colors.shellAccentStrong})`, paddingTop: 14, paddingBottom: 14, border: 'none', boxShadow: '0 14px 24px rgba(74, 104, 142, 0.22)', cursor: 'pointer', width: '100%' }}>
              <span style={{ color: colors.echoMainWhite, fontSize: 14, fontWeight: 700, letterSpacing: 0.2 }}>Propose Trade</span>
            </button>
          </SocialCard>
          <SocialCard style={{ gap: 8, padding: 16 }}>
            <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Trade status</span>
            <span style={{ color: colors.text, fontSize: 18, lineHeight: '24px', fontWeight: 700 }}>{trade.statusText}</span>
            <p style={{ color: colors.textSoft, fontSize: 13, lineHeight: '19px', fontWeight: 500, margin: 0 }}>The proposal stays inside Social so you can review details without leaving the current list.</p>
          </SocialCard>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 12 }}>
            <button style={{ flex: 1, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(180deg, rgba(255,255,255,0.94), ${colors.shellSurfaceSoft})`, border: `1px solid ${colors.shellBorderSoft}`, paddingTop: 14, paddingBottom: 14, boxShadow: `0 12px 20px ${colors.shellShadow}`, cursor: 'pointer' }}>
              <span style={{ color: colors.text, fontSize: 13, fontWeight: 700, letterSpacing: 0.2 }}>Cancel Trade</span>
            </button>
            <button style={{ flex: 1, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `linear-gradient(180deg, rgba(255,255,255,0.9), ${colors.shellSurfaceMuted})`, border: `1px solid ${colors.shellBorderSoft}`, paddingTop: 14, paddingBottom: 14, cursor: 'pointer' }}>
              <span style={{ color: colors.textSoft, fontSize: 13, fontWeight: 700, letterSpacing: 0.2 }}>View Profile</span>
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
    <div style={{ width: '100%', height: '100%', backgroundColor: colors.shellCanvas, display: 'flex', flexDirection: 'column' }}>
      {/* Shared header */}
      <div style={{ paddingTop: shellMetrics.topPadding, paddingLeft: shellMetrics.horizontalPadding, paddingRight: shellMetrics.horizontalPadding, paddingBottom: 14, backgroundColor: colors.shellCanvas, borderBottom: `1px solid ${colors.shellBorderSoft}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
              <SocialIconButton icon="mail-outline" onPress={() => setInboxVisible(true)} />
              <SocialIconButton
                accent={friendsView === 'list'}
                icon="person-add-outline"
                onPress={() => setFriendsView((c) => (c === 'home' ? 'list' : 'home'))}
              />
            </div>
            <SocialSegmentedControl activeKey={friendsView} compact onChange={(next) => setFriendsView(next as FriendsView)} options={friendsViewOptions} style={{ alignSelf: 'center' }} />

            {friendsView === 'home' ? (
              <>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 999, background: `linear-gradient(180deg, rgba(255,255,255,0.96), ${colors.shellSurfaceSoft})`, border: `1px solid ${colors.shellBorderSoft}`, boxShadow: `0 14px 24px ${colors.shellShadow}`, paddingLeft: 12, paddingRight: 12, paddingTop: 9, paddingBottom: 9 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.shellAccent }} />
                    <span style={{ color: colors.text, fontSize: 12, fontWeight: 700, letterSpacing: 0.2 }}>5 active now</span>
                  </div>
                </div>
                <SocialCard style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 16, gap: 14 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Live circle</span>
                    <span style={{ color: colors.text, fontSize: 22, fontWeight: 700, letterSpacing: -0.35 }}>Friends currently active</span>
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
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
              <h2 style={{ color: colors.text, fontSize: 30, fontWeight: 700, letterSpacing: -0.6, margin: 0 }}>Leaderboard</h2>
            </div>
            <SocialSegmentedControl activeKey={leaderboardScope} compact onChange={(next) => setLeaderboardScope(next as LeaderboardScope)} options={leaderboardScopeOptions} style={{ alignSelf: 'center' }} />
            <SocialCard style={{ paddingLeft: 16, paddingRight: 16, paddingTop: 16, paddingBottom: 20, gap: 18 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Weekly spotlight</span>
                <span style={{ color: colors.text, fontSize: 22, fontWeight: 700, letterSpacing: -0.35 }}>Top circles this week</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 12, paddingTop: 8 }}>
                {podiumEntries.map((entry) => {
                  const isFirst = entry.rank === 1;
                  return (
                    <div key={entry.id} style={{ flex: isFirst ? 1.15 : 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ minWidth: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, paddingLeft: 8, paddingRight: 8, paddingTop: 5, paddingBottom: 5, backgroundColor: isFirst ? colors.shellAccentSurface : colors.shellSurfaceMuted }}>
                        <span style={{ color: isFirst ? colors.shellAccentText : colors.textSoft, fontSize: 11, fontWeight: 700 }}>{entry.rank}</span>
                      </div>
                      <SocialAvatar name={entry.name} size={isFirst ? 76 : 66} tone={entry.tone} />
                      <span style={{ color: colors.text, fontSize: isFirst ? 14 : 13, lineHeight: '17px', fontWeight: 700, textAlign: 'center' }}>{entry.name}</span>
                      <span style={{ color: isFirst ? colors.shellAccentText : colors.textSoft, fontSize: 11, fontWeight: 700, textAlign: 'center' }}>{entry.points}</span>
                      <div style={{ width: '100%', height: entry.pedestalHeight, borderTopLeftRadius: 24, borderTopRightRadius: 24, background: isFirst ? `linear-gradient(180deg, ${colors.shellAccentSurface}, rgba(95, 125, 165, 0.22))` : `linear-gradient(180deg, ${colors.shellSurfaceMuted}, rgba(223, 230, 240, 0.72))` }} />
                    </div>
                  );
                })}
              </div>
            </SocialCard>
            <SocialCard style={{ padding: 14 }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 12 }}>
                <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.7, textTransform: 'uppercase' }}>Rankings</span>
                <span style={{ color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Updated this week</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', borderRadius: 18, backgroundColor: colors.shellSurfaceMuted, paddingLeft: 12, paddingRight: 12, paddingTop: 10, paddingBottom: 10 }}>
                {['Rank', 'Name', 'Points'].map((label, i) => (
                  <span key={label} style={{ flex: i === 1 ? 1.6 : 0.6, color: colors.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</span>
                ))}
              </div>
              {leaderboardRows.map((row) => (
                <div key={row.rank} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 2, paddingRight: 2, paddingTop: 13, paddingBottom: 13, borderBottom: `1px solid ${colors.shellBorderSoft}` }}>
                  <div style={{ flex: 0.6, display: 'flex', alignItems: 'center' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.shellSurfaceMuted, marginRight: 10 }}>
                      <span style={{ color: colors.textSoft, fontSize: 12, fontWeight: 700 }}>{row.rank}</span>
                    </div>
                  </div>
                  <span style={{ flex: 1.6, color: colors.text, fontSize: 14, fontWeight: 600 }}>{row.name}</span>
                  <span style={{ flex: 0.6, color: row.highlight ? colors.shellAccentText : colors.text, fontSize: 14, fontWeight: row.highlight ? 700 : 600 }}>{row.points}</span>
                </div>
              ))}
            </SocialCard>
          </div>
        )}

        {primaryTab === 'trading' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
              <SocialIconButton icon="mail-outline" onPress={() => setInboxVisible(true)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <div style={{ borderRadius: 999, backgroundColor: colors.shellAccentSurface, paddingLeft: 12, paddingRight: 12, paddingTop: 9, paddingBottom: 9 }}>
                <span style={{ color: colors.shellAccentText, fontSize: 12, fontWeight: 700, letterSpacing: 0.2 }}>{tradeOffers.length} tradeable fragments available</span>
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
