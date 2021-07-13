const { expect } = require("chai");

function tokens(n) {
    return ethers.utils.parseEther(n);
}
describe('De-Centralize Exchange Swap ', () => {
    let Dai, // DAI Stablecoin contract address for rinkeby network 
        buyer, seller, TOK, owner;
    before(async () => {
        const rewardToken = await ethers.getContractFactory("Dagogo");
        const dexSmartContract = await ethers.getContractFactory("DexSwap");
        TOK = await rewardToken.deploy("Token Organization Knowledge", "TOK", 10000);
        await TOK.deployed();
        Dai = await rewardToken.deploy("Dai Stablecoin", "DAI", 5000000);
        await Dai.deployed();
        seller = await dexSmartContract.deploy("DEX Exchange", TOK.address);
        await seller.deployed();
        TOK.transfer(seller.address, 10000);
        [owner, buyer] = await ethers.getSigners();
    });

    it('Exchange token is deployed', async () => {
        expect(await seller.name()).to.equal('DEX Exchange');
    });

    it('Exchange token has {TOK} tokens', async () => {
        expect(await TOK.balanceOf(seller.address)).to.equal(await TOK.totalSupply());
    });

    it('can buy TOK tokens ', async () => {
        const { address } = buyer;
        await Dai.approve(seller.address, 5000);
        await expect(seller.buyTokens(Dai.address, 5000)).to.emit(seller, 'buyTokensEvent');
    });

    it('can sell TOK tokens ', async () => {
        const { address } = buyer;
        await TOK.approve(seller.address, 5000);
        await expect(seller.sellTokens(Dai.address, 5000)).to.emit(seller, 'soldTokensEvent');
    });
});