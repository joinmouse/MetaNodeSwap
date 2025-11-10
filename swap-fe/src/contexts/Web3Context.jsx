import { createContext, useContext, useEffect, useState } from 'react'

import { NETWORK } from '../config/contracts'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

const Web3Context = createContext()

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within Web3Provider')
  }
  return context
}

export const Web3Provider = ({ children }) => {
  const [account, setAccount] = useState(null)
  const [provider, setProvider] = useState(null)
  const [signer, setSigner] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // 检查是否安装了 MetaMask
  const checkMetaMask = () => {
    if (!window.ethereum) {
      toast.error('请安装 MetaMask 钱包!')
      return false
    }
    return true
  }

  // 连接钱包
  const connectWallet = async () => {
    if (!checkMetaMask()) return

    try {
      setIsConnecting(true)
      const provider = new ethers.BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const network = await provider.getNetwork()

      setProvider(provider)
      setSigner(signer)
      setAccount(accounts[0])
      setChainId(Number(network.chainId))

      // 检查网络
      if (Number(network.chainId) !== NETWORK.chainId) {
        toast.error(`请切换到 ${NETWORK.name} 网络`)
        await switchNetwork()
      } else {
        toast.success('钱包连接成功!')
      }
    } catch (error) {
      console.error('连接钱包失败:', error)
      toast.error('连接钱包失败: ' + error.message)
    } finally {
      setIsConnecting(false)
    }
  }

  // 断开钱包
  const disconnectWallet = () => {
    setAccount(null)
    setProvider(null)
    setSigner(null)
    setChainId(null)
    toast.success('钱包已断开')
  }

  // 切换网络
  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${NETWORK.chainId.toString(16)}` }]
      })
    } catch (error) {
      // 如果网络不存在，尝试添加
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${NETWORK.chainId.toString(16)}`,
              chainName: NETWORK.name,
              rpcUrls: [NETWORK.rpcUrl],
              blockExplorerUrls: [NETWORK.blockExplorer]
            }]
          })
        } catch (addError) {
          console.error('添加网络失败:', addError)
          toast.error('添加网络失败')
        }
      } else {
        console.error('切换网络失败:', error)
        toast.error('切换网络失败')
      }
    }
  }

  // 监听账户变化
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== account) {
        setAccount(accounts[0])
        toast.success('账户已切换')
      }
    }

    const handleChainChanged = (chainId) => {
      const newChainId = parseInt(chainId, 16)
      setChainId(newChainId)
      if (newChainId !== NETWORK.chainId) {
        toast.error(`请切换到 ${NETWORK.name} 网络`)
      }
      // 刷新页面以重新加载数据
      window.location.reload()
    }

    window.ethereum.on('accountsChanged', handleAccountsChanged)
    window.ethereum.on('chainChanged', handleChainChanged)

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
      window.ethereum.removeListener('chainChanged', handleChainChanged)
    }
  }, [account])

  // 自动连接（如果之前已连接）
  useEffect(() => {
    const autoConnect = async () => {
      if (!window.ethereum) return

      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.send('eth_accounts', [])
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const network = await provider.getNetwork()
          
          setProvider(provider)
          setSigner(signer)
          setAccount(accounts[0])
          setChainId(Number(network.chainId))
        }
      } catch (error) {
        console.error('自动连接失败:', error)
      }
    }

    autoConnect()
  }, [])

  const value = {
    account,
    provider,
    signer,
    chainId,
    isConnecting,
    isConnected: !!account,
    isCorrectNetwork: chainId === NETWORK.chainId,
    connectWallet,
    disconnectWallet,
    switchNetwork
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}
