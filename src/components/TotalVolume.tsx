import { FC, useEffect, useState } from 'react';
import { Transaction } from '../services/explorer.ts';
import BigNumber from 'bignumber.js';

interface TotalVolumeCardProps {
  transactions: Transaction[];
}

const weiToEth = (wei: string): BigNumber => {
  const ethInWei = new BigNumber('1000000000000000000'); // 10^18
  const weiValue = new BigNumber(wei);

  return weiValue.dividedBy(ethInWei);
};

const TotalVolumeCard: FC<TotalVolumeCardProps> = ({ transactions }) => {
  const [totalVolumeEth, setTotalVolumeEth] = useState<BigNumber>(new BigNumber(0));
  const [ethereumPrice, setEthereumPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://api.basescan.org/api?module=stats&action=ethprice&apikey=JQFD5EQDBXKSUBK3M5BYPUMVPBTSHIKG1C');
        const data = await response.json();

        // Extract live Ethereum price in USD from API response
        const ethUsdPrice = parseFloat(data.result.ethusd);
        setEthereumPrice(ethUsdPrice);

        // Print live Ethereum price to console
        console.log('Live Ethereum Price:', ethUsdPrice);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    let calculatedTotalVolume = new BigNumber(0);

    transactions.forEach((transaction) => {
      const transactionValue = weiToEth(transaction.value);
      calculatedTotalVolume = calculatedTotalVolume.plus(transactionValue);
    });

    setTotalVolumeEth(calculatedTotalVolume);
  }, [transactions]);

  const usdValue = ethereumPrice !== null ? totalVolumeEth.multipliedBy(ethereumPrice) : null;

  const ethValueString = totalVolumeEth.toFixed(5);
  const ethValueLength = ethValueString.replace('.', '').length; // Counting digits excluding decimal point

  const textClass = `mb-2 font-extrabold text-green-600 text-center text-${10 - ethValueLength}`;

  return (
    <div className="total-volume-card p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-9 dark:bg-gray-800 hover:bg-blue-50 transform hover:scale-105 transition">
      <div className="sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
        <div className="w-52 max-w-52 text-center">
          <h3 className="text-l text-gray-900 dark:text-white">Total Volume</h3>
          <div className="text-center pt-7">
            {usdValue !== null && (
              <div className="text-4xl font-bold text-blue-500 mb-2">
                ${usdValue.toFixed(2)}
              </div>
            )}
            <h3 className={textClass}>
              {ethValueString} ETH
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
              all time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalVolumeCard;
