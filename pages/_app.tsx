import type { AppProps } from 'next/app'

import '@/global.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { glbWatcherClient } from '@/lib/react-query'

const App = ({ Component, pageProps }: AppProps) => (
  <QueryClientProvider client={glbWatcherClient}>
    <Component {...pageProps} />
  </QueryClientProvider>
)

export default App
