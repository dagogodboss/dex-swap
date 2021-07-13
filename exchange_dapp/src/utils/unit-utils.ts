import { ethers } from 'ethers';

export const convertToEther = (bigNumber: any) => {
  return ethers.utils.formatEther(bigNumber);
};

export const convertToWei = (number: any) => {
  return ethers.utils.parseEther(number);
};

export const exchangeRate = (price: any): number => {
  return price * 10 ** 18;
};
