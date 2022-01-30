import { SessionProvider } from 'next-auth/react'

const wrapWithSession = (session, component) => {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60}>
      {component}
    </SessionProvider>
  )
}

export default wrapWithSession
