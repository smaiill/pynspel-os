'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'
import 'react-loading-skeleton/dist/skeleton.css'
import { RecoilRoot } from 'recoil'
import { AppProvider } from './AppProvider'
import './fonts.css'
import './global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <Head>
        <title>Pynspel</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <QueryClientProvider client={queryClient}>
          <RecoilRoot>
            <AppProvider>{children}</AppProvider>
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </RecoilRoot>
        </QueryClientProvider>
      </body>
    </html>
  )
}
