// migrating the appropriate contracts
// const ERC721Mintable = artifacts.require("CustomERC721Token");
const Verifier = artifacts.require('./verifier.sol')
const SolnSquareVerifier = artifacts.require('./SolnSquareVerifier.sol')

module.exports = function (deployer) {
  // deployer.deploy(ERC721Mintable);
  deployer.deployer(Verifier).then(() => {
    return deployer.deploy(SolnSquareVerifier, Verifier.address)
  })
}
