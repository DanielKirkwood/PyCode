import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import NavBar from '@/components/NavBar'
import { IconContext } from 'react-icons'

import '../styles/globals.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/material.css'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <SessionProvider session={session} refetchInterval={5 * 60}>
        <IconContext.Provider value={{ style: { verticalAlign: 'middle', display: 'inline-block' } }}>
          <NavBar />
          <Component {...pageProps} />
        </IconContext.Provider>
      </SessionProvider>
    </>
  )
}
export default MyApp
