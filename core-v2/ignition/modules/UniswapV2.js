const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UniswapV2Module", (m) => {
  // 部署 Factory（第一步）
  // const feeToSetter = m.getAccount(0);
  // const factory = m.contract("UniswapV2Factory", [feeToSetter]);

  // // 部署 Router（等待 Factory 完成）
  // const router = m.contract("UniswapV2Router", [factory], {
  //   after: [factory]
  // });

  // // 部署测试代币 A（等待 Router 完成）
  // const tokenA = m.contract("TestToken", [
  //   "Token A", 
  //   "TKA", 
  //   BigInt(1000000) * BigInt(10 ** 18)
  // ], { 
  //   id: "TokenA",
  //   after: [router]
  // });

  // 部署测试代币 B（等待 Token A 完成）
  const tokenB = m.contract("TestToken", [
    "Token B", 
    "TKB", 
    BigInt(1000000) * BigInt(10 ** 18)
  ], { 
    id: "TokenB"
  });
  return {tokenB}
  // return { factory, router, tokenA, tokenB };
});
