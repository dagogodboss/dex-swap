import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { formatBalance } from 'utils/token-util';
import { MetaMask } from './connectors';
import './App.css';
import DisplayBox from './components/DisplayBox';
import ExchangeBox from './components/ExchangeBox';
import * as smartContracts from './contracts/contract-address.json';
import protoAbi from './contracts/proto-fire.json';
import dexSwapAbi from './contracts/dex-swap.json';

function App() {
  const { active, activate, library, error, account } = useWeb3React();
  const [provider, setProvider] = useState(library);
  const [signer, setSigner] = useState<any>({});
  const [balance, setBalance] = useState('0.00');
  const [network, setNetwork] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [rewardToken, setRewardToken] = useState<any>({});
  const [dexToken, setDexToken] = useState<any>({});

  const getProviderFromLibrary = () => {
    const accountProvider = new ethers.providers.Web3Provider(library.provider);
    setProvider(accountProvider);
    return accountProvider;
  };

  const getAccountBalance = async (address: any, accountProvider: any) => {
    if (accountProvider !== undefined) {
      setSigner(accountProvider.getSigner());
      setWalletAddress(address);
      setBalance(
        formatBalance(
          ethers.utils.formatEther(await accountProvider.getBalance(address)),
        ),
      );
    }
  };
  const getNetwork = async (accountProvider: any) => {
    if (library.network !== undefined) {
      console.log(library.network.name);
      setNetwork(await accountProvider.network);
    }
  };

  useEffect(() => {
    if ((active || activate) && library) {
      const accountProvider = getProviderFromLibrary();
      getAccountBalance(account, accountProvider);
      getNetwork(accountProvider);
    }
  }, [active, library, activate, account]);

  useEffect(() => {
    if (!active) {
      setRewardToken(
        new ethers.Contract(smartContracts.protoFire, protoAbi.abi),
      );
    }
    if (active && provider !== undefined) {
      setRewardToken(
        new ethers.Contract(smartContracts.protoFire, protoAbi.abi, provider),
      );
      setDexToken(
        new ethers.Contract(smartContracts.dexSwap, dexSwapAbi.abi, provider),
      );
    }
  }, [active, provider]);

  const connectWallet = async () => {
    if (!active) {
      try {
        await activate(MetaMask);
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="container-login100">
      <div className="wrap-login100">
        <ExchangeBox
          rewardToken={rewardToken}
          dexToken={dexToken}
          active={active}
          account={walletAddress}
          signer={signer}
        />
        <DisplayBox
          balance={balance}
          connectWallet={connectWallet}
          active={active}
          network={network}
        />
      </div>
    </div>
  );
}

export default App;
