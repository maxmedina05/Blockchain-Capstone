pragma solidity >=0.4.21 <0.6.0;

// import "./verifier.sol";
import "./ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/drafts/Counters.sol";


// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
// TODO define a solutions struct that can hold an index & an address
// TODO define an array of the above struct (redundant)
// TODO define a mapping to store unique solutions submitted
// TODO Create an event to emit when a solution is added
// TODO Create a function to add the solutions to the array and emit the event
// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

// Stub
contract Verifier {
    function verifyTx(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public returns (bool r);
}


contract SolnSquareVerifier is CustomERC721Token {
    using Counters for Counters.Counter;

    struct Solution {
        uint256 _index;
        address _address;
        bool exists;
    }

    Verifier private verifier;
    mapping(bytes32 => Solution) private solutions;
    Counters.Counter private solutionCounter;

    event SolutionAdded(uint256 _index, address _address);

    constructor(address verifierAddress) public {
        verifier = Verifier(verifierAddress);
    }

    function addSolution(address _address, bytes32 key) public {
        uint256 idx = solutionCounter.current();

        solutions[key] = Solution({
            _index: idx,
            _address: _address,
            exists: true
        });

        solutionCounter.increment();
        emit SolutionAdded(idx, _address);
    }

    function mintNFT(
        address _address,
        uint256 tokenId,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        require(verifier.verifyTx(a, b, c, input), "solution is not valid");
        bytes32 key = keccak256(abi.encodePacked(a, b, c, input));

        require(solutions[key].exists, "Solution key is not unique!");

        addSolution(_address, key);
        mint(_address, tokenId);
    }
}
