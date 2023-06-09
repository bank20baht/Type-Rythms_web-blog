import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import NavbarComponent from '@/components/NavbarComponent'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <NavbarComponent/>
      <Component {...pageProps} />
    </SessionProvider>

  )
}