const { expect } = require("chai");

describe("Dagogo Token As ERC20 Token", function () {
  let token, owner, addr1;
  beforeEach(async () => {
    const DagogoToken = await ethers.getContractFactory("Dagogo");
    token = await DagogoToken.deploy("Dagogo Token", "DGTOKEN", 10000);
    [owner, addr1] = await ethers.getSigners();
  });

  it("Should return the token symbol", async function () {
    expect(await token.symbol()).to.equal("DGTOKEN");
  });
  
  it("should have a decimal function and it should equal 18", async ()=> {
    await token.decimals();
    expect(await token.decimals()).to.equal(18);
  });
  
  it("it expect token initialSupply assigned to the caller", async ()=>{
    expect(await token.balanceOf(owner.address)).to.equal(await token.totalSupply());
  });
  
  it('Calls totalSupply on DagogoToken contract', async () => {
    expect(await token.totalSupply()).to.equal(10000);
  })
  
  it("it expect token to have a Name {Dagogo Token}", async ()=>{
    expect(await token.name()).to.equal("Dagogo Token");
  });
  
  it("can be sent to another account", async function(){
    await expect(token.transfer(addr1.address, 100))
	    .to.emit(token, 'Transfer') 
	      .withArgs(owner.address, addr1.address, 100);
    expect(await token.balanceOf(owner.address)).to.equal(await token.totalSupply() - 100);
  });   

  it("New Account has balance of 100", async ()=>{
    await token.transfer(addr1.address, 100);
    expect (await token.balanceOf(addr1.address))
      .to
        .equal(await token.totalSupply() -(await token.totalSupply() - 100));
  });

  it('Transfer emits event', async () => {
    await expect(token.transfer(addr1.address, 100))
      .to.emit(token, 'Transfer')
      .withArgs(owner.address, addr1.address, 100);
  });
});
