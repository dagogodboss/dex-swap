//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Dagogo is ERC20 {
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialAmount
    ) ERC20(_name, _symbol) {
        _mint(msg.sender, _initialAmount);
    }

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function burn(address account, uint256 amount) public {
        _burn(account, amount);
    }
}
