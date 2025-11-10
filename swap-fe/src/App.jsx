import './App.css'

import Header from './components/Header'
import SwapCard from './components/SwapCard'
import { Toaster } from 'react-hot-toast'
import { Web3Provider } from './contexts/Web3Context'

function App() {
  return (
    <Web3Provider>
      <div className="app">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Header />
        <main className="main-content">
          <div className="container">
            <SwapCard />
            <div className="info-section">
              <div className="info-card">
                <h3>📊 交易信息</h3>
                <ul>
                  <li>支持 Token A (TKA) ⇄ Token B (TKB) 交换</li>
                  <li>基于 Uniswap V2 协议</li>
                  <li>部署在 Sepolia 测试网</li>
                  <li>低滑点，高效交易</li>
                </ul>
              </div>
              <div className="info-card">
                <h3>🔗 合约地址</h3>
                <div className="contract-links">
                  <a 
                    href="https://sepolia.etherscan.io/address/0xf5B6477D2b26B3892C92AA2B5B63DCAF79441fB8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contract-link"
                  >
                    Router 合约 ↗
                  </a>
                  <a 
                    href="https://sepolia.etherscan.io/address/0x2e25CAaBC48874498cd18906D1311d6F7Db6FA1A" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="contract-link"
                  >
                    Factory 合约 ↗
                  </a>
                </div>
              </div>
              <div className="info-card">
                <h3>💡 使用提示</h3>
                <ol>
                  <li>连接 MetaMask 钱包</li>
                  <li>确保在 Sepolia 测试网</li>
                  <li>首次交易需要授权代币</li>
                  <li>设置合适的滑点容差</li>
                  <li>确认交易信息后执行</li>
                </ol>
              </div>
            </div>
          </div>
        </main>
        <footer className="footer">
          <p>© 2024 MetaNodeSwap - 去中心化交易所</p>
          <p className="footer-note">⚠️ 仅用于测试，请勿使用真实资产</p>
        </footer>
      </div>
    </Web3Provider>
  )
}

export default App
