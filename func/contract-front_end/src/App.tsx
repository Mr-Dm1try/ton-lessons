import { TonConnectButton } from '@tonconnect/ui-react'
import './App.css'
import { useMainContract } from './hooks/useMainContract'
import { fromNano } from '@ton/core'

// EQAf0pL8wWg1HVfjgL_urrZQnBKhgkyuohkRO_KRzIQkync2

function App() {
  const {
    contractAddress,
    contractBalance,
    recentSender,
    counter,
    ownerAddress
  } = useMainContract()

  return (
    <div className='App'>
      <div><TonConnectButton /></div>
      <div>
        <div className='Card'>
          <b>Our Contract Address:</b>
          <div className='Hint'>{contractAddress?.slice(0, 30) + '...'}</div>
          <b>Our Contract Balance:</b>
          <div className='Hint'>{contractBalance ? fromNano(contractBalance) : 'Loading...'}</div>
        </div>

        <div className='Card'>
          <b>Counter value:</b>
          <div className='Hing'>{counter ?? 'Loading...'}</div>
        </div>
      </div>
    </div>
  )
}

export default App
