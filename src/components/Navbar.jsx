import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { formatPublicKey } from '../utils/helpers';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const location = useLocation();
  const { publicKey, isConnected, connectFreighter, disconnectWallet, isLoading } = useWallet();

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Mint', href: '/mint', current: location.pathname === '/mint' },
    { name: 'Gallery', href: '/gallery', current: location.pathname === '/gallery' },
  ];

  return (
    <Disclosure as="nav" className="bg-slate-800 border-b border-slate-700">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-celestial-blue via-celestial-purple to-stellar-yellow bg-clip-text text-transparent">Celestium</span>
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        item.current
                          ? 'bg-slate-700 text-white'
                          : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                      }`}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                {isConnected ? (
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <Menu.Button className="flex items-center px-4 py-2 border border-celestial-indigo rounded-lg text-sm font-medium text-white bg-celestial-indigo/10 hover:bg-celestial-indigo/20">
                        <span className="sr-only">Open user menu</span>
                        <span>{formatPublicKey(publicKey)}</span>
                      </Menu.Button>
                    </div>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-slate-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${
                                active ? 'bg-slate-700' : ''
                              } block px-4 py-2 text-sm text-white`}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={disconnectWallet}
                              className={`${
                                active ? 'bg-slate-700' : ''
                              } block w-full text-left px-4 py-2 text-sm text-white`}
                            >
                              Disconnect
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <button
                    onClick={connectFreighter}
                    disabled={isLoading}
                    className="btn-primary flex items-center"
                  >
                    {isLoading ? 'Connecting...' : 'Connect Wallet'}
                  </button>
                )}
                <div className="ml-3 sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    item.current
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar; 