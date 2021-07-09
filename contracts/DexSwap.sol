//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
/*
 This Contract can be build in two ways
 1. Tie to the "TOK Token" and then no other token can be exchange with the smart contract
 2. Expect any two tokens as variable and then swap and one for the other with former as the reward token and later as purchasing token.

 However the First one is what is expected from this smart contract
*/
import "./Dagogo.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DexSwap is Ownable {
    using Address for address;

    string public name;
    Dagogo public rewardToken;
    uint256 public price = 1; // this means that 1 Dagogo token is equal to 1 DAI which is equal 1 usd
    IERC20 public externalToken;
    uint256 public burnRatio = 2;

    constructor(string memory _name, Dagogo _token) public {
        name = _name;
        // init the reward Token
        rewardToken = _token;
        // set the contract owner to the account that init it.
    }

    event buyTokensEvent(address account, uint256 amount, uint256 price);

    event setPriceEvent(address owner, uint256 price);

    event soldTokensEvent(address account, uint256 amount, uint256 price);

    function setPrice(uint256 _price) public onlyOwner {
        price = _price;
        emit setPriceEvent(msg.sender, _price);
    }

    function buyTokens(IERC20 _purchasingToken, uint256 _amount) public {
        externalToken = _purchasingToken;

        // verify that the sender can buy said amount
        require(externalToken.balanceOf(msg.sender) >= _amount);
        // amount of TOK to receive
        uint256 TOKAmount = _amount * price;

        // check that the contract can sell such amount
        require(
            rewardToken.balanceOf(address(this)) >= TOKAmount,
            "Try a lesser amount"
        );
        externalToken.transferFrom(msg.sender, address(this), _amount);
        rewardToken.transfer(msg.sender, TOKAmount);
        emit buyTokensEvent(msg.sender, _amount, price);
    }

    function sellTokens(IERC20 _withdrawToken, uint256 _amount) public {
        externalToken = _withdrawToken;
        // Now the exchange Token is suppose to have enough of the external token for the sell to happen.

        require(
            externalToken.balanceOf(address(this)) >= _amount,
            "try a lesser amount"
        );
        // the amount of external token to send back to the user.
        uint256 externalTokenAmount = _amount / burnRatio;
        require(
            rewardToken.balanceOf(msg.sender) >= externalTokenAmount,
            "try a lesser amount"
        );
        rewardToken.transferFrom(msg.sender, address(this), _amount);
        rewardToken.burn(address(this), _amount);
        externalToken.transfer(msg.sender, externalTokenAmount);
        emit soldTokensEvent(msg.sender, _amount, price);
    }
}
