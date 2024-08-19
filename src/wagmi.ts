import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { Chain } from 'wagmi/chains';

// Define the Bartio Testnet Chain
const bartio: Chain = {
  id: 80084, // Replace with the actual chain ID for Bartio
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

// Configure RainbowKit with Bartio as the default network
export const config = getDefaultConfig({
  appName: 'RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [bartio], // Only include Bartio in the list of chains
  ssr: true,
});