import React, { FC, useState } from 'react';

interface Header1Props {
  hasSearchBar?: boolean;
}

const Header: FC<Header1Props> = ({ hasSearchBar }) => {
  const [address, setAddress] = useState<string>('');

  const handleSubmit = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'Enter') return;
    if (address === '' || address.length !== 42 || !address.startsWith('0x')) {
      alert('Please enter valid address');
      return;
    }
    window.location.search = '?address=' + address;
  };
  return (
    <nav className="z-10 fixed top-0 left-0 w-full">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <a className="flex items-left pl-30" href="https://base-track.shrishail.info/">
          <img src="img/favicon.ico" className="h-8 mr-3" alt="BaseTrack Logo" />
          <span className="self-left text-2xl font-semibold whitespace-nowrap dark:text-white">BaseTrack</span>
        </a>
        {hasSearchBar && (
          <div className="flex md:order-2">
            <div className="relative md:block sm:w-9/12 md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none bg">
                <svg
                  className="w-5 h-5 text-gray-500"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only">Search icon</span>
              </div>
              <input
                type="text"
                id="search-navbar"
                className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search..."
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={handleSubmit}
              />
            </div>
          </div>
        )}
        <div className="items-center justify-between hidden w-full md:flex sm:w-auto" id="navbar-search">
          <div className="relative mt-3 md:hidden">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="search-navbar"
              className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search..."
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;