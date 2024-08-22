import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import TextInput from '../components/textinput';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { abi } from '../../abi/BeraBaddieToken.json';
import PinkSpinner from '../components/PinkSpinner';
import { useReadContract } from 'wagmi';
import { keccak256, toHex } from 'viem';
import { abi as merchNFTAbi } from '../../abi/MerchNFT.json';

const CONTRACT_ADDRESS = '0xBDBbc2FBfE2a74dcf3a26c5C1D45cc76Bc445A37'; // Replace with actual address
const EXPLORER_URL = 'https://bartio.beratrail.io/';
const MERCHNFT_ADDRESS = '0xC89c5D177784FF6eB11620cD6Cf21820311FCD7e';

const Home: NextPage = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [validHashes, setValidHashes] = useState<string[]>([]);

  const { 
    writeContract: writeClaim,
    data: claimHash,
    isPending: isClaimPending,
    error: claimError 
  } = useWriteContract();

  const { 
    isLoading: isClaimConfirming, 
    isSuccess: isClaimConfirmed 
  } = useWaitForTransactionReceipt({
    hash: claimHash,
  });

  const { data: allValidHashes } = useReadContract({
    address: MERCHNFT_ADDRESS,
    abi: merchNFTAbi,
    functionName: 'getAllValidHashes',
  });

  const readValidHashes = async () => {
    setErrorMessage('');
    try {
      console.log('All valid hashes:', allValidHashes);
      if (Array.isArray(allValidHashes)) {
        setValidHashes(allValidHashes);
      }
    } catch (error) {
      console.error('Error reading valid hashes:', error);
      setErrorMessage('Error reading valid hashes');
    }
  };

  useEffect(() => {
    if (claimError) {
      console.error('Claim Error:', claimError);
      if (claimError instanceof Error) {
        if (claimError.message.includes('Invalid serial number')) {
          setErrorMessage('Invalid serial number. Please check and try again.');
        } else {
          setErrorMessage(`Error: ${claimError.message}`);
        }
      } else {
        setErrorMessage('An unknown error occurred during the claim process');
      }
    }
  }, [claimError]);

  const handleClaim = async () => {
    setErrorMessage('');
    if (!serialNumber || !recipientAddress) {
      setErrorMessage('Please enter both serial number and recipient address');
      return;
    }
    try {
      console.log('Attempting to claim with serial number:', serialNumber, 'for recipient:', recipientAddress);
      await writeClaim({
        address: CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'claim',
        args: [serialNumber],
      });
    } catch (error) {
      console.error('Error during claim process:', error);
      if (error instanceof Error) {
        if (error.message.includes('Invalid serial number')) {
          setErrorMessage('Invalid serial number. Please check and try again.');
        } else {
          setErrorMessage(`Error: ${error.message}`);
        }
      } else {
        setErrorMessage('An unknown error occurred during the claim process');
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      <Head>
        <title>BeraBaddies</title>
        <meta name="description" content="A sleek, girly home page for BeraBaddies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
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
            <TextInput 
              label="Serial number" 
              placeholder="HDA76D8S6f7A" 
              id="serialnumber" 
              type="text"
              value={serialNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSerialNumber(e.target.value)}
            />
            <TextInput 
              label="Recipient Address" 
              placeholder="0x..." 
              id="recipientAddress" 
              type="text"
              value={recipientAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipientAddress(e.target.value)}
            />
            <button 
              onClick={handleClaim}
              disabled={isClaimPending || isClaimConfirming}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              Claim $BeraBaddie🥰
            </button>
            {validHashes.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold">Valid Hashes:</h3>
                <ul className="max-h-40 overflow-y-auto">
                  {validHashes.map((hash, index) => (
                    <li key={index} className="text-xs break-all">{hash}</li>
                  ))}
                </ul>
              </div>
            )}
            {errorMessage && (
              <div className="mt-2 text-sm text-red-600">
                {errorMessage}
              </div>
            )}
            {isClaimConfirmed && (
              <div className="mt-2 text-lg font-bold text-green-600">
                Claim confirmed! ✅
                <br />
                <a 
                  href={`${EXPLORER_URL}/tx/${claimHash}`} 
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

      {(isClaimPending || isClaimConfirming) && (
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

export default Home;