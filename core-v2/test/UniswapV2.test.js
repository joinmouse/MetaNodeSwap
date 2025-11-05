const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UniswapV2", function () {
  let factory, router, tokenA, tokenB, pair;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // 部署 Factory
    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    factory = await Factory.deploy(owner.address);

    // 部署 Router
    const Router = await ethers.getContractFactory("UniswapV2Router");
    router = await Router.deploy(await factory.getAddress());

    // 部署测试代币
    const TestToken = await ethers.getContractFactory("TestToken");
    tokenA = await TestToken.deploy("Token A", "TKA", ethers.parseEther("1000000"));
    tokenB = await TestToken.deploy("Token B", "TKB", ethers.parseEther("1000000"));
  });

  describe("Factory", function () {
    it("应该能创建交易对", async function () {
      await factory.createPair(await tokenA.getAddress(), await tokenB.getAddress());
      const pairAddress = await factory.getPair(await tokenA.getAddress(), await tokenB.getAddress());
      console.log("pairAddress", pairAddress)
      expect(pairAddress).to.not.equal(ethers.ZeroAddress);
    });

    it("不应该创建重复的交易对", async function () {
      await factory.createPair(await tokenA.getAddress(), await tokenB.getAddress());
      await expect(
        factory.createPair(await tokenA.getAddress(), await tokenB.getAddress())
      ).to.be.revertedWith("UniswapV2: PAIR_EXISTS");
    });
  });

  describe("Router: 添加流动性", function () {
    beforeEach(async function () {
      // 授权 Router
      const routerAddress = await router.getAddress()
      console.log("routerAddress", routerAddress)
      await tokenA.approve(routerAddress, ethers.parseEther("1000000"));
      await tokenB.approve(routerAddress, ethers.parseEther("1000000"));
    });

    it("应该能添加流动性", async function () {
      const amountA = ethers.parseEther("100");
      const amountB = ethers.parseEther("100");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await router.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountA,
        amountB,
        0,
        0,
        owner.address,
        deadline
      );

      // 获取交易对地址
      const pairAddress = await factory.getPair(await tokenA.getAddress(), await tokenB.getAddress());
      // 获取交易对
      const Pair = await ethers.getContractFactory("UniswapV2Pair");
      // 获取交易对的流动性
      pair = Pair.attach(pairAddress);

      const liquidity = await pair.balanceOf(owner.address);
      expect(liquidity).to.be.gt(0);
    });
  });

  describe("Router: 交换", function () {
    beforeEach(async function () {
      // 添加流动性
      await tokenA.approve(await router.getAddress(), ethers.parseEther("1000000"));
      await tokenB.approve(await router.getAddress(), ethers.parseEther("1000000"));

      const amountA = ethers.parseEther("1000");
      const amountB = ethers.parseEther("1000");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await router.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountA,
        amountB,
        0,
        0,
        owner.address,
        deadline
      );
    });

    it("应该能用精确输入交换代币", async function () {
      const amountIn = ethers.parseEther("10");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await tokenA.approve(await router.getAddress(), amountIn);

      const balanceBefore = await tokenB.balanceOf(owner.address);

      await router.swapExactTokensForTokens(
        amountIn,
        0,
        [await tokenA.getAddress(), await tokenB.getAddress()],
        owner.address,
        deadline
      );

      const balanceAfter = await tokenB.balanceOf(owner.address);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });

    it("应该能用精确输出交换代币", async function () {
      const amountOut = ethers.parseEther("10");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await tokenA.approve(await router.getAddress(), ethers.parseEther("100"));

      const balanceBefore = await tokenB.balanceOf(owner.address);

      await router.swapTokensForExactTokens(
        amountOut,
        ethers.parseEther("100"),
        [await tokenA.getAddress(), await tokenB.getAddress()],
        owner.address,
        deadline
      );

      const balanceAfter = await tokenB.balanceOf(owner.address);
      expect(balanceAfter - balanceBefore).to.equal(amountOut);
    });
  });

  describe("Router: 移除流动性", function () {
    beforeEach(async function () {
      // 添加流动性
      await tokenA.approve(await router.getAddress(), ethers.parseEther("1000000"));
      await tokenB.approve(await router.getAddress(), ethers.parseEther("1000000"));

      const amountA = ethers.parseEther("1000");
      const amountB = ethers.parseEther("1000");
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      await router.addLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        amountA,
        amountB,
        0,
        0,
        owner.address,
        deadline
      );
    });

    it("应该能移除流动性", async function () {
      const pairAddress = await factory.getPair(await tokenA.getAddress(), await tokenB.getAddress());
      const Pair = await ethers.getContractFactory("UniswapV2Pair");
      pair = Pair.attach(pairAddress);

      const liquidity = await pair.balanceOf(owner.address);
      await pair.approve(await router.getAddress(), liquidity);

      const deadline = Math.floor(Date.now() / 1000) + 3600;

      const balanceABefore = await tokenA.balanceOf(owner.address);
      const balanceBBefore = await tokenB.balanceOf(owner.address);

      await router.removeLiquidity(
        await tokenA.getAddress(),
        await tokenB.getAddress(),
        liquidity,
        0,
        0,
        owner.address,
        deadline
      );

      const balanceAAfter = await tokenA.balanceOf(owner.address);
      const balanceBAfter = await tokenB.balanceOf(owner.address);

      expect(balanceAAfter).to.be.gt(balanceABefore);
      expect(balanceBAfter).to.be.gt(balanceBBefore);
    });
  });
});
