import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'wagmi/chains';

const bartio: Chain = {
  id: 80084,
  name: 'Bartio bArtio',
  nativeCurrency: {
    name: 'BERA',
    symbol: 'BERA',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://bartio.rpc.berachain.com/'] }, 
  },
  blockExplorers: {
    default: { name: 'Bartio Explorer', url: 'https://bartio.beratrail.io/' }, 
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [bartio],
  ssr: true,
});