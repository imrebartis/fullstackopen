import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App'
import { NotificationContextProvider } from './NotificationContext'
import { LoginContextProvider } from './LoginContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles'
const queryClient = new QueryClient()
const theme = createTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <NotificationContextProvider>
    <LoginContextProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </LoginContextProvider>
  </NotificationContextProvider>
)
