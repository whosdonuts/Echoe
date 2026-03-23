export const echoOrbAssets = {
  coral: '/echo-orbs/orb-coral.png',
  sky: '/echo-orbs/orb-sky.png',
  lilac: '/echo-orbs/orb-lilac.png',
  gold: '/echo-orbs/orb-gold.png',
  mint: '/echo-orbs/orb-mint.png',
  rose: '/echo-orbs/orb-rose.png',
} as const;

export type EchoOrbKey = keyof typeof echoOrbAssets;

export function getEchoOrbAsset(key: EchoOrbKey): string {
  return echoOrbAssets[key];
}
