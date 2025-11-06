const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("\n🔍 验证 Sepolia 部署...\n");

  // 读取部署地址
  const deploymentPath = path.join(
    __dirname,
    "..",
    "ignition",
    "deployments",
    "chain-11155111",
    "deployed_addresses.json"
  );

  if (!fs.existsSync(deploymentPath)) {
    console.error("❌ 未找到部署记录，请先运行: npm run deploy");
    process.exit(1);
  }

  const addresses = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
  
  const factoryAddress = addresses["UniswapV2Module#UniswapV2Factory"];
  const routerAddress = addresses["UniswapV2Module#UniswapV2Router"];
  const tokenAAddress = addresses["UniswapV2Module#TokenA"];
  const tokenBAddress = addresses["UniswapV2Module#TokenB"];

  // 获取账户信息
  const [deployer] = await hre.ethers.getSigners();
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  
  console.log(`� 账户: ${deployer.address}`);
  console.log(`💰 余额: ${hre.ethers.formatEther(balance)} ETH\n`);

  // 验证合约
  const factory = await hre.ethers.getContractAt("UniswapV2Factory", factoryAddress);
  const router = await hre.ethers.getContractAt("UniswapV2Router", routerAddress);
  const tokenA = await hre.ethers.getContractAt("TestToken", tokenAAddress);
  const tokenB = await hre.ethers.getContractAt("TestToken", tokenBAddress);

  console.log("📋 合约地址：");
  console.log(`   Factory: ${factoryAddress}`);
  console.log(`   Router:  ${routerAddress}`);
  console.log(`   Token A: ${tokenAAddress} (${await tokenA.symbol()})`);
  console.log(`   Token B: ${tokenBAddress} (${await tokenB.symbol()})\n`);

  console.log("🔗 Etherscan 链接：");
  console.log(`   https://sepolia.etherscan.io/address/${factoryAddress}`);
  console.log(`   https://sepolia.etherscan.io/address/${routerAddress}\n`);

  console.log("✅ 验证完成！\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
