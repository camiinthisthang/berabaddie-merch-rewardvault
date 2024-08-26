import { ConnectButton } from '@rainbow-me/rainbowkit';
import React, { useState } from 'react';
import Head from 'next/head';
import TextInput from '../components/textinput';
import Link from 'next/link';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { abi as vaultAbi } from "../../abi/BerachainRewardsVault.json";
import { abi as tokenAbi } from "../../abi/BeraBaddieToken.json";
import PinkSpinner from '../components/PinkSpinner';
import { parseEther } from 'viem';

const VAULT_ADDRESS = '0x30218362267600895Dcf6ccCDb7191dE7c01085F';
const STAKE_TOKEN_ADDRESS = '0x1a8D9CE295485310130A4ec41029eDe6a00Fdc8A';
const EXPLORER_URL = 'https://bartio.beratrail.io/';

const SuccessPopup: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
        <svg className="w-16 h-16 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <p className="text-pink-500 font-bold text-xl">Staking Successful! 🎉</p>
        <p className="mt-2 text-gray-600">Your Baddie is now staked 🥰</p>
      </div>
    </div>
  );
};

const Stake = () => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { address } = useAccount();

  const { writeContract: writeApprove } = useWriteContract();
  const { writeContract: writeStake } = useWriteContract();

  const handleStakeProcess = async () => {
    setErrorMessage('');
    setIsProcessing(true);
    setIsSuccess(false);

    if (!stakeAmount) {
      setErrorMessage('Please enter an amount to stake');
      setIsProcessing(false);
      return;
    }
    if (!address) {
      setErrorMessage('Please connect your wallet');
      setIsProcessing(false);
      return;
    }

    try {
      const amount = parseEther(stakeAmount);

      // Step 1: Approve
      console.log('Initiating approval...');
      await writeApprove({
        address: STAKE_TOKEN_ADDRESS,
        abi: tokenAbi,
        functionName: 'approve',
        args: [VAULT_ADDRESS, amount],
      });

      console.log('Approval transaction sent');

      // Wait for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('Proceeding to stake after delay');

      // Step 2: Stake
      console.log('Initiating stake...');
      await writeStake({
        address: VAULT_ADDRESS,
        abi: vaultAbi,
        functionName: 'stake',
        args: [amount],
      });

      console.log('Stake transaction sent');

      // Wait for 3 seconds
      await new Promise(resolve => setTimeout(resolve, 3000));

      console.log('Staking process completed');
      setIsSuccess(true);
      // Show success popup for 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);

    } catch (error) {
      console.error('Error during approval/staking process:', error);
      if (error instanceof Error) {
        setErrorMessage(`Error: ${error.message}`);
      } else {
        setErrorMessage('An unknown error occurred during the approval/staking process');
      }
    } finally {
      setIsProcessing(false);
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
              onClick={handleStakeProcess}
              disabled={isProcessing}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Gib 🥺👉👈'}
            </button>
            {errorMessage && (
              <div className="mt-2 text-sm text-red-600">
                {errorMessage}
              </div>
            )}
          </div>
        </main>
      </div>

      {isProcessing && <PinkSpinner />}
      {isSuccess && <SuccessPopup />}
    </div>
  );
};

export default Stake;