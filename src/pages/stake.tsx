import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import Head from 'next/head';
import TextInput from '../components/textinput';
import Link from 'next/link';

const Stake = () => {
  return (
    <div className="relative min-h-screen">
      <Head>
        <title>BeraBaddies - Stake</title>
        <meta name="description" content="Stake your tokens with BeraBaddies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/evil-baddie.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="p-4 flex justify-between items-center">
          <div className="space-x-4">
            <Link href="/" className="text-white text-xl font-bold hover:text-pink-300">
              Claim
            </Link>
            <span className="text-white text-xl">|</span>
            <Link href="/stake" className="text-white text-xl font-bold hover:text-pink-300">
              Stake
            </Link>
          </div>
          <ConnectButton />
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center">
          <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg space-y-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center text-pink-600">Stake $BeraBaddie 🥰🐻</h2>
            <TextInput 
              label="" 
              placeholder="Stake $BeraBaddie" 
              id="stakeAmount" 
              type="text"
            />
            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors">
              Gib 🥺👉👈
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Stake;