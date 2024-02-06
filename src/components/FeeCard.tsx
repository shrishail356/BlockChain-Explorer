import { FC, useEffect, useState } from 'react';
import { Transaction } from '../services/explorer.ts';
import BigNumber from 'bignumber.js';

interface FeeCardProps {
  address: string; // Pass the address as a prop
  transactions: Transaction[]; // Pass the list of transactions as a prop
}

const weiToEth = (wei: string): BigNumber => {
  const ethInWei = new BigNumber('1000000000000000000'); // 10^18
  const weiValue = new BigNumber(wei);

  return weiValue.dividedBy(ethInWei);
};

const FeeCard: FC<FeeCardProps> = ({ transactions }) => {
  const [totalFees, setTotalFees] = useState<BigNumber>(new BigNumber(0));
  const [ethereumPrice, setEthereumPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://api.basescan.org/api?module=stats&action=ethprice&apikey=4T9GXFYT4BJNGPATKFBXS27HPIA15ZHPRE');
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
    let calculatedTotalFees = new BigNumber(0);

    transactions.forEach((transaction) => {
      const gasPriceInEth = weiToEth(transaction.gasPrice);
      const gasUsed = new BigNumber(transaction.gasUsed);

      const transactionFee = gasPriceInEth.multipliedBy(gasUsed);
      calculatedTotalFees = calculatedTotalFees.plus(transactionFee);
    });

    setTotalFees(calculatedTotalFees);
  }, [transactions]);

  const usdValue = ethereumPrice !== null ? totalFees.multipliedBy(ethereumPrice) : null;

  return (
    <div className="fee-card p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-8 dark:bg-gray-800 hover:bg-blue-50 transform hover:scale-105 transition">
      <div className="sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
        <div className="w-52 max-w-52 text-center">
          <h3 className="text-l text-gray-900 dark:text-white">Fee Spent</h3>
          <div className="text-center pt-7">
            {usdValue !== null && (
              <div className="text-5xl font-bold text-blue-500 mb-2">
                ${usdValue.toFixed(2)}
              </div>
            )}
            <h3 className="mb-2 font-extrabold text-green-600 text-center">
              {totalFees.toFixed(5)} ETH
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

export default FeeCard;
