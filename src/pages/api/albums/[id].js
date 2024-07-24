import { getToken } from 'next-auth/jwt';
import clientPromise from '../../../utils/mongodb';

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(req, res) {
  try {
    console.log('Request received:', req.method);

    const token = await getToken({ req, secret });

    if (!token) {
      console.error('Not authenticated');
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const userEmail = token.user.email;
    console.log('User Email:', userEmail);

    if (!userEmail) {
      console.error('User email is missing');
      return res.status(400).json({ message: 'User email is missing' });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection('users').findOne({ email: userEmail });
    if (!user) {
      console.error('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    const { id } = req.query;

    if (req.method === 'DELETE') {
      if (!id) {
        console.error('Album ID is missing');
        return res.status(400).json({ message: 'Album ID is missing' });
      }

      await db.collection('users').updateOne(
        { email: userEmail },
        { $pull: { albums: { id } } }
      );

      console.log('Album removed from user:', id);

      return res.status(200).json({ message: 'Album removed successfully' });
    } else {
      console.error('Method not allowed');
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
