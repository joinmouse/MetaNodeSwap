import './Header.css'

import { formatAddress } from '../utils/contract'
import { useWeb3 } from '../contexts/Web3Context'

const Header = () => {
  const { account, isConnected, isConnecting, connectWallet, disconnectWallet } = useWeb3()

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>🔄 MetaNodeSwap</h1>
          <span className="subtitle">去中心化交易所</span>
        </div>

        <nav className="nav">
          <a href="#swap" className="nav-link active">交换</a>
          <a href="#pool" className="nav-link">流动性池</a>
        </nav>

        <div className="wallet-section">
          {isConnected ? (
            <div className="wallet-info">
              <div className="account-badge">
                <span className="status-dot"></span>
                <span className="account-address">{formatAddress(account)}</span>
              </div>
              <button className="btn btn-secondary" onClick={disconnectWallet}>
                断开
              </button>
            </div>
          ) : (
            <button 
              className="btn btn-primary" 
              onClick={connectWallet}
              disabled={isConnecting}
            >
              {isConnecting ? '连接中...' : '连接钱包'}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
