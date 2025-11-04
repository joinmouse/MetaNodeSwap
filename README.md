# MetaNodeSwap - Uniswap V2 实现

这是一个简化版的 Uniswap V2 去中心化交易所（DEX）实现，包含核心的 AMM（自动做市商）功能。

## 合约架构

### 核心合约

1. **UniswapV2Factory.sol** - 工厂合约
   - 创建和管理交易对
   - 使用 CREATE2 确保交易对地址可预测
   - 管理协议费用设置

2. **UniswapV2Pair.sol** - 交易对合约
   - 实现恒定乘积做市商（x * y = k）
   - 管理流动性代币（LP Token）
   - 处理代币交换
   - 0.3% 交易手续费

3. **UniswapV2Router.sol** - 路由合约
   - 用户交互的主要接口
   - 添加/移除流动性
   - 代币交换（支持多跳路径）
   - 价格计算和查询

### 辅助合约

4. **TestToken.sol** - 测试用代币合约

5. **Math.sol** - 数学库（平方根计算）

6. **UniswapV2Library.sol** - 工具库（价格计算、地址排序等）

### 依赖库

- **@openzeppelin/contracts** - 使用 OpenZeppelin 的标准 ERC20 实现，更加安全和规范

## 主要功能

### 1. 创建交易对
```solidity
factory.createPair(tokenA, tokenB);
```

### 2. 添加流动性
```solidity
router.addLiquidity(
    tokenA,
    tokenB,
    amountADesired,
    amountBDesired,
    amountAMin,
    amountBMin,
    to,
    deadline
);
```

### 3. 移除流动性
```solidity
router.removeLiquidity(
    tokenA,
    tokenB,
    liquidity,
    amountAMin,
    amountBMin,
    to,
    deadline
);
```

### 4. 代币交换

**精确输入交换：**
```solidity
router.swapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    to,
    deadline
);
```

**精确输出交换：**
```solidity
router.swapTokensForExactTokens(
    amountOut,
    amountInMax,
    path,
    to,
    deadline
);
```

## 安装和部署

### 安装依赖
```bash
npm install
```

### 编译合约
```bash
npx hardhat compile
```

### 运行测试
```bash
npx hardhat test
```

### 部署合约
```bash
npx hardhat ignition deploy ./ignition/modules/UniswapV2.js --network localhost
```

## 核心机制

### 恒定乘积公式
Uniswap V2 使用恒定乘积做市商模型：
```
x * y = k
```
其中：
- x 和 y 是交易对中两种代币的储备量
- k 是常数（在没有交易费的情况下）

### 价格计算
输出金额计算公式（考虑 0.3% 手续费）：
```
amountOut = (amountIn * 997 * reserveOut) / (reserveIn * 1000 + amountIn * 997)
```

### 流动性代币

- 首次添加流动性：`liquidity = sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY`
- 后续添加流动性：`liquidity = min(amount0 * totalSupply / reserve0, amount1 * totalSupply / reserve1)`

## 安全特性

1. **重入保护** - 使用 lock 修饰符防止重入攻击
2. **滑点保护** - 支持最小输出/最大输入限制
3. **截止时间** - 交易必须在指定时间前完成
4. **溢出检查** - Solidity 0.8+ 内置溢出检查

## 测试

测试文件包含以下测试用例：

- ✅ 创建交易对
- ✅ 防止重复创建交易对
- ✅ 添加流动性
- ✅ 精确输入交换
- ✅ 精确输出交换
- ✅ 移除流动性

## 注意事项

⚠️ **这是一个简化的实现，仅用于学习和测试目的。在生产环境中使用前需要：**

1. 完整的安全审计
2. 添加更多的边界检查
3. 实现闪电贷保护
4. 添加价格预言机功能
5. 实现协议费用分配机制
6. 支持 ETH/WETH 交换
7. 添加更详细的事件日志

## 与 Uniswap V2 的差异

此实现简化了以下功能：

- 没有价格累加器（用于 TWAP 预言机）
- 没有协议费用分配逻辑
- 没有 WETH 支持
- 没有闪电贷回调功能
- 简化了某些边界情况处理

## 许可证

MIT