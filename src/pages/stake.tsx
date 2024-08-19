import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import TextInput from '../components/textinput';

const Stake: NextPage = () => {
  return (
    <div className={styles.container}>
              <div className="py-10 bg-gradient-to-t from-baddie-dark from-10% via-baddie-deep-purple via-30% to-baddie-purple to-90%">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-white">BeraBaddies</h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <TextInput label="Amount" placeholder="10" id="amount" type="number"/>
            </div>
          </main>
        </div>

    </div>
  )
}

export default Stake;