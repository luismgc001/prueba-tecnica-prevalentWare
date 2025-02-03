import { handleAuth, handleCallback, getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

interface ExtendedNextApiRequest extends NextApiRequest {
 user?: {
   sub: string;
   name: string;
   nickname: string;
   picture: string;
 }
}

export default handleAuth({
  async callback(req: ExtendedNextApiRequest, res: NextApiResponse) {
    try {
      await handleCallback(req, res);
      const session = await getSession(req, res);
            
      if (!session || !session.user) {
        throw new Error('No user session found');
      }

      const user = session.user;

      await prisma.user.upsert({
        where: { id: user.sub },
        update: {},
        create: {
          id: user.sub,
          email: user.name || null,
          name: user.nickname,
          image: user.picture,
          role: "User",
        }
      });

      return session;
    } catch (error) {
      console.error('Authentication callback error:', error);
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
});