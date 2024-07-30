import { TonConnectUIProvider } from '@tonconnect/ui-react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const manifestUrl = 'https://Mr-Dm1try.github.io/ton-lessons/tonconnect-manifest.json'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>
)
