// // SPDX-License-Identifier:GPL-2.0-or-later
pragma solidity >=0.4.0 <0.9.0;
// pragma abicoder v2;

// import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
// import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
// import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
// import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
// import "@uniswap/v3-periphery/contracts/base/LiquidityManagement.sol";
// import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
// import "hardhat/console.sol";

// contract LiquidityExamples is IERC721Receiver {
//     address public constant DAI = 0x6B175474E89094C44Da98b954EedeAC495271d0F;
//     address public constant USDC =0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
//     uint24 public constant poolFee100;

//     INonfungiblePositionManager public nonfungiblePositionManager=INonfungiblePositionManager(0xC36442b4a4522E871399CD717aBDD847Ab11FE88);
//     struct Deposit{
//         address owner;
//         uint128 liquidity;
//         uint token0;
//         address token1; 
//     }
//     mapping(uint => Deposit) public deposit;
//     uint public tokenId;

//     function onERC721Received(address operator,address,uint _tokenId,bytes calldata) external override returns(bytes4)
//     {
//         _createDeposit(operator,_tokenId);
//         return this.onERC721Received.selector;
//     }

//     function _createDeposit(address owner,uint tokenId) internal
//     {
//         (,,address token0,address token1,,,,uint128 liquidity,,,,)=nonfungiblePositionManager.positions(_tokenId);
//         deposit[_tokenId]=Deposit({
//             owner:owner,
//             liquidity:liquidity,
//             token0:token0,
//             token1:token1
//         });
//         console.log("Token id",_tokenId);
//         console.log("Liquidity",liquidity);
//         tokenId=_tokenId;
//     }

//     function mintNewPosition() external returns(uint _tokenId,uint128 liquuidity,uint amount0,uint amount1)
//     {
//         uint amount0ToMint=100*1e18;
//         uint amount1ToMint=100*1e18;

//         TransferHelper.safeApprove(DAI, address(nonfungiblePositionManager), amount0ToMint);
//         TransferHelper.safeApprove(Dai, address(nonfungiblePositionManager), amount1ToMint);

//         INonfungiblePositionManager.MintParams memory params= INonfungiblePositionManager.MintParams({
//             token0:DAI,
//             token1:USDC,
//             fee:poolFee,
//             tickLower:TickMath.MIN_TCIK,
//             tickUpper:TickMath.MAX_TICK,
//             amount0Min:0,
//             amount1Min:0,
//             recipient:address(this),
//             deadline:block.timestamp
//         });
//         (_tokenId,liquidity,amount0,amount1)=nonfungiblePositionManager.mint(params);
//         _createDeposit(msg.sender, _tokenId);
//         if(amount0<amount0ToMint)
//         {
//             TransferHelper.safeApprove(DAI, address(nonfungiblePositionManager), 0);
//             uint refund0 = amount0ToMint-amount0;
//             TransferHelper.safeTransfer(DAI, address(nonfungiblePositionManager), refund0);
//         }
//         if(amount1<amount1ToMint)
//         {
//             TransferHelper.safeApprove(USDC, address(nonfungiblePositionManager), 0);
//             uint refund1 = amount1ToMint-amount1;
//             TransferHelper.safeTransfer(USDC, address(nonfungiblePositionManager), refund1);
//         }
//     }
//     function collectAllFees() external returns (uint256 amount0,unit amount1)
//     {
//         k
//     }
// }