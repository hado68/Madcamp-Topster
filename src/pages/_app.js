import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <script src="https://sdk.scdn.co/spotify-player.js"></script>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;