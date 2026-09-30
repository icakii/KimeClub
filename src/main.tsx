import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'
import { AuthProvider } from './hooks/useAuth.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    // 'offlineFirst' still lets the fetch through to the service worker even
    // when the browser reports offline, so a StaleWhileRevalidate cache hit
    // (see vite.config.ts) can resolve the query with last-known data.
    queries: { networkMode: 'offlineFirst' },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
