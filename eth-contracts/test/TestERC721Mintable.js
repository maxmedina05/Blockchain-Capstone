const ERC721MintableComplete = artifacts.require('CustomERC721Token')

contract('TestERC721Mintable', (accounts) => {
  const account_one = accounts[0]
  const account_two = accounts[1]
  const tokenOwners = accounts.slice(10, 20)
  const BASE_TOKEN_URI =
    'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/'

  describe('match erc721 spec', function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one })

      // TODO: mint multiple tokens
      for (let i = 0; i < tokenOwners.length; i++) {
        const address = tokenOwners[i]
        await this.contract.mint(address, i)
      }
    })

    it('should return total supply', async function () {
      const expectedTotalSupply = 10
      const totalSupply = await this.contract.totalSupply()

      assert.equal(totalSupply, expectedTotalSupply, 'Total supply is invalid!')
    })

    it('should get token balance', async function () {
      const expectedBalance = 1

      const firstTokenOwner = tokenOwners[0]
      const balance = await this.contract.balanceOf(firstTokenOwner)

      assert.equal(balance, expectedBalance, 'Balance is invalid!')
    })

    // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
    it('should return token uri', async function () {
      const expectedTokenURI =
        'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1'

      const tokenURI = await this.contract.tokenURI(1)

      assert.equal(tokenURI, expectedTokenURI, 'TokenURI is invalid!')
    })

    it('should transfer token from one owner to another', async function () {
      const tokenId = 0
      const owner1 = tokenOwners[0]
      const owner2 = tokenOwners[1]
      const expectedOwner = owner2

      await this.contract.transferFrom(owner1, owner2, tokenId, {
        from: owner1,
      })

      const currentOwner = await this.contract.ownerOf(tokenId)
      assert.equal(currentOwner, expectedOwner, 'Owner is invalid!')
    })
  })

  describe('have ownership properties', function () {
    beforeEach(async function () {
      this.contract = await ERC721MintableComplete.new({ from: account_one })
    })

    it('should fail when minting when address is not contract owner', async function () {
      let revert = false
      let reason = ''
      try {
        const randomOwner = tokenOwners[5]
        const tokenId = 0
        await this.contract.mint(randomOwner, tokenId, { from: randomOwner })
      } catch (e) {
        reason = e.reason
        revert = true
      }

      assert.equal(revert, true)
      assert.equal(reason, 'Only the contract owner can access this')
    })

    it('should return contract owner', async function () {
      const expectedContractOwner = account_one

      const contractOwner = await this.contract.getOwner()

      assert.equal(contractOwner, expectedContractOwner)
    })
  })
})
