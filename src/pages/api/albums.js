import { getToken } from 'next-auth/jwt';
import clientPromise from '../../utils/mongodb';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  try {
    console.log('Request received:', req.method);

    const token = await getToken({ req, secret });
    console.log('Token:', token); // 토큰 구조 확인

    if (req.method !== 'POST') {
      console.error('Method not allowed');
      return res.status(405).json({ message: 'Method not allowed' });
    }

    if (!token) {
      console.error('Not authenticated');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const accessToken = token.accessToken;
    console.log('Access token:', accessToken);

    if (!accessToken) {
      console.error('No access token available');
      return res.status(401).json({ message: 'No access token available' });
    }

    const { album } = req.body;
    console.log('Album received:', album);

    if (!album || !album.id) {
      console.error('Invalid album data');
      return res.status(400).json({ message: 'Invalid album data' });
    }

    const client = await clientPromise;
    const db = client.db();

    const userEmail = token.user.email;
    console.log('User Email:', userEmail);

    if (!userEmail) {
      console.error('User email is missing');
      return res.status(400).json({ message: 'User email is missing' });
    }

    const user = await db.collection('users').findOne({ email: userEmail });
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);

    await db.collection('users').updateOne(
      { email: userEmail },
      { $push: { albums: album.id } }
    );

    console.log('Album added to user:', album.id);

    return res.status(200).json({ message: 'Album added successfully' });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
