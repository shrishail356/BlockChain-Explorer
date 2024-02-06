import React from 'react';
import Header from '../components/Header.tsx';

const HomePage = () => {
  const [address, setAddress] = React.useState<string>('');
  const handleSubmit = () => {
    if (address === '' || address.length !== 42 || !address.startsWith('0x')) {
      alert('Please enter valid address');
      return;
    }
    window.location.search = '?address=' + address;
  };

  return (
    <>
      <img
        className="w-full h-full object-cover absolute top-0 left-0 w-full h-full "
        src="img/flow.webp"
        alt="Animated Background"
      />
      <Header />
      <div className="grid relative mt-40 place-items-center ">
        <div className="grid relative mt-40 place-items-center ">
          <div className="w-full mt-30 ">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="outline-none block w-full p-4 pl-10 text-sm text-opacity-60 border rounded-lg bg-black bg-opacity-60 dark:border-gray-600 placeholder-white text-white focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search Address"
                required
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
              >
                Search
              </button>
            </div>
          </div>

          <p className="text-gray-900 opacity-80 dark:text-white font-normal text-lg md:text-xl lg:text-2xl text-center mt-20 mx-4 max-w-2xl shadow-md border border-gray-300 rounded-lg p-4">
            BaseTrack is a website where you can track your address and see an overview of your transactions in Base Network.!!!
          </p>
        </div>
      </div>
    </>
  );
};

export default HomePage;