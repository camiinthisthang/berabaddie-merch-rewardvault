import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import TextInput from '../components/textinput';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { abi } from '../../abi/BeraBaddieToken.json';
import { abi as merchNFTAbi } from '../../abi/MerchNFT.json';
import PinkSpinner from '../components/PinkSpinner';
import { keccak256, toHex } from 'viem';

const CONTRACT_ADDRESS = '0x1B031E6f90C912e4c27a9093312F63a894AECaae';
const EXPLORER_URL = 'https://bartio.beratrail.io/';
const MERCHNFT_ADDRESS = '0xC89c5D177784FF6eB11620cD6Cf21820311FCD7e';

const Home: NextPage = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { address } = useAccount();

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

  const { data: isValidSerial, refetch: refetchIsValidSerial } = useReadContract({
    address: MERCHNFT_ADDRESS,
    abi: merchNFTAbi,
    functionName: 'serialToTokenId',
    args: [keccak256(toHex(serialNumber || ''))],
  });

  const checkSerialNumber = async () => {
    if (!serialNumber) return false;
    console.log('Checking serial number:', serialNumber);
    console.log('Hash:', keccak256(toHex(serialNumber)));
    await refetchIsValidSerial();
    console.log('Is valid serial:', isValidSerial);
    return isValidSerial && BigInt(isValidSerial) !== BigInt(0);
  };

  useEffect(() => {
    if (claimError) {
      console.error('Claim Error:', claimError);
      if (claimError instanceof Error) {
        if (claimError.message.includes('Serial number already claimed')) {
          setErrorMessage('This serial number has already been claimed.');
        } else if (claimError.message.includes('Invalid serial number')) {
          setErrorMessage('Invalid serial number. Please check and try again.');
        } else if (claimError.message.includes('Must own MerchNFT')) {
          setErrorMessage('You must own the MerchNFT with this serial number to claim.');
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
    if (!serialNumber) {
      setErrorMessage('Please enter a serial number');
      return;
    }
    if (!address) {
      setErrorMessage('Please connect your wallet');
      return;
    }
    
    console.log('Checking serial number validity...');
    const isValid = await checkSerialNumber();
    console.log('Serial number is valid:', isValid);
    if (!isValid) {
      setErrorMessage('Invalid serial number. Please check and try again.');
      return;
    }

    try {
      console.log('Attempting to claim with serial number:', serialNumber);
      await writeClaim({
        address: CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'claim',
        args: [serialNumber],
      });
    } catch (error) {
      console.error('Error during claim process:', error);
      if (error instanceof Error) {
        setErrorMessage(`Error: ${error.message}`);
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
            <button 
              onClick={handleClaim}
              disabled={isClaimPending || isClaimConfirming}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed"
            >
              Claim $BeraBaddie🥰
            </button>
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