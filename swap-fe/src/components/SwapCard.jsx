import './SwapCard.css'

import { CONTRACTS, TOKENS } from '../config/contracts'
import {
  approveToken,
  checkAllowance,
  formatNumber,
  getAmountsOut,
  getTokenBalance,
  swapExactTokensForTokens
} from '../utils/contract'
import { useEffect, useState } from 'react'

import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import { useWeb3 } from '../contexts/Web3Context'

const SwapCard = () => {
  const { account, provider, signer, isConnected, isCorrectNetwork } = useWeb3()
  
  const [fromToken, setFromToken] = useState(TOKENS.TOKEN_A)
  const [toToken, setToToken] = useState(TOKENS.TOKEN_B)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [fromBalance, setFromBalance] = useState('0')
  const [toBalance, setToBalance] = useState('0')
  const [isApproving, setIsApproving] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [needsApproval, setNeedsApproval] = useState(false)
  const [slippage, setSlippage] = useState('0.5')
  const [priceImpact, setPriceImpact] = useState('0')

  // 加载余额
  useEffect(() => {
    if (!account || !provider) return

    const loadBalances = async () => {
      const fromBal = await getTokenBalance(fromToken.address, account, provider)
      const toBal = await getTokenBalance(toToken.address, account, provider)
      setFromBalance(fromBal)
      setToBalance(toBal)
    }

    loadBalances()
    const interval = setInterval(loadBalances, 10000) // 每10秒更新一次
    return () => clearInterval(interval)
  }, [account, provider, fromToken, toToken])

  // 检查授权
  useEffect(() => {
    if (!account || !provider || !fromAmount || parseFloat(fromAmount) === 0) {
      setNeedsApproval(false)
      return
    }

    const checkApproval = async () => {
      try {
        const amount = ethers.parseUnits(fromAmount, fromToken.decimals)
        const allowance = await checkAllowance(
          fromToken.address,
          account,
          CONTRACTS.ROUTER,
          provider
        )
        setNeedsApproval(allowance < amount)
      } catch (error) {
        console.error('检查授权失败:', error)
      }
    }

    checkApproval()
  }, [account, provider, fromAmount, fromToken])

  // 计算输出金额
  useEffect(() => {
    if (!provider || !fromAmount || parseFloat(fromAmount) === 0) {
      setToAmount('')
      setPriceImpact('0')
      return
    }

    const calculateOutput = async () => {
      try {
        const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals)
        const path = [fromToken.address, toToken.address]
        const amounts = await getAmountsOut(amountIn, path, provider)
        
        if (amounts && amounts.length > 1) {
          const output = ethers.formatUnits(amounts[1], toToken.decimals)
          setToAmount(output)
          
          // 简单的价格影响计算（实际应该基于储备量）
          const impact = (parseFloat(fromAmount) / parseFloat(output) - 1) * 100
          setPriceImpact(Math.abs(impact).toFixed(2))
        }
      } catch (error) {
        console.error('计算输出失败:', error)
        setToAmount('0')
      }
    }

    const debounce = setTimeout(calculateOutput, 500)
    return () => clearTimeout(debounce)
  }, [fromAmount, fromToken, toToken, provider])

  // 切换代币
  const handleSwitch = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
    setFromBalance(toBalance)
    setToBalance(fromBalance)
  }

  // 授权代币
  const handleApprove = async () => {
    if (!signer) return

    try {
      setIsApproving(true)
      toast.loading('授权中...', { id: 'approve' })
      
      // 授权最大值
      const maxAmount = ethers.MaxUint256
      await approveToken(fromToken.address, CONTRACTS.ROUTER, maxAmount, signer)
      
      setNeedsApproval(false)
      toast.success('授权成功!', { id: 'approve' })
    } catch (error) {
      console.error('授权失败:', error)
      toast.error('授权失败: ' + error.message, { id: 'approve' })
    } finally {
      setIsApproving(false)
    }
  }

  // 执行交换
  const handleSwap = async () => {
    if (!signer || !account) return

    try {
      setIsSwapping(true)
      toast.loading('交换中...', { id: 'swap' })

      const amountIn = ethers.parseUnits(fromAmount, fromToken.decimals)
      const amountOutMin = ethers.parseUnits(
        (parseFloat(toAmount) * (1 - parseFloat(slippage) / 100)).toFixed(toToken.decimals),
        toToken.decimals
      )
      const path = [fromToken.address, toToken.address]
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20 // 20分钟

      await swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        account,
        deadline,
        signer
      )

      toast.success('交换成功!', { id: 'swap' })
      
      // 重置表单
      setFromAmount('')
      setToAmount('')
      
      // 刷新余额
      const fromBal = await getTokenBalance(fromToken.address, account, provider)
      const toBal = await getTokenBalance(toToken.address, account, provider)
      setFromBalance(fromBal)
      setToBalance(toBal)
    } catch (error) {
      console.error('交换失败:', error)
      toast.error('交换失败: ' + (error.reason || error.message), { id: 'swap' })
    } finally {
      setIsSwapping(false)
    }
  }

  // 设置最大金额
  const handleMaxAmount = () => {
    setFromAmount(fromBalance)
  }

  const canSwap = isConnected && 
                  isCorrectNetwork && 
                  fromAmount && 
                  parseFloat(fromAmount) > 0 && 
                  parseFloat(fromAmount) <= parseFloat(fromBalance) &&
                  !needsApproval

  return (
    <div className="swap-card">
      <div className="card-header">
        <h2>交换代币</h2>
        <div className="settings">
          <label>
            滑点容差:
            <input
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              min="0.1"
              max="50"
              step="0.1"
              className="slippage-input"
            />
            %
          </label>
        </div>
      </div>

      <div className="swap-container">
        {/* From Token */}
        <div className="token-input-container">
          <div className="token-input-header">
            <span className="label">从</span>
            <span className="balance">
              余额: {formatNumber(fromBalance)}
            </span>
          </div>
          <div className="token-input">
            <input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              disabled={!isConnected}
            />
            <div className="token-select">
              <span className="token-symbol">{fromToken.symbol}</span>
              <button className="max-btn" onClick={handleMaxAmount}>
                MAX
              </button>
            </div>
          </div>
        </div>

        {/* Switch Button */}
        <div className="switch-container">
          <button className="switch-btn" onClick={handleSwitch}>
            ⇅
          </button>
        </div>

        {/* To Token */}
        <div className="token-input-container">
          <div className="token-input-header">
            <span className="label">到</span>
            <span className="balance">
              余额: {formatNumber(toBalance)}
            </span>
          </div>
          <div className="token-input">
            <input
              type="number"
              placeholder="0.0"
              value={toAmount}
              disabled
            />
            <div className="token-select">
              <span className="token-symbol">{toToken.symbol}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Price Info */}
      {toAmount && parseFloat(toAmount) > 0 && (
        <div className="price-info">
          <div className="info-row">
            <span>汇率</span>
            <span>
              1 {fromToken.symbol} = {formatNumber(parseFloat(toAmount) / parseFloat(fromAmount))} {toToken.symbol}
            </span>
          </div>
          <div className="info-row">
            <span>价格影响</span>
            <span className={parseFloat(priceImpact) > 5 ? 'warning' : ''}>
              {priceImpact}%
            </span>
          </div>
          <div className="info-row">
            <span>最小接收</span>
            <span>
              {formatNumber(parseFloat(toAmount) * (1 - parseFloat(slippage) / 100))} {toToken.symbol}
            </span>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="action-container">
        {!isConnected ? (
          <button className="action-btn" disabled>
            请先连接钱包
          </button>
        ) : !isCorrectNetwork ? (
          <button className="action-btn" disabled>
            请切换到正确的网络
          </button>
        ) : !fromAmount || parseFloat(fromAmount) === 0 ? (
          <button className="action-btn" disabled>
            请输入金额
          </button>
        ) : parseFloat(fromAmount) > parseFloat(fromBalance) ? (
          <button className="action-btn" disabled>
            余额不足
          </button>
        ) : needsApproval ? (
          <button 
            className="action-btn approve-btn" 
            onClick={handleApprove}
            disabled={isApproving}
          >
            {isApproving ? '授权中...' : `授权 ${fromToken.symbol}`}
          </button>
        ) : (
          <button 
            className="action-btn swap-btn" 
            onClick={handleSwap}
            disabled={!canSwap || isSwapping}
          >
            {isSwapping ? '交换中...' : '交换'}
          </button>
        )}
      </div>

      {parseFloat(priceImpact) > 5 && (
        <div className="warning-message">
          ⚠️ 价格影响较大，请谨慎交易
        </div>
      )}
    </div>
  )
}

export default SwapCard
