const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("UniswapV2Module", (m) => {
  // 部署 Factory
  const feeToSetter = m.getAccount(0);
  const factory = m.contract("UniswapV2Factory", [feeToSetter]);

  // 部署 Router
  const router = m.contract("UniswapV2Router", [factory]);

  // 部署测试代币
  const tokenA = m.contract("TestToken", ["Token A", "TKA", m.bigint(1000000) * m.bigint(10 ** 18)]);
  const tokenB = m.contract("TestToken", ["Token B", "TKB", m.bigint(1000000) * m.bigint(10 ** 18)]);

  return { factory, router, tokenA, tokenB };
});
