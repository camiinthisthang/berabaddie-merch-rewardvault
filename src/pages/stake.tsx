import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import Head from 'next/head';
import TextInput from '../components/TextInput';
import Link from 'next/link';

const Stake = () => {
  return (
    <div className="bg-gradient-to-t from-baddie-dark from-10% via-baddie-deep-purple via-30% to-baddie-purple to-90% min-h-screen">
      <Head>
        <title>BeraBaddies - Stake</title>
        <meta name="description" content="Stake your tokens with BeraBaddies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">BeraBaddies</h1>
          <Link href="/" className="text-baddie-light-pink hover:text-white transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="ml-2">Home</span>
          </Link>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="grid gap-6 mb-6">
              <TextInput label="Amount" placeholder="10" id="amount" type="number" />
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};


export default Stake;