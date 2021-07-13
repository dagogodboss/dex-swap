import { ethers } from 'ethers';
import { convertToEther } from './unit-utils';

export const Erc20Abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'spender', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export const formatBalance = (balance: any) => {
  if (balance.toString().includes('.')) {
    return `${balance.toString().split('.')[0]}.${balance
      .toString()
      .split('.')[1]
      .substr(0, 4)}`;
  }
  return parseFloat(balance).toFixed(4).toString();
};

export const getTokenBalance = async (
  address: string,
  account: string,
  signer: any,
) => {
  const erc20token = new ethers.Contract(address, Erc20Abi, signer);
  return formatBalance(convertToEther(await erc20token.balanceOf(account)));
};
