import { ethers } from "ethers";

export const convertToEther = (bigNumber:any) => {
    return ethers.utils.formatUnits(bigNumber);
}

export const exchangeRate = (price: any) :number => {
    return price * 10 ** 18;
} 