import axios, { AxiosResponse } from 'axios';

export interface Transaction_count{
  result: number;
}

export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
}

export const getTransactionCount = async (address: string): Promise<number> => {
  try {
    const response = await axios.get(`https://api.basescan.org/api?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=RBJ3C8FN7GY1WQRAHDBRM7HXH64J8TC5X1`);
    const hexTransactionCount = response.data.result;

    // Parse the hexadecimal string to a number
    const parsedCount = parseInt(hexTransactionCount, 16);

    if (isNaN(parsedCount)) {
      console.error('Invalid transaction count:', hexTransactionCount);
      throw new Error('Invalid transaction count');
    }

    return parsedCount;
  } catch (error) {
    console.error('Error fetching transaction count:', error);
    throw error;
  }
};


export const getEtheriumCount = async (address: string): Promise<number> => {
  try {
    const response = await axios.get(`https://api.basescan.org/api?module=account&action=balance&address=${address}&tag=latest&apikey=J234YCPQZINJUI33P3FHY67IYCNZ9UD9JQ`);
    const weiEtheriumCount = response.data.result;

    // Convert the string wei value to a number
    const wei = parseFloat(weiEtheriumCount);
    
    // Convert wei to ether using the appropriate conversion factor
    const ether = wei * 1e-18;

    if (isNaN(ether)) {
      console.error('Invalid Ethereum count:', weiEtheriumCount);
      throw new Error('Invalid Ethereum count');
    }

    return ether;
  } catch (error) {
    console.error('Error fetching Ethereum count:', error);
    throw error;
  }
};


export const getTransactionList = async (address: string): Promise<Transaction[]> => {
  const apiUrl = `https://api.basescan.org/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&sort=asc&apikey=EYZ2A7TF2EQW3KTDAZN4XIIBTCSGB23AWF`; // Replace with the actual API URL

  try {
    const response: AxiosResponse = await axios.get(apiUrl);
    if (response.status === 200) {
      const data = response.data;
      //console.log(response.data.result)
      const transactions: Transaction[] = data.result.map((transaction: any) => ({
        blockNumber: transaction.blockNumber,
        timeStamp: transaction.timeStamp,
        hash: transaction.hash,
        nonce: transaction.nonce,
        blockHash: transaction.blockHash,
        transactionIndex: transaction.transactionIndex,
        from: transaction.from,
        to: transaction.to,
        value: transaction.value,
        gas: transaction.gas,
        gasPrice: transaction.gasPrice,
        isError: transaction.isError,
        txreceipt_status: transaction.txreceipt_status,
        input: transaction.input,
        contractAddress: transaction.contractAddress,
        cumulativeGasUsed: transaction.cumulativeGasUsed,
        gasUsed: transaction.gasUsed,
        confirmations: transaction.confirmations,
        methodId: transaction.methodId,
        functionName: transaction.functionName,
      }));

      return transactions;
    } else {
      console.error('Error occurred while retrieving transactions.');
      return [];
    }
  } catch (error) {
    console.error('Error occurred while making the request:', error);
    return [];
  }
};
