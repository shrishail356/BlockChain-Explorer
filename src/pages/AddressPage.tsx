import { useEffect, useState } from 'react';
import { getTransactionList, Transaction } from '../services/explorer.ts';
import Header from '../components/Header.tsx';
import InteractionsCard from '../components/InteractionsCard.tsx';
import VolumeCard from '../components/VolumeCard.tsx';
import FeeCard from '../components/FeeCard.tsx';
import ActivityCard from '../components/ActivityCard.tsx';
import Last10Transactions from '../components/Last10Transactions.tsx';
import TotalVolume from '../components/TotalVolume.tsx'; // Import the new component

const AddressPage = () => {
  const address = window.location.search.split('=')[1];
  const [transactionList, setTransactionList] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!address || address.length !== 42 || address.slice(0, 2) !== '0x') {
      window.location.search = '';
      return;
    }
    fetchTransactionList();
  }, [address]);

  const fetchTransactionList = async () => {
    const transactions: Transaction[] = await getTransactionList(address);
    setTransactionList(transactions);
  };

  return (
    <>
      <Header hasSearchBar />
      <div className="grid mt-20 place-items-center">
        <div className="grid place-items-center">
          <div className="flex items-center flex-row space-x-5 mt-5">
            <InteractionsCard address={address} />
            <TotalVolume transactions={transactionList} /> {/* Moved Eth balance block here */}
            <FeeCard address={address} transactions={transactionList} />
          </div>
          <div className="flex items-center flex-row space-x-5 mt-1.5">
            <VolumeCard address={address} /> {/* Moved Eth balance block here */}
            <ActivityCard transactions={transactionList} />
          </div>
          <Last10Transactions transactions={transactionList} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-6 mb-10 mt-5 max-w-3xl mx-auto shadow-lg shadow-blue">
  <p className="text-white font-medium text-lg text-center mb-4">Hope you liked my work? Let's connect on Twitter...</p>
  <p className="text-gray-300 dark:text-gray-400 text-center mb-6">If you've found value in my creations, consider showing your support through a donation on <span className="text-blue-500">Debank</span>. Exciting updates are on the way – stay tuned for more!</p>

  <p className="text-center">
    <strong><span className="text-white"></span><img src='img\twitter.png' alt="Twitter" className="w-6 h-6 inline-block" /></strong> : <a href="https://twitter.com/ShrishailMPati3" target="_blank" className="text-blue-500">https://twitter.com/ShrishailMPati3</a>
    <br /><br />
    <strong><span className="text-white"></span><img src='img\debank_1.png' alt="Debank" className="w-6 h-6 inline-block" /></strong> : <a href="https://debank.com/profile/0xb7d4369abfa74aed05d7db358dc3373d787b8997" target="_blank" className="text-blue-500">0xb7d4369abfa74aed05d7db358dc3373d787b8997</a>
  </p>
</div>  
    </>
  );
};

export default AddressPage;



