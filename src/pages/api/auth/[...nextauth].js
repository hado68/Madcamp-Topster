import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import clientPromise from '../../../utils/mongodb';

async function refreshAccessToken(token) {
  try {
    const url = "https://accounts.spotify.com/api/token";
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing access token', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export default NextAuth({
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: "https://accounts.spotify.com/authorize?scope=user-read-email,user-read-private,streaming,user-modify-playback-state",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      const client = await clientPromise;
      const db = client.db();

      if (account) {
        try {
          const existingUser = await db.collection('users').findOne({ email: profile.email });
          const userId = existingUser ? existingUser._id : null;

          if (!existingUser) {
            await db.collection('users').insertOne({
              email: profile.email,
              name: profile.display_name || profile.name, 
              image: profile.images?.[0]?.url || profile.picture || '', 
              createdAt: new Date(),
              albums: [],
            });
          }

          return {
            accessToken: account.access_token,
            accessTokenExpires: Date.now() + account.expires_in * 1000,
            refreshToken: account.refresh_token,
            user: {
              email: profile.email,
              name: profile.display_name || profile.name, 
              image: profile.images?.[0]?.url || profile.picture || '', 
            },
          };
        } catch (error) {
          console.error('Error during user lookup or creation:', error);
          throw new Error('Error during user lookup or creation');
        }
      }

      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});
