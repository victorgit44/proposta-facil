import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'; // <-- 1. IMPORTE AQUI

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 👇 2. ENVOLVA O APP AQUI 👇 */}
    <AuthProvider>
      <App />
    </AuthProvider>
    {/* 👆 2. FIM DO AUTHPROVIDER 👆 */}
  </React.StrictMode>,
)