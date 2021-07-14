import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { isEmpty } from 'utils/func-helper';
import { Erc20Abi, getTokenBalance } from 'utils/token-util';
import * as smartContract from '../contracts/contract-address.json';
import {
  convertToEther,
  convertToWei,
  exchangeRate,
} from '../utils/unit-utils';
import Loading from './Loading';

const customStyle = {
  control: (provided: any, state: any) => ({
    border: 'none',
    display: 'flex',
  }),
};

const ExchangeBox = ({
  rewardToken,
  dexToken,
  active,
  account,
  signer,
}: any) => {
  const [price, setPrice] = useState<any>(0);
  const [selectedToken, setSelectedToken] = useState<any>({});
  const [outputAmount, setOutputAmount] = useState<any>();
  const [inputAmount, setInputAmount] = useState<any>();
  const [erc20Token, setErc20Token] = useState<any>({});
  const [inputErrorClass, setInputErrorClass] = useState(false);
  const [buttonText, setButtonText] = useState('Buy Token');
  const [buttonColor, setButtonColor] = useState('btn-info');
  const [errorMessage, setErrorMessage] = useState('');
  const [buttonSize, setButtonSize] = useState('');
  const [sellToken, setSellToken] = useState<any>(false);
  const [loading, setLoading] = useState<any>(false);
  const [disableOutput, setDisableOutput] = useState<any>(true);
  const [rewardTokenBalance, setRewardTokenBalance] = useState<any>(0);

  useEffect(() => {
    (async () => {
      if (!isEmpty(dexToken)) {
        try {
          setErrorMessage('');
          setPrice(exchangeRate(convertToEther(await dexToken.price())));
        } catch (e) {
          setErrorMessage(
            'Oops we encountered and Error. Please make sure you are connected to Rinkeby Network on Your MetaMask',
          );
        }
      }
    })();
  }, [dexToken]);

  useEffect(() => {
    (async () => {
      if (active) {
        try {
          const balance = await getTokenBalance(
            rewardToken.address,
            account,
            signer,
          );
          setRewardTokenBalance(balance);
        } catch (e) {
          console.log(e, signer);
        }
      }
    })();
  }, [active, signer]);
  const dappTok = [
    {
      value: smartContract.protoFire,
      label: (
        <>
          <img src="images/index.png" alt="logo" style={{ width: '30px' }} />
          <small style={{ paddingLeft: '5px' }}>ProtoFire Token TOk</small>
        </>
      ),
    },
  ];

  const filterSelectedData = (e: any) => {
    if (active) {
      getTokenBalance(e.value, account, signer)
        .then((balance) => {
          e.balance = balance;
          setSelectedToken(e);
          setErrorMessage('');
        })
        .catch((errMessage) => {
          setErrorMessage(
            'Ops we encountered an Error. Please make sure you are connected to Rinkeby Network on Your MetaMask',
          );
        });
    } else {
      setSelectedToken(e);
    }
  };

  const websiteFilterFieldsOptions = [
    {
      value: '0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea',
      name: 'DAI',
      label: (
        <>
          <img
            src="https://etherscan.io/token/images/MCDDai_32.png"
            alt="logo"
            style={{ width: '20px' }}
          />
          <small style={{ paddingLeft: '5px' }}>DAI Stablecoin DAI</small>
        </>
      ),
    },
    {
      value: '0xeb8f08a975ab53e34d8a0330e0d34de942c95926',
      name: 'USDC',
      label: (
        <>
          <img
            src="https://etherscan.io/token/images/centre-usdc_28.png"
            alt="logo"
            style={{ width: '20px' }}
          />
          <small style={{ paddingLeft: '5px' }}>USD Coin USDC</small>
        </>
      ),
    },
    {
      value: '0x2fb298bdbef468638ad6653ff8376575ea41e768',
      name: 'CUSDT',
      label: (
        <>
          <img
            src="https://assets.coingecko.com/coins/images/11621/thumb/cUSDT.png?1592113270"
            alt="logo"
            style={{ width: '20px' }}
          />
          <small style={{ paddingLeft: '5px' }}>CUSDT Stablecoin</small>
        </>
      ),
    },
  ];
  useEffect(() => {
    if (!isEmpty(selectedToken) && active) {
      try {
        setErrorMessage('');
        setErc20Token(
          new ethers.Contract(
            sellToken ? rewardToken.address : selectedToken.value,
            Erc20Abi,
            signer,
          ),
        );
      } catch (e) {
        setErrorMessage(
          'Ops we encountered an Error. Please make sure you are connected to Rinkeby Network on Your MetaMask',
        );
      }
    }
  }, [selectedToken, sellToken]);

  const validate = (): boolean => {
    if (parseFloat(inputAmount) === 0) {
      setInputErrorClass(true);
      setButtonText(sellToken ? 'Sell Token' : 'Buy Token');
      setButtonText('Enter Amount');
      setInputAmount(0);
      return false;
    }
    if (!active) {
      if (parseFloat(outputAmount) > parseFloat(rewardTokenBalance)) {
        setButtonText('Insufficient Funds');
        setButtonColor('btn-danger');
        setButtonSize('btn-lg');
        return false;
      }
    }
    if (!active) {
      setButtonText('Click Connect Wallet Button');
      setButtonColor('btn-warning');
      return false;
    }
    if (isEmpty(selectedToken)) {
      setButtonText('Select Token');
      setButtonColor('btn-danger');
      return false;
    }
    if (selectedToken.balance !== undefined) {
      if (parseFloat(inputAmount) > parseFloat(selectedToken.balance)) {
        setButtonText('Insufficient Funds');
        setButtonColor('btn-danger');
        setButtonSize('btn-lg');
        return false;
      }
    }
    if (parseFloat(outputAmount) === 0) {
      setButtonText('Empty Output Amount');
      return false;
    }
    return true;
  };

  const updateBalance = async () => {
    try {
      const choiceToken = selectedToken;
      setRewardTokenBalance(
        await getTokenBalance(rewardToken.address, account, signer),
      );
      choiceToken.balance = await getTokenBalance(
        selectedToken.value,
        account,
        signer,
      );
      setSelectedToken(choiceToken);
    } catch (e) {
      console.log(e, signer);
    }
  };

  useEffect(() => {
    validate();
    if (!inputAmount && !isEmpty(selectedToken) && active) {
      setButtonText(sellToken ? 'Sell Token' : 'Buy Token');
      setButtonText('Enter Amount');
      return;
    }
    if (Number(inputAmount) > 0) {
      setInputErrorClass(false);
      setButtonText(sellToken ? 'Sell Token' : 'Buy Token');
      setButtonColor('btn-info');
      setButtonSize('btn-md');
      return;
    }

    if (active && !isEmpty(selectedToken)) {
      setInputAmount(inputAmount);
      const amount = parseFloat(inputAmount) * parseFloat(price);
      setOutputAmount(amount);
    }
  }, [inputAmount, active, selectedToken]);

  const performExchange = async (e: any) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        const approve = await erc20Token.approve(
          dexToken.address,
          convertToWei(inputAmount),
        );
        await approve.wait(1);
        const buy = await dexToken.buyTokens(
          selectedToken.value,
          convertToWei(inputAmount),
        );
        await buy.wait(1);
        await updateBalance();
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  const sellUserToken = async (e: any) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        const approve = await erc20Token.approve(
          dexToken.address,
          convertToWei(outputAmount.toString()),
        );
        await approve.wait(1);
        const sell = await dexToken.sellTokens(
          selectedToken.value,
          convertToWei(outputAmount.toString()),
        );
        await sell.wait(1);
        await updateBalance();
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };
  const wantToSell = (e: any) => {
    const { target } = e;
    setSellToken(target.checked);
    if (target.checked) {
      setButtonText('Sell Token');
      return setDisableOutput(false);
    }
    setButtonText('Buy Token');
    return setDisableOutput(true);
  };
  return (
    <form className="login100-form validate-form">
      {active && (
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div>
                <div
                  className="bg1 p-l-5 p-t-10 user-account"
                  style={{
                    background: '#f77d03 !important',
                    borderRadius: '0px',
                  }}
                >
                  <div
                    className="text-white col"
                    style={{
                      marginTop: '4px',
                      display: 'block',
                      fontSize: 'small',
                    }}
                  >
                    Price of Token Per Stablecoin is {price}
                  </div>
                  <div
                    className="clear-both"
                    style={{ border: '1px solid aliceblue' }}
                  />
                  <div
                    className="text-white col"
                    style={{
                      marginTop: '4px',
                      display: 'block',
                      fontSize: 'small',
                    }}
                  >
                    Protofire Balance {rewardTokenBalance} TOK
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <img
        alt="protofire"
        src="protofire.svg"
        style={{ margin: '40px auto', display: 'block' }}
      />
      {errorMessage.length === 0 ? (
        <span className="login100-form-title p-b-43">
          Proto-Fire Dex Swap Task
        </span>
      ) : (
        <span
          style={{
            fontSize: 'small',
            lineHeight: '1.2rem',
            borderRadius: '10px',
          }}
          className="bg-danger p-t-2 text-left p-l-10 login100-form-title p-b-2 text-white"
        >
          {errorMessage}
        </span>
      )}

      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            <small>Purchasing Token</small>
          </div>
          <div className="col-4">
            <small>
              {selectedToken.name} {selectedToken.balance}
            </small>
          </div>
          <div className=" wrap-input100">
            <div className="col-6">
              <div className="">
                <Select
                  isSearchable
                  value={selectedToken}
                  onChange={(e: any) => filterSelectedData(e)}
                  options={websiteFilterFieldsOptions}
                  placeholder="Select Token"
                  styles={customStyle}
                />
              </div>
            </div>
            <div className="col-6">
              <div
                className={
                  inputErrorClass
                    ? 'wrap-input100 validate-input alert-validate'
                    : 'wrap-input100'
                }
                style={{ border: 'none', width: '107%' }}
                data-validate="Enter an Amount greater than zero"
              >
                <input
                  className="input100"
                  type="text"
                  name="amount_to_buy"
                  required
                  placeholder="0.0"
                  value={inputAmount}
                  style={{ textAlign: 'right' }}
                  onChange={(e: any) => {
                    setInputAmount(e.target.value);
                    const amount =
                      parseFloat(e.target.value) * parseFloat(price);
                    setOutputAmount(amount);
                  }}
                />
                <span className="focus-input100" />
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className=" wrap-input100">
            <div className="col-6">
              <div className="">
                <Select
                  defaultValue={dappTok[0]}
                  styles={customStyle}
                  options={dappTok}
                  isDisabled
                  value={dappTok[0]}
                />
              </div>
            </div>
            <div className="col-6">
              <div
                className="wrap-input100"
                style={{ border: 'none', width: '107%' }}
              >
                <input
                  className="input100"
                  type="number"
                  name="amount_to_buy"
                  required
                  placeholder="0.0"
                  style={{ textAlign: 'right' }}
                  readOnly={disableOutput}
                  value={outputAmount}
                  onChange={(e) => {
                    setOutputAmount(e.target.value);
                    setInputAmount(
                      parseFloat(e.target.value) / parseFloat(price),
                    );
                  }}
                />
                <span className="focus-input100" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col form-check">
        <input
          type="checkbox"
          onChange={wantToSell}
          className="form-check-input"
        />{' '}
        SELL TOKEN
      </div>

      <div className="container-login100-form-btn">
        {loading ? (
          <Loading />
        ) : (
          <button
            type="submit"
            className={`btn ${buttonColor} btn-block ${buttonSize} mt-2`}
            onClick={sellToken ? sellUserToken : performExchange}
          >
            {buttonText}
          </button>
        )}
      </div>
    </form>
  );
};
ExchangeBox.propTypes = {
  rewardToken: PropTypes.func.isRequired,
  dexToken: PropTypes.func.isRequired,
  signer: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  account: PropTypes.string.isRequired,
};
export default ExchangeBox;
