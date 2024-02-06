import { useEffect, useState } from 'react';
import { getTransactionCount } from '../services/explorer.ts';

interface InteractionsCardProps {
  address: string;
}

const InteractionsCard: React.FC<InteractionsCardProps> = ({ address }) => {
  const [transactionCount, setTransactionCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const count = await getTransactionCount(address);
        setTransactionCount(count);
      } catch (error) {
        console.error('Error fetching transaction count:', error);
      }
    }

    fetchData();
  }, [address]);

  return (
    <div className="p-6 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-12 dark:bg-gray-800 hover:transform hover:scale-105 transition">
      <div className="sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
        <div className="w-52 max-w-52 text-center hover:border-blue-300">
          <h3 className="text-l text-gray-400 dark:text-white">Interactions</h3>
          <div className="text-center pt-7">
            <h3 className="mb-2 text-5xl font-extrabold text-blue-600">{transactionCount}</h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">all time</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionsCard;
