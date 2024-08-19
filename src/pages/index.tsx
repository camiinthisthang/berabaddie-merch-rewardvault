import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import TextInput from '../components/textinput';
import Link from 'next/link'

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}
const navigation = [
  { name: 'Home', href: '#', current: true },
  { name: 'Stake', href: '/stake', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Home: NextPage = () => {
  return (
    <div className="bg-girly-gradient min-h-screen">
      <Head>
        <title>BeraBaddies</title>
        <meta name="description" content="A sleek, girly home page for BeraBaddies" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-md">
        <nav className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-gray-800">BeraBaddies</h1>
          <div className="space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current
                    ? 'text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-gray-600 hover:text-indigo-500',
                  'text-lg font-semibold'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <main className="py-12">
        <div className="mx-auto max-w-lg px-4 py-8 bg-white shadow-lg rounded-lg">
          <div className="text-center mb-8">
            <ConnectButton />
          </div>
          <div className="space-y-6">
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
          </div>
        </div>
      </main>
    </div>
  );
};


export default Home;
