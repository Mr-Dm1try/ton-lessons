import { TonConnectUIProvider } from '@tonconnect/ui-react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const manifestUrl = 'https://raw.githubusercontent.com/markokhman/func-course-chapter-5-code/master/public/manifest.json'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>
)
