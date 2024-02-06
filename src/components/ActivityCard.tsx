import { FC, useEffect, useState } from 'react';
import { Transaction } from '../services/explorer.ts';

interface ActivityCardProps {
  transactions: Transaction[] | [];
}

const ActivityCard: FC<ActivityCardProps> = ({ transactions }) => {
  const [uniqueDays, setUniqueDays] = useState<number>(0);
  const [activeWeeks, setActiveWeeks] = useState<number>(0);
  const [activeMonths, setActiveMonths] = useState<number>(0);
  const [daysSinceLastActivity, setDaysSinceLastActivity] = useState<number>(0);
  const [lastActivityTimestamp, setLastActivityTimestamp] = useState<number>(0);

  useEffect(() => {
    if (transactions.length > 0) {
      const uniqueDaysSet = new Set<number>();
      transactions.forEach(transaction => {
        const transactionTimestamp = parseInt(transaction.timeStamp) * 1000;
        const transactionDate = new Date(transactionTimestamp);
        uniqueDaysSet.add(
          new Date(
            transactionDate.getFullYear(),
            transactionDate.getMonth(),
            transactionDate.getDate()
          ).getTime()
        );
      });
      setUniqueDays(uniqueDaysSet.size);

      const currentDate = new Date();
      const millisecondsInWeek = 7 * 24 * 60 * 60 * 1000;
      const millisecondsInMonth = 30 * 24 * 60 * 60 * 1000;

      const firstTransactionDate = new Date(
        parseInt(transactions[0].timeStamp) * 1000
      );
      const weeksDiff = Math.floor(
        (currentDate.getTime() - firstTransactionDate.getTime()) /
          millisecondsInWeek
      );
      const monthsDiff = Math.floor(
        (currentDate.getTime() - firstTransactionDate.getTime()) /
          millisecondsInMonth
      );

      setActiveWeeks(weeksDiff);
      setActiveMonths(monthsDiff);

      const lastTransactionDate = new Date(
        parseInt(transactions[transactions.length - 1].timeStamp) * 1000
      );
      const daysDiff = Math.floor(
        (currentDate.getTime() - lastTransactionDate.getTime()) /
          (24 * 60 * 60 * 1000)
      );
      setDaysSinceLastActivity(daysDiff);
      setLastActivityTimestamp(lastTransactionDate.getTime());
    }
  }, [transactions]);

  return (
    <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800 h-[245px]">
      <div className="block sm:space-x-4 xl:space-x-0 2xl:space-x-4 w-[347px]">
        <ul className="max-w-md divide-y divide-gray-200 dark:divide-gray-700">
          <li className="pb-3 sm:pb-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  <span className="relative inline-block text-blue-500 cursor-pointer">
                    <i className="fas fa-info-circle text-sm absolute -top-2 right-0"></i>
                    <span className="absolute left-1/2 transform -translate-x-1/2 bottom-full -mb-1 bg-gray-900 text-white px-2 py-1 rounded-lg opacity-0 pointer-events-none transition-opacity duration-300">
                      {new Date(lastActivityTimestamp).toLocaleString()}
                    </span>
                  </span>
                  <span className="inline-flex items-center text-base font-semibold dark:text-white">
                    Last Activity
                  </span>
                </p>
              </div>
              <div className={`inline-flex items-center text-base font-semibold ${daysSinceLastActivity <= 7 ? 'text-green-500' : 'text-red-500'} dark:text-red`}>
                {daysSinceLastActivity > 0
                  ? `${daysSinceLastActivity} days ago`
                  : 'Today'}
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  Active day(s)
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {uniqueDays} {uniqueDays === 1 ? 'day' : 'days'}
              </div>
            </div>
          </li>
          <li className="py-3 sm:py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  Active week(s)
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {activeWeeks} {activeWeeks === 1 ? 'week' : 'weeks'}
              </div>
            </div>
          </li>
          <li className="pt-3 pb-0 sm:pt-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                  Active month(s)
                </p>
              </div>
              <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                {activeMonths} {activeMonths === 1 ? 'month' : 'months'}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ActivityCard;
