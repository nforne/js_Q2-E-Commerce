import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider } from "./contexts/ThemeContext.jsx";
import "./styles/globals.css";
import "./styles/theme.css";
import './styles/index.css'
import './styles/App.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  </StrictMode>,
);