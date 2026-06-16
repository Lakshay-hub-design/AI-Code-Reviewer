import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app/store/store.js'
import SocketProvider from './shared/providers/SocketProvider.jsx'
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <BrowserRouter>
        <SocketProvider>
          <App />
        </SocketProvider>
      </BrowserRouter>
  </Provider>
)
