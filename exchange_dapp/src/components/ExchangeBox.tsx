import { ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { isEmpty } from 'utils/func-helper';
import { getTokenBalance } from 'utils/token-util';
import * as smartContract from '../contracts/contract-address.json';
import { convertToEther, exchangeRate } from '../utils/unit-utils';

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
  const [price, setPrice] = useState<number | string>('...');
  const [selectedToken, setSelectedToken] = useState<any>({});
  useEffect(() => {
    (async () => {
      if (!isEmpty(dexToken)) {
        setPrice(exchangeRate(convertToEther(await dexToken.price())));
      }
    })();
  }, [dexToken]);

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
      getTokenBalance(e.value, account, signer).then((balance) => {
        e.balance = balance;
        setSelectedToken(e);
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

  const performExchange = (e: any) => {
    e.preventDefault();
  };

  return (
    <form className="login100-form validate-form">
      {active && (
        <div className="container-fluid">
          <div className="row">
            <div className="col-8">
              <div>
                <div
                  className="bg1 p-l-5 p-t-10 user-account"
                  style={{
                    background: '#f77d03 !important',
                    borderRadius: '0px',
                  }}
                >
                  <small className="text-white" style={{ marginTop: '4px' }}>
                    Price of Token Per Stablecoin is {price}
                  </small>
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
      <span className="login100-form-title p-b-43">
        Proto-Fire Dex Swap Task
      </span>
      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            <small>Purchasing Token</small>
          </div>
          <div className="col-4">
            <small>
              {selectedToken.value !== undefined &&
                selectedToken.value.substring(0, 7)}{' '}
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
                className="wrap-input100"
                style={{ border: 'none', width: '107%' }}
              >
                <input
                  className="input100"
                  type="text"
                  name="amount_to_buy"
                  required
                  placeholder="0.0"
                  style={{ textAlign: 'right' }}
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
                  type="text"
                  name="amount_to_buy"
                  required
                  placeholder="0.0"
                  style={{ textAlign: 'right' }}
                  readOnly
                />
                <span className="focus-input100" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container-login100-form-btn">
        <button
          type="submit"
          className="login100-form-btn"
          onClick={performExchange}
        >
          Buy Token
        </button>
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
