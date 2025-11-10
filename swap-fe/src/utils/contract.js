import { ERC20_ABI, FACTORY_ABI, PAIR_ABI, ROUTER_ABI } from '../config/abi'

import { CONTRACTS } from '../config/contracts'
import { ethers } from 'ethers'

// 获取 Router 合约实例
export const getRouterContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACTS.ROUTER, ROUTER_ABI, signerOrProvider)
}

// 获取 Token 合约实例
export const getTokenContract = (tokenAddress, signerOrProvider) => {
  return new ethers.Contract(tokenAddress, ERC20_ABI, signerOrProvider)
}

// 获取 Factory 合约实例
export const getFactoryContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACTS.FACTORY, FACTORY_ABI, signerOrProvider)
}

// 获取 Pair 合约实例
export const getPairContract = (pairAddress, signerOrProvider) => {
  return new ethers.Contract(pairAddress, PAIR_ABI, signerOrProvider)
}

// 获取代币余额
export const getTokenBalance = async (tokenAddress, account, provider) => {
  try {
    const tokenContract = getTokenContract(tokenAddress, provider)
    const balance = await tokenContract.balanceOf(account)
    const decimals = await tokenContract.decimals()
    return ethers.formatUnits(balance, decimals)
  } catch (error) {
    console.error('获取余额失败:', error)
    return '0'
  }
}

// 获取代币信息
export const getTokenInfo = async (tokenAddress, provider) => {
  try {
    const tokenContract = getTokenContract(tokenAddress, provider)
    const [symbol, name, decimals] = await Promise.all([
      tokenContract.symbol(),
      tokenContract.name(),
      tokenContract.decimals()
    ])
    return { symbol, name, decimals }
  } catch (error) {
    console.error('获取代币信息失败:', error)
    return null
  }
}

// 检查授权额度
export const checkAllowance = async (tokenAddress, owner, spender, provider) => {
  try {
    const tokenContract = getTokenContract(tokenAddress, provider)
    const allowance = await tokenContract.allowance(owner, spender)
    return allowance
  } catch (error) {
    console.error('检查授权失败:', error)
    return 0n
  }
}

// 授权代币
export const approveToken = async (tokenAddress, spender, amount, signer) => {
  try {
    const tokenContract = getTokenContract(tokenAddress, signer)
    const tx = await tokenContract.approve(spender, amount)
    await tx.wait()
    return true
  } catch (error) {
    console.error('授权失败:', error)
    throw error
  }
}

// 获取交易输出金额
export const getAmountsOut = async (amountIn, path, provider) => {
  try {
    const routerContract = getRouterContract(provider)
    const amounts = await routerContract.getAmountsOut(amountIn, path)
    return amounts
  } catch (error) {
    console.error('获取输出金额失败:', error)
    return null
  }
}

// 获取交易输入金额
export const getAmountsIn = async (amountOut, path, provider) => {
  try {
    const routerContract = getRouterContract(provider)
    const amounts = await routerContract.getAmountsIn(amountOut, path)
    return amounts
  } catch (error) {
    console.error('获取输入金额失败:', error)
    return null
  }
}

// 执行代币交换（精确输入）
export const swapExactTokensForTokens = async (
  amountIn,
  amountOutMin,
  path,
  to,
  deadline,
  signer
) => {
  try {
    const routerContract = getRouterContract(signer)
    const tx = await routerContract.swapExactTokensForTokens(
      amountIn,
      amountOutMin,
      path,
      to,
      deadline
    )
    const receipt = await tx.wait()
    return receipt
  } catch (error) {
    console.error('交换失败:', error)
    throw error
  }
}

// 执行代币交换（精确输出）
export const swapTokensForExactTokens = async (
  amountOut,
  amountInMax,
  path,
  to,
  deadline,
  signer
) => {
  try {
    const routerContract = getRouterContract(signer)
    const tx = await routerContract.swapTokensForExactTokens(
      amountOut,
      amountInMax,
      path,
      to,
      deadline
    )
    const receipt = await tx.wait()
    return receipt
  } catch (error) {
    console.error('交换失败:', error)
    throw error
  }
}

// 添加流动性
export const addLiquidity = async (
  tokenA,
  tokenB,
  amountADesired,
  amountBDesired,
  amountAMin,
  amountBMin,
  to,
  deadline,
  signer
) => {
  try {
    const routerContract = getRouterContract(signer)
    const tx = await routerContract.addLiquidity(
      tokenA,
      tokenB,
      amountADesired,
      amountBDesired,
      amountAMin,
      amountBMin,
      to,
      deadline
    )
    const receipt = await tx.wait()
    return receipt
  } catch (error) {
    console.error('添加流动性失败:', error)
    throw error
  }
}

// 移除流动性
export const removeLiquidity = async (
  tokenA,
  tokenB,
  liquidity,
  amountAMin,
  amountBMin,
  to,
  deadline,
  signer
) => {
  try {
    const routerContract = getRouterContract(signer)
    const tx = await routerContract.removeLiquidity(
      tokenA,
      tokenB,
      liquidity,
      amountAMin,
      amountBMin,
      to,
      deadline
    )
    const receipt = await tx.wait()
    return receipt
  } catch (error) {
    console.error('移除流动性失败:', error)
    throw error
  }
}

// 获取交易对地址
export const getPairAddress = async (tokenA, tokenB, provider) => {
  try {
    const factoryContract = getFactoryContract(provider)
    const pairAddress = await factoryContract.getPair(tokenA, tokenB)
    return pairAddress
  } catch (error) {
    console.error('获取交易对地址失败:', error)
    return null
  }
}

// 获取交易对储备量
export const getPairReserves = async (pairAddress, provider) => {
  try {
    const pairContract = getPairContract(pairAddress, provider)
    const reserves = await pairContract.getReserves()
    return {
      reserve0: reserves[0],
      reserve1: reserves[1],
      blockTimestampLast: reserves[2]
    }
  } catch (error) {
    console.error('获取储备量失败:', error)
    return null
  }
}

// 格式化地址（缩短显示）
export const formatAddress = (address) => {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// 格式化数字
export const formatNumber = (value, decimals = 4) => {
  const num = parseFloat(value)
  if (isNaN(num)) return '0'
  if (num === 0) return '0'
  if (num < 0.0001) return '< 0.0001'
  return num.toFixed(decimals)
}
