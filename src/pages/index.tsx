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

const CONTRACT_ADDRESS = '0x1a8D9CE295485310130A4ec41029eDe6a00Fdc8A';
const EXPLORER_URL = 'https://bartio.beratrail.io/';
const MERCHNFT_ADDRESS = '0xfE8CA5C708Daf7e6A321a0573841b61070fAC052';

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
    const serialHash = keccak256(toHex(serialNumber));
    console.log('Hash:', serialHash);
    await refetchIsValidSerial();
    console.log('Token ID:', isValidSerial);
    return isValidSerial && BigInt(isValidSerial) !== BigInt(0);
  };

  const [isWaitingForWallet, setIsWaitingForWallet] = useState(false);

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
        } else if (claimError.message.includes('Insufficient balance in contract')) {
          setErrorMessage('The contract does not have enough tokens to fulfill this claim. Please contact support.');
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
    setIsWaitingForWallet(true);
    if (!serialNumber) {
      setErrorMessage('Please enter a serial number');
      setIsWaitingForWallet(false);
      return;
    }
    if (!address) {
      setErrorMessage('Please connect your wallet');
      setIsWaitingForWallet(false);
      return;
    }
    
    console.log('Checking serial number validity...');
    const isValid = await checkSerialNumber();
    console.log('Serial number is valid:', isValid);
    if (!isValid) {
      setErrorMessage('Invalid serial number. Please check and try again.');
      setIsWaitingForWallet(false);
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
      if (error instanceof Error && 
          !error.message.includes('User rejected') && 
          !error.message.includes('User denied')) {
        setErrorMessage(`Error: ${error.message}`);
      }
    } finally {
      setIsWaitingForWallet(false);
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

      {(isClaimPending || isClaimConfirming || isWaitingForWallet) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <PinkSpinner />
            <p className="mt-4 text-pink-500 font-bold">
              {isWaitingForWallet ? 'Waiting for wallet interaction...' : 'Processing claim...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;