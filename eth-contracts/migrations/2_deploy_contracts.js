// migrating the appropriate contracts
// TODO: remove this later on
const ERC721Mintable = artifacts.require("CustomERC721Token");
// var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  // TODO: remove this later
  deployer.deploy(ERC721Mintable);
  // deployer.deploy(SolnSquareVerifier);
};
