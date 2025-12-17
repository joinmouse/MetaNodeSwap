# 🎯 项目概述

Pledge 是一个去中心化固定利率借贷协议，核心特点：

💰 固定利率借贷：提供稳定的借贷利率

🔒 超额抵押：通过质押率保证系统安全

⚡ 自动清算：价格波动时自动触发清算保护

🏛️ 多签治理：关键操作需要多签确认

## 合约架构逻辑

- **PoolStorage**：存储层

- **PoolLendBorrow**：核心借贷逻辑（Admin + Lend + Borrow）

- **PledgePool**：主合约，整合所有功能模块（Settle + Swap + Fee + Liquidation）

## PledgePool 合约的功能

### 🏊‍♂️ 资金池管理

- **createPoolInfo()** - 创建新的借贷资金池，设置利率、质押率、时间等参数
- **poolBaseInfo()** - 获取资金池基础信息（时间、利率、供应量、状态等）
- **poolDataInfo()** - 获取资金池数据信息（结算金额、完成金额、清算金额）
- **poolLength()** - 获取资金池总数量

### 👥 用户信息查询

- **userLendInfo()** - 查询用户在指定资金池的出借信息
- **userBorrowInfo()** - 查询用户在指定资金池的借贷信息

### 💰 费用管理

- **setFee()** - 设置借贷手续费率（需要多签）
- **setFeeAddress()** - 设置手续费接收地址（需要多签）
- **setMinAmount()** - 设置最小操作金额（需要多签）

### 🔒 系统控制

- **setPause()** - 暂停/恢复系统（需要多签）
- **setSwapRouterAddress()** - 设置DEX路由地址（需要多签）

### ⚖️ 结算管理

- **checkoutSettle()** - 检查资金池是否可以结算
- **settle()** - 执行资金池结算（需要多签）
- **checkoutFinish()** - 检查资金池是否可以完成
- **finish()** - 执行资金池完成（需要多签）

### 🚨 清算管理

- **calculateHealthFactor()** - 计算资金池健康因子
- **checkoutLiquidate()** - 检查资金池是否可以清算
- **canLiquidate()** - 判断资金池是否达到清算条件
- **liquidate()** - 执行资金池清算
- **getLiquidationInfo()** - 获取清算相关信息

### 🔧 核心参数

- **LIQUIDATION_PENALTY** = 1000 (10%) - 清算罚金率
- **LIQUIDATION_REWARD** = 500 (5%) - 清算奖励率

## 核心流程

1. **创建资金池** → 设置借贷参数 → 多签确认
2. **用户参与** → 出借/借贷 → 获得对应代币
3. **结算阶段** → 到达结算时间 → 计算实际匹配金额
4. **执行阶段** → 借贷生效 → 计息开始
5. **完成/清算** → 到期自动完成 或 触发清算

---

## 🧪 测试代币部署

### BSC 测试网 (ChainId: 97)

项目已在 BSC 测试网部署了支持 Faucet 功能的测试代币，用户可以在前端页面免费领取进行测试。

#### 当前部署的测试代币地址

| 代币 | 合约地址 | 精度 |
|------|----------|------|
| **BUSD** | `0x3428bFc1AC181205B91AC25B56136f1B59c55ae4` | 18 |
| **BTCB** | `0xA70cA3e5a91Da9E8ef61c3a214f7d6D3ca03Be26` | 18 |
| **DAI** | `0x5Bf9C25492AFF8990C7c16a1E70e22C136a42de5` | 18 |
| **USDT** | `0x4A7A4be59fD51E998e737c0312b7582a88B53687` | 18 |

#### 如何重新部署测试代币

如果需要重新部署测试代币，请按照以下步骤操作：

**1. 配置环境变量**

在 `pledge-contract` 目录下创建 `.env` 文件：

```bash
# 你的钱包私钥（用于部署合约）
PRIVATE_KEY=你的私钥（不含0x前缀）
```

**2. 安装依赖**

```bash
cd pledge-contract
npm install
```

**3. 编译合约**

```bash
npx hardhat compile
```

**4. 部署测试代币**

```bash
npx hardhat run scripts/deployTestTokens.js --network bscTestnet
```

**5. 更新前端配置**

部署成功后，将输出的新合约地址更新到以下文件：

- `pledge-fe/src/constants/tokenAddresses.ts` - 代币地址常量文件（**主要配置**）
- `pledge-fe/src/constants/token/pancakeswap.json` - DEX 代币列表

#### 测试代币功能

- **faucet_transfer()** - 用户领取测试代币（每次 1000 个，24 小时冷却）
- **canClaim(address)** - 检查用户是否可以领取
- **timeUntilNextClaim(address)** - 查询距离下次可领取的时间

---

## 📁 项目配置文件说明

### 前端代币地址配置

代币地址统一配置在 `pledge-fe/src/constants/tokenAddresses.ts` 文件中：

```typescript
// BSC 测试网代币地址
export const TESTNET_TOKEN_ADDRESSES = {
  BUSD: '0x3428bFc1AC181205B91AC25B56136f1B59c55ae4',
  BTCB: '0xA70cA3e5a91Da9E8ef61c3a214f7d6D3ca03Be26',
  DAI: '0x5Bf9C25492AFF8990C7c16a1E70e22C136a42de5',
  USDT: '0x4A7A4be59fD51E998e737c0312b7582a88B53687',
  WBNB: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
};
```

> **注意**：如果重新部署了测试代币，只需更新此文件中的地址即可，其他文件会自动引用。
