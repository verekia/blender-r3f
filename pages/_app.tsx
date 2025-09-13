import type { AppProps } from 'next/app'

import '@/global.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const glbWatcherClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={glbWatcherClient}>
    <Component {...pageProps} />
  </QueryClientProvider>
)

export default App
