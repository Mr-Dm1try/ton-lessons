import { fromNano } from '@ton/core'
import { TonConnectButton } from '@tonconnect/ui-react'
import './App.css'
import { useMainContract } from './hooks/useMainContract'
import { useTonConnect } from './hooks/useTonConnect'
import WebApp from '@twa-dev/sdk'



// EQAf0pL8wWg1HVfjgL_urrZQnBKhgkyuohkRO_KRzIQkync2

function App() {
  const {
    contractAddress,
    contractBalance,
    // recentSender,
    counter,
    // ownerAddress,
    sendIncrement,
    sendDeposit,
    sendWithdrawal
  } = useMainContract()

  const { connected } = useTonConnect()

  const showAlert = () => WebApp.showAlert("Hello there!")

  return (
    <div className='App'>
      <div><TonConnectButton /></div>
      <div>
        <div className='Card'>
          <b>{WebApp.platform}</b>
          <b>Our Contract Address:</b>
          <div className='Hint'>{contractAddress?.slice(0, 30) + '...'}</div>
          <b>Our Contract Balance:</b>
          {contractBalance && (<div className='Hint'>{fromNano(contractBalance)}</div>)}
        </div>

        <div className='Card'>
          <b>Counter value:</b>
          <div className='Hing'>{counter ?? 'Loading...'}</div>
        </div>

        <a onClick={() => showAlert()}> ALERT </a>

        {connected && (
          <div>
            <a onClick={() => sendIncrement()}>
              Inctement by 3
            </a>
            <br />
            <a onClick={() => sendDeposit()}>
              Request deposit of 1 TON
            </a>
            <br />
            <a onClick={() => sendWithdrawal()}>
              Request withdraw of 0.1 TON
            </a>
          </div>
        )}



      </div>
    </div>
  )
}

export default App
