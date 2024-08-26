import { useState, useEffect } from 'react';
import Head from 'next/head';
import TextInput from '../components/textinput';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { keccak256, toHex } from 'viem'
import { abi } from '../../abi/MerchNFT.json';
import PinkSpinner from '../components/PinkSpinner';

const PASSWORD = 'berabaddiebabybabbybaliciousberaboken';
const CONTRACT_ADDRESS = '0xfE8CA5C708Daf7e6A321a0573841b61070fAC052';
const EXPLORER_URL = 'https://bartio.beratrail.io/';

const BigBidness = () => {
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSerialNumberAdded, setIsSerialNumberAdded] = useState(false);
  const [isAddingSerialNumber, setIsAddingSerialNumber] = useState(false);
  const [isSerialNumberAdditionPending, setIsSerialNumberAdditionPending] = useState(false);

  const { writeContract: writeAddValidHash, data: addHashData } = useWriteContract();
  const { 
    data: mintHash, 
    isPending: isMintPending, 
    writeContract: writeMint,
    error: mintError 
  } = useWriteContract();

  const { 
    isLoading: isMintConfirming, 
    isSuccess: isMintConfirmed 
  } = useWaitForTransactionReceipt({
    hash: mintHash,
  });

  const { isLoading: isAddHashConfirming, isSuccess: isAddHashConfirmed } = useWaitForTransactionReceipt({
    hash: addHashData,
  });

  const { data: isValidHash, refetch: refetchIsValidHash } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'validHashes',
    args: [keccak256(toHex(serialNumber || ''))],
  });

  const { data: allValidHashes, refetch: refetchAllValidHashes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: abi,
    functionName: 'getAllValidHashes',
  });

  useEffect(() => {
    if (isAddHashConfirmed) {
      refetchIsValidHash();
      setIsAddingSerialNumber(false);
      setIsSerialNumberAdditionPending(false);
    }
  }, [isAddHashConfirmed, refetchIsValidHash]);

  useEffect(() => {
    if (isValidHash) {
      setIsSerialNumberAdded(true);
      setIsAddingSerialNumber(false);
      setIsSerialNumberAdditionPending(false);
    }
  }, [isValidHash]);

  useEffect(() => {
    if (allValidHashes) {
      console.log('All valid hashes:', allValidHashes);
    }
  }, [allValidHashes]);

  useEffect(() => {
    if (mintError) {
      console.error('Minting Error:', mintError);
      if (mintError instanceof Error) {
        setErrorMessage(`Error: ${mintError.message}`);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  }, [mintError]);

  const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleGenerateSerialNumber = () => {
    const generatedSerialNumber = 'SN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setSerialNumber(generatedSerialNumber);
  };

  const addValidHash = async () => {
    if (!serialNumber || isAddingSerialNumber || isSerialNumberAdditionPending) {
      console.log('Serial number addition already in progress or no serial number');
      return;
    }
    const serialNumberHash = keccak256(toHex(serialNumber));
    try {
      setIsAddingSerialNumber(true);
      setIsSerialNumberAdditionPending(true);
      setErrorMessage('');
      await writeAddValidHash({
        address: CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'addValidHash',
        args: [serialNumberHash],
      });
      console.log('Adding serial number:', serialNumber);
      refetchAllValidHashes();
    } catch (error) {
      console.error('Error adding serial number:', error);
      setErrorMessage('Error adding serial number. Please try again.');
      setIsAddingSerialNumber(false);
      setIsSerialNumberAdditionPending(false);
    }
  };

  const handleMint = async () => {
    setErrorMessage('');
    if (!recipientAddress || !serialNumber || !twitterHandle || !telegramHandle) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    if (!isValidHash) {
      setErrorMessage('Please add the serial number first');
      return;
    }
    try {
      console.log('Attempting to mint with params:', {
        to: recipientAddress,
        serialNumber,
        twitterHandle,
        telegramHandle
      });

      await writeMint({
        address: CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'wrapperMint',
        args: [recipientAddress, serialNumber, twitterHandle, telegramHandle],
      });
    } catch (error) {
      console.error('Error during minting process:', error);
      if (error instanceof Error) {
        setErrorMessage(`Error: ${error.message}`);
      } else {
        setErrorMessage('An unknown error occurred');
      }
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 z-0">
          <img
            src="/hoe.gif"
            alt="Hoe gif"
            className="w-full h-full object-cover"
          />
        </div>
        <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded shadow-md z-10">
          <TextInput
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors mt-4">
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <Head>
        <title>BeraBaddies - Big Bidness</title>
        <meta name="description" content="Big Bidness page for BeraBaddies" />
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
        <header className="p-4 flex justify-end items-center">
          <ConnectButton />
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center">
          <div className="bg-white bg-opacity-80 p-8 rounded-lg shadow-lg space-y-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center text-pink-600">Generate Serial Number</h2>
            {!serialNumber && (
              <button onClick={handleGenerateSerialNumber} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors">
                Generate
              </button>
            )}
            {serialNumber && (
              <div>
                <p className="text-center mt-4">Serial number is {serialNumber}, please share to the anon</p>
                <TextInput
                  label="Recipient Address"
                  id="recipientAddress"
                  type="text"
                  value={recipientAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecipientAddress(e.target.value)}
                  placeholder="Enter recipient's address"
                />
                <TextInput
                  label="Twitter Handle"
                  id="twitterHandle"
                  type="text"
                  value={twitterHandle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwitterHandle(e.target.value)}
                  placeholder="Enter your Twitter handle"
                />
                <TextInput
                  label="Telegram Handle"
                  id="telegramHandle"
                  type="text"
                  value={telegramHandle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTelegramHandle(e.target.value)}
                  placeholder="Enter your Telegram handle"
                />
                <button 
                  onClick={addValidHash}
                  disabled={isSerialNumberAdded || isAddingSerialNumber || isSerialNumberAdditionPending}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors mt-4 disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  {isAddingSerialNumber || isSerialNumberAdditionPending ? 'Adding Serial Number...' : isSerialNumberAdded ? 'Serial Number Added' : 'Add Serial Number'}
                </button>
                <button 
                  onClick={handleMint}
                  disabled={!isSerialNumberAdded}
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors mt-4 disabled:bg-pink-300 disabled:cursor-not-allowed"
                >
                  {isMintPending ? 'Confirming...' : isMintConfirming ? 'New Baddie Loading...' : 'Mint'}
                </button>
              </div>
            )}
            {isSerialNumberAdded && (
              <div className="mt-2 text-lg font-bold text-green-600">
                Serial number added! You can mint the NFT now. ✅
              </div>
            )}
            {isMintConfirmed && (
              <div className="mt-2 text-lg font-bold text-green-600">
                Transaction confirmed. ✅
                <br />
                <a 
                  href={`${EXPLORER_URL}/tx/${mintHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:text-pink-600"
                >
                  View on Explorer
                </a>
              </div>
            )}
            {errorMessage && (
              <div className="mt-2 text-sm text-red-600">
                {errorMessage}
              </div>
            )}
          </div>
        </main>
      </div>

      {(isMintPending || isMintConfirming || isAddingSerialNumber || isSerialNumberAdditionPending) && <PinkSpinner />}
    </div>
  );
};

export default BigBidness;