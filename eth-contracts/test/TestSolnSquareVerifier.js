// Test if a new solution can be added for contract - SolnSquareVerifier
// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

const SolnSquareVerifier = artifacts.require('SolnSquareVerifier')
const Verifier = artifacts.require('Verifier')
const PROOF_JSON = require('./proof.json')

contract('SolnSquareVerifier', (accounts) => {
  const contractOwner = accounts[0]
  const tokenOwners = accounts.slice(0, 5)

  describe('Test Solution and Mint', () => {
    beforeEach(async () => {
      const verifier = await Verifier.new({ from: contractOwner })
      this.contract = await SolnSquareVerifier.new(verifier.address, {
        from: contractOwner,
      })
    })

    it('should be able to add a new solution to the contract', async () => {
      const { proof, inputs } = PROOF_JSON
      const { a, b, c } = proof

      const result = await this.contract.addSolution(
        a,
        b,
        c,
        inputs,
        {
          from: contractOwner,
        },
      )

      assert.equal(result.logs[0].event, 'SolutionAdded')
    })

    it('should be able to mint ERC721 tokens', async () => {
      const tokenOwner = tokenOwners[2]
      const { inputs } = PROOF_JSON

      const result = await this.contract.mintNFT(
        tokenOwner,
        inputs,
        {
          from: contractOwner,
        },
      )

      assert.equal(result.logs[0].event, 'Transfer')
    })
  })
})
