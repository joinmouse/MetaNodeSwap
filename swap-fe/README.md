# MetaNodeSwap Frontend

基于 Uniswap V2 协议的去中心化交易所前端应用。

## 🚀 功能特性

- ✅ 连接 MetaMask 钱包
- ✅ 代币交换（Token A ⇄ Token B）
- ✅ 实时余额显示
- ✅ 自动计算输出金额
- ✅ 滑点保护
- ✅ 价格影响提示
- ✅ 代币授权管理
- ✅ 交易状态提示
- ✅ 响应式设计

## 📦 技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **ethers.js v6** - 以太坊交互库
- **react-hot-toast** - 消息提示

## 🛠️ 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 📝 配置说明

### 合约地址配置

编辑 `src/config/contracts.js` 文件：

```javascript
export const CONTRACTS = {
  FACTORY: '0x2e25CAaBC48874498cd18906D1311d6F7Db6FA1A',
  ROUTER: '0xf5B6477D2b26B3892C92AA2B5B63DCAF79441fB8',
  TOKEN_A: '0x68409A847a7CEBf87963bDBc32edE05405AE34B6',
  TOKEN_B: '0xf915B587F89EB71421A2E30aE986fE115dcd89DC'
}
```

### 网络配置

默认配置为 Sepolia 测试网，可在 `src/config/contracts.js` 修改：

```javascript
export const NETWORK = {
  chainId: 11155111, // Sepolia
  name: 'Sepolia',
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  blockExplorer: 'https://sepolia.etherscan.io'
}
```

## 📖 使用指南

### 1. 连接钱包

- 点击右上角"连接钱包"按钮
- 在 MetaMask 中确认连接
- 确保切换到 Sepolia 测试网

### 2. 获取测试代币

访问以下地址获取测试 Token：

- Token A: `0x68409A847a7CEBf87963bDBc32edE05405AE34B6`
- Token B: `0xf915B587F89EB71421A2E30aE986fE115dcd89DC`

### 3. 执行交换

1. 输入要交换的代币数量
2. 查看预计接收的代币数量
3. 首次交易需要授权代币
4. 点击"交换"按钮
5. 在 MetaMask 中确认交易

### 4. 调整滑点

- 默认滑点为 0.5%
- 可在交换卡片右上角调整
- 建议范围：0.1% - 5%

## 🏗️ 项目结构

```
swap-fe/
├── src/
│   ├── components/          # React 组件
│   │   ├── Header.jsx       # 头部导航
│   │   ├── Header.css
│   │   ├── SwapCard.jsx     # 交换卡片
│   │   └── SwapCard.css
│   ├── contexts/            # React Context
│   │   └── Web3Context.jsx  # Web3 状态管理
│   ├── config/              # 配置文件
│   │   ├── contracts.js     # 合约地址配置
│   │   └── abi.js          # 合约 ABI
│   ├── utils/               # 工具函数
│   │   └── contract.js      # 合约交互函数
│   ├── App.jsx             # 主应用组件
│   ├── App.css
│   ├── main.jsx            # 入口文件
│   └── index.css           # 全局样式
├── index.html              # HTML 模板
├── vite.config.js          # Vite 配置
└── package.json            # 项目配置
```

## 🔧 核心功能实现

### Web3 连接

使用 `Web3Context` 管理钱包连接状态：

```javascript
const { account, provider, signer, isConnected } = useWeb3()
```

### 代币交换

```javascript
import { swapExactTokensForTokens } from './utils/contract'

await swapExactTokensForTokens(
  amountIn,
  amountOutMin,
  [tokenA, tokenB],
  account,
  deadline,
  signer
)
```

### 余额查询

```javascript
import { getTokenBalance } from './utils/contract'

const balance = await getTokenBalance(tokenAddress, account, provider)
```

## ⚠️ 注意事项

1. **仅用于测试**：本应用部署在 Sepolia 测试网，请勿使用真实资产
2. **Gas 费用**：需要 Sepolia 测试网 ETH 支付 Gas
3. **滑点设置**：价格波动大时建议提高滑点容差
4. **授权管理**：首次交易需要授权代币给 Router 合约

## 🔗 相关链接

- [Uniswap V2 文档](https://docs.uniswap.org/protocol/V2/introduction)
- [ethers.js 文档](https://docs.ethers.org/v6/)
- [Sepolia 测试网](https://sepolia.etherscan.io/)
- [MetaMask 钱包](https://metamask.io/)

## 📄 License

MIT
