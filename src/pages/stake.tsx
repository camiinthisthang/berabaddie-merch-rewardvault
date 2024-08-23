import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';
import Head from 'next/head';
import TextInput from '../components/textinput';
import Link from 'next/link';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { abi } from '../../abi/BerachainRewardsVault.json';
import PinkSpinner from '../components/PinkSpinner';

const VAULT_ADDRESS = '0x30218362267600895Dcf6ccCDb7191dE7c01085F';
const EXPLORER_URL = 'https://bartio.beratrail.io/';

const Stake = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { address } = useAccount();

  const { 
    writeContract: writeStake,
    data: stakeHash,
    isPending: isStakePending,
    error: stakeError 
  } = useWriteContract();

  const { 
    isLoading: isStakeConfirming, 
    isSuccess: isStakeConfirmed 
  } = useWaitForTransactionReceipt({
    hash: stakeHash,
  });

  const handleStake = async () => {
    setErrorMessage('');
    if (!stakeAmount) {
      setErrorMessage('Please enter an amount to stake');
      return;
    }
    if (!address) {
      setErrorMessage('Please connect your wallet');
      return;
    }

    try {
      const amount = BigInt(parseFloat(stakeAmount) * 1e18); // Convert to wei
      console.log('Attempting to stake:', amount.toString());
      await writeStake({
        address: VAULT_ADDRESS,
        abi: abi,
        functionName: 'delegateStake',
        args: [address, amount],
      });
    } catch (error) {
      console.error('Error during staking process:', error);
      if (error instanceof Error) {
        setErrorMessage(`Error: ${error.message}`);
      } else {
        setErrorMessage('An unknown error occurred during the staking process');
      }
    }
  };

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
        <source src="/videos/stake.mp4" type="video/mp4" />
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
              value={stakeAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStakeAmount(e.target.value)}
            />
            <button 
              onClick={handleStake}
              disabled={isStakePending || isStakeConfirming}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {isStakePending ? 'Confirming...' : isStakeConfirming ? 'Staking...' : 'Gib 🥺👉👈'}
            </button>
            {errorMessage && (
              <div className="mt-2 text-sm text-red-600">
                {errorMessage}
              </div>
            )}
            {isStakeConfirmed && (
              <div className="mt-2 text-lg font-bold text-green-600">
                Stake confirmed! ✅
                <br />
                <a 
                  href={`${EXPLORER_URL}/tx/${stakeHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600"
                >
                  View on Explorer
                </a>
              </div>
            )}
          </div>
        </main>
      </div>

      {(isStakePending || isStakeConfirming) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-2xl font-bold">
            <PinkSpinner />
            <p className="mt-4">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stake;