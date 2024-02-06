import React, { useEffect, useState } from 'react';
import { Transaction } from '../services/explorer.ts';
import BigNumber from 'bignumber.js';
import axios from 'axios';

interface Last10TransactionsProps {
  transactions: Transaction[];
}

const weiToEth = (wei: string): BigNumber => {
  const ethInWei = new BigNumber('1000000000000000000');
  const weiValue = new BigNumber(wei);

  return weiValue.dividedBy(ethInWei);
};

const shortenAddress = (address: string): string => {
  const prefix = address.slice(0, 18);
  return `${prefix}...`;
};

const Last10Transactions: React.FC<Last10TransactionsProps> = ({ transactions }) => {
  const [currentDate, setCurrentDate] = useState<number | null>(null);
  const [ethToUsdt, setEthToUsdt] = useState<number | null>(null);
  const [displayInUsdt, setDisplayInUsdt] = useState<boolean>(false);
  const [displayAgeAsTimestamp, setDisplayAgeAsTimestamp] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentDate = async () => {
      try {
        const response = await axios.get('http://worldtimeapi.org/api/timezone/Asia/Kolkata');
        setCurrentDate(response.data.unixtime * 1000); // Convert to milliseconds
      } catch (error) {
        console.error('Error fetching current date:', error);
      }
    };

    fetchCurrentDate();
  }, []);

  useEffect(() => {
    const fetchEthToUsdt = async () => {
      try {
        const response = await axios.get('https://api.basescan.org/api?module=stats&action=ethprice&apikey=T2UVYXKVQQFSF5F332FRQ5TAZY9DNS3D8P');
        setEthToUsdt(parseFloat(response.data.result.ethusd));
      } catch (error) {
        console.error('Error fetching ETH to USDT value:', error);
      }
    };

    fetchEthToUsdt();
  }, []);

  const calculateTimeAgo = (timestamp: number): string => {
    if (!currentDate) {
      return '';
    }

    const millisecondsAgo = currentDate - timestamp;
    const secondsAgo = millisecondsAgo / 1000;
    const minutesAgo = secondsAgo / 60;
    const hoursAgo = minutesAgo / 60;

    if (displayAgeAsTimestamp) {
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    } else if (hoursAgo < 1) {
      const minutes = Math.floor(minutesAgo);
      return `${minutes} min ago`;
    } else if (hoursAgo < 24) {
      const hours = Math.floor(hoursAgo);
      const minutes = Math.floor((hoursAgo - hours) * 60);
      return `${hours} hr ${minutes} min ago`;
    } else {
      const days = Math.floor(millisecondsAgo / (1000 * 60 * 60 * 24));
      const hours = Math.floor((millisecondsAgo % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `${days} days ${hours} hrs ago`;
    }
  };

  const toggleDisplay = () => {
    setDisplayInUsdt(!displayInUsdt);
  };

  const toggleDisplayAge = () => {
    setDisplayAgeAsTimestamp(!displayAgeAsTimestamp);
  };

  const last10Transactions = transactions.slice(-10).reverse(); // Get the last 10 transactions and reverse the order

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Latest Transactions</h2>
      <table className="w-full table-auto">
        <thead>
          <tr className="text-white font-bold text-sm bg-gray-900 dark:bg-gray-700">
            <th className="py-2 px-20 text-left">From</th>
            <th className="py-2 px-20 text-left">To</th>
            <th className="py-2 px-20 text-left">
              Value{' '}
              <button onClick={toggleDisplay} className="ml-2 focus:outline-none">
                {displayInUsdt ? (
                  <img src="img/dollor_green.png" alt="USD" className="w-4.5 h-6 mr-1 inline-block" />
                ) : (
                  <img src="/img/Ethereum.svg" alt="ETH" className="w-7.5 h-9 mr-1 inline-block" />
                )}
              </button>
            </th>
            <th className="py-2 px-20 text-center">
              Fees{' '}
              <button onClick={toggleDisplay} className="ml-2 focus:outline-none">
                {displayInUsdt ? (
                  <img src="/img/dollor_green.png" alt="USD" className="w-4.5 h-6 mr-1 inline-block" />
                ) : (
                  <img src="/img/Ethereum.svg" alt="ETH" className="w-7.5 h-9 mr-1 inline-block" />
                )}
              </button>
            </th>
              <th className="py-2 px-20 text-left">
      <         div className="flex items-center">
                  <button
                    onClick={toggleDisplayAge}
                    className={`focus:outline-none rounded-full px-4 py-1 text-white ${
                      displayAgeAsTimestamp ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  >
                    {displayAgeAsTimestamp ? 'Timestamp' : 'Age'}
                  </button>
                </div>
              </th>
          </tr>
        </thead>
        <tbody>
          {last10Transactions.map((transaction, index) => (
            <tr
              key={index}
              className={`border-b border-gray-200 dark:border-gray-700 ${index % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
            >
              <td className="py-3 px-4 text-white" title={transaction.from}>
                {shortenAddress(transaction.from)}
              </td>
              <td className="py-3 px-4 text-white" title={transaction.to}>
                {shortenAddress(transaction.to)}
              </td>
              <td className="py-3 px-4 text-white">
                {displayInUsdt ? `$${parseFloat(weiToEth(transaction.value).multipliedBy(ethToUsdt || 0).toFixed(4))} USDT` : `${parseFloat(weiToEth(transaction.value).toFixed(8))} ETH`}
              </td>
              <td className="py-3 px-4 text-white">
                {displayInUsdt ? `$${weiToEth(transaction.gasPrice).multipliedBy(transaction.gasUsed).multipliedBy(ethToUsdt || 0).toFixed(4)} USDT` : `${weiToEth(transaction.gasPrice).multipliedBy(transaction.gasUsed).toFixed(10)} ETH`}
              </td>
              <td className="py-3 px-4 text-white">{calculateTimeAgo(parseInt(transaction.timeStamp) * 1000)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
   
};

export default Last10Transactions;