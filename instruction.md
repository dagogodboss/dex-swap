# About the Smart Contract

```Create a smart contract that lets people buy or sell a TOK token from it for a certain price. This contract should hold the total amount of tokens received in exchange for all bought TOK tokens. The token to be used for payment may be DAI, USDC or any other USD-stable ERC20 token.

Develop a dapp that lets you interact with this smart contract. You are free to do it however you want, but at the very least you should include a way for the user to see their balance, and the buy and sell functionalities.

Extra points (not required):

    Make it work in any network
    Make each action clickable. When you click it, you are taken to the etherscan page for the transaction that triggered the buy or sell operation.
    Make the token price vary with the amount of tokens already sold. Read this blogpost for ideas.
```

<p>
    You can think of this as a swapping contract, where the amount of tokens that has been paid to the contract is collateralizing TOK. So, for example, when people buy TOK, they deposit DAI as collateral in exchange for TOK. On the other hand, when people sell their TOK, it is burned and they retrieve a part of the locked DAI. Hope this serves as clarification, and don't doubt to ask any more questions.
</p>
