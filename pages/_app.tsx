import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import NavBar from '@/components/NavBar'

import 'antd/dist/antd.css'
import '../styles/globals.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <NavBar />
        <Component {...pageProps} />
      </SessionProvider>
    </>
  )
}
export default MyApp
