import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import TextInput from '../components/textinput';

const Home: NextPage = () => {
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
            />
            <TextInput 
              label="Email" 
              placeholder="bera@baddie.com" 
              id="email" 
              type="text"
            />
            <TextInput 
              label="Telegram" 
              placeholder="baddielicious" 
              id="telegram" 
              type="text"
            />
            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full transition-colors">
              Claim $BeraBaddie🥰
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;