# 🚀 Pledge 协议部署摘要

**部署时间**: 2025-12-19 17:08:30  
**网络**: BSC Testnet (ChainId: 97)  
**部署者**: 开发团队

---

## 📋 已部署合约地址

| 合约名称 | 地址 | 部署状态 | 说明 |
|---------|------|---------|------|
| **MultiSigWallet** | `0x4A14A993dCFdC474713FA545cc6Ed6ea01d1e8B4` | ✅ 已部署 | 多签钱包（之前已部署） |
| **Oracle** | `0x6b6B0803dFB0AF604a0CE7B98Fa4eF53Aa2Fbe38` | ✅ 已部署 | 价格预言机合约 |
| **PledgePool** | `0x713A90b5E2B703Dc30307f0B872E5d666c42e40d` | ✅ 已部署 | 主借贷合约 |
| **BUSD (测试币)** | `0x3428bFc1AC181205B91AC25B56136f1B59c55ae4` | ✅ 已存在 | BSC 测试网 BUSD |

---

## 🔧 已完成的配置更新

### 1. 数据库更新
```sql
-- 更新所有 BSC 测试网池子的 PledgePool 地址
UPDATE poolbases 
SET lend_token = '0x713A90b5E2B703Dc30307f0B872E5d666c42e40d' 
WHERE chain_id = '97';

-- 更新结算时间（30天后）
UPDATE poolbases 
SET settle_time = UNIX_TIMESTAMP(DATE_ADD(NOW(), INTERVAL 30 DAY)) 
WHERE chain_id = '97' AND lend_token_symbol = 'BUSD';
```

**影响范围**: 36 个 BUSD 池子

### 2. 前端配置更新
**文件**: `pledge-fe/src/utils/constants.ts`

```typescript
// 旧地址（已废弃）
// export const pledge_address = '0x80a4D82f1879c7933ee9aa266E8580abaaa9b7c2';
// export const ORACLE_address = '0x4F72DFa7E151767eC583bbaE7cf878Ed12d6c111';

// 新地址（2025-12-19 部署）
export const pledge_address = '0x713A90b5E2B703Dc30307f0B872E5d666c42e40d';
export const ORACLE_address = '0x6b6B0803dFB0AF604a0CE7B98Fa4eF53Aa2Fbe38';
```

---

## 📝 部署详情

### PledgePool 合约
- **构造参数**: MultiSigWallet 地址 (`0x4A14A993dCFdC474713FA545cc6Ed6ea01d1e8B4`)
- **编译器版本**: Solidity 0.8.28
- **优化**: 启用（200 runs）
- **Gas 费用**: ~10 Gwei

### Oracle 合约
- **构造参数**: MultiSigWallet 地址 (`0x4A14A993dCFdC474713FA545cc6Ed6ea01d1e8B4`)
- **编译器版本**: Solidity 0.8.28
- **优化**: 启用（200 runs）

---

## 🔄 ERC20 Approve 流程说明

### 正确的授权关系

```
用户钱包
   ↓ 调用 BUSD.approve()
BUSD 合约（记录授权）
   ↓ 授权给
PledgePool 合约（被授权者/Spender）
   ↓ 可以调用 BUSD.transferFrom()
从用户钱包转走 BUSD
```

### 关键参数
- **Spender（支出者）**: `0x713A90b5E2B703Dc30307f0B872E5d666c42e40d` (PledgePool)
- **Amount（支出上限）**: 用户输入的借贷金额
- **Token（代币合约）**: `0x3428bFc1AC181205B91AC25B56136f1B59c55ae4` (BUSD)

### 常见误解 ❌
> "授权给 BUSD 合约操作"

### 正确理解 ✅
> "通过 BUSD 合约，授权给 PledgePool 合约操作我的 BUSD"

---

## 🎯 下一步操作

### 1. 配置 PledgePool 初始参数
```bash
cd pledge-contract
npx hardhat run scripts/configure-pledgepool.js --network bscTestnet
```

**需要配置的参数**:
- 借贷手续费率: 0.25% (25 basis points)
- 最小借贷金额: 1 BUSD
- 最小借款金额: 1 BUSD
- 手续费接收地址: MultiSigWallet

### 2. 配置 Oracle 价格源
```bash
npx hardhat run scripts/configure-oracle.js --network bscTestnet
```

**需要配置的价格对**:
- BUSD/USD
- BNB/USD
- ETH/USD

### 3. 设置 DEX 路由
```bash
npx hardhat run scripts/configure-dex.js --network bscTestnet
```

**DEX 配置**:
- PancakeSwap Router: `0xD99D1c33F9fC3444f8101754aBC46c52416550D1`
- Factory: `0x6725F303b657a9451d8BA641348b6761A6CC7a17`

### 4. 验证合约
```bash
npx hardhat verify --network bscTestnet 0x713A90b5E2B703Dc30307f0B872E5d666c42e40d "0x4A14A993dCFdC474713FA545cc6Ed6ea01d1e8B4"
npx hardhat verify --network bscTestnet 0x6b6B0803dFB0AF604a0CE7B98Fa4eF53Aa2Fbe38 "0x4A14A993dCFdC474713FA545cc6Ed6ea01d1e8B4"
```

### 5. 前端重新部署
```bash
cd pledge-fe
npm run build
# 部署到服务器
```

---

## 🔍 验证部署

### 检查合约是否可访问
```bash
npx hardhat run scripts/verify-deployment.js --network bscTestnet
```

### 检查数据库更新
```sql
SELECT COUNT(*) as total, 
       COUNT(DISTINCT lend_token) as unique_addresses
FROM poolbases 
WHERE chain_id = '97';
```

### 检查前端配置
```bash
grep -r "0x713A90b5E2B703Dc30307f0B872E5d666c42e40d" pledge-fe/src/
```

---

## 📊 部署前后对比

| 项目 | 部署前 | 部署后 |
|------|--------|--------|
| PledgePool 地址 | `0x80a4D...b7c2` (旧) | `0x713A9...e40d` (新) ✅ |
| Oracle 地址 | `0x4F72D...c111` (旧) | `0x6b6B0...be38` (新) ✅ |
| 数据库池子数量 | 36 | 36 |
| 结算时间 | 已过期 | 2026-01-18 ✅ |
| Approve 功能 | ❌ 失败 | ✅ 待测试 |

---

## ⚠️ 注意事项

1. **旧合约地址已废弃**: 不要再使用 `0x80a4D82f1879c7933ee9aa266E8580abaaa9b7c2`
2. **前端需要重新部署**: 确保用户使用新的合约地址
3. **测试 Approve 流程**: 部署后需要完整测试借贷流程
4. **监控 Gas 费用**: 确保用户有足够的 BNB 支付 Gas
5. **RPC 节点稳定性**: 如遇到 "Failed to fetch" 错误，检查 RPC 配置

---

## 🔗 相关链接

- **BSCScan (Testnet)**: https://testnet.bscscan.com/
- **PledgePool 合约**: https://testnet.bscscan.com/address/0x713A90b5E2B703Dc30307f0B872E5d666c42e40d
- **Oracle 合约**: https://testnet.bscscan.com/address/0x6b6B0803dFB0AF604a0CE7B98Fa4eF53Aa2Fbe38
- **MultiSigWallet**: https://testnet.bscscan.com/address/0x4A14A993dCFdC474713FA545cc6Ed6ea01d1e8B4

---

## 📞 联系方式

如有问题，请联系开发团队。

---

**文档版本**: 1.0  
**最后更新**: 2025-12-19 17:08:30
