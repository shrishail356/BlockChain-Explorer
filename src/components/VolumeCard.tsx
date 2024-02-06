import { useEffect, useState } from 'react';
import { getEtheriumCount } from '../services/explorer.ts';

interface VolumeCardProps {
  address: string;
}

const VolumeCard: React.FC<VolumeCardProps> = ({ address }) => {
  const [volumecount, setVolumeCount] = useState<number | null>(null);
  const [ethereumPrice, setEthereumPrice] = useState<number | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const count = await getEtheriumCount(address);
        setVolumeCount(count);

        const response = await fetch('https://api.basescan.org/api?module=stats&action=ethprice&apikey=S3XERM7W4MJ4TMF3YJRWC964EU9EQIUGA');
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
  }, [address]);

  const usdValue = volumecount !== null && ethereumPrice !== null ? volumecount * ethereumPrice : null;

  return (
    <div className="volume-card p-9 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-13 dark:bg-gray-800 hover:bg-blue-50 transform hover:scale-105 transition">
      <div className="sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
        <div className="w-52 max-w-52 text-center">
          <h3 className="text-l text-gray-900 dark:text-white">ETH Balance</h3>
          <div className="text-center pt-7">
            {usdValue !== null && (
              <div className="text-5xl font-bold text-center text-blue-500 mb-1">
                ${usdValue.toFixed(2)}
              </div>
            )}
            <h3 className="mb-1 font-extrabold text-green-500 text-center">
              {volumecount?.toFixed(5)} ETH
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

export default VolumeCard;
