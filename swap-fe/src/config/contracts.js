// 合约地址配置
export const CONTRACTS = {
  FACTORY: '0x2e25CAaBC48874498cd18906D1311d6F7Db6FA1A',
  ROUTER: '0xf5B6477D2b26B3892C92AA2B5B63DCAF79441fB8',
  TOKEN_A: '0x68409A847a7CEBf87963bDBc32edE05405AE34B6',
  TOKEN_B: '0xf915B587F89EB71421A2E30aE986fE115dcd89DC'
}

// 网络配置
export const NETWORK = {
  chainId: 11155111, // Sepolia
  name: 'Sepolia',
  rpcUrl: 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY',
  blockExplorer: 'https://sepolia.etherscan.io'
}

// Token 配置
export const TOKENS = {
  TOKEN_A: {
    address: CONTRACTS.TOKEN_A,
    symbol: 'TKA',
    name: 'Token A',
    decimals: 18
  },
  TOKEN_B: {
    address: CONTRACTS.TOKEN_B,
    symbol: 'TKB',
    name: 'Token B',
    decimals: 18
  }
}
