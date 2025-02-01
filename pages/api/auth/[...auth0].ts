import { handleAuth, handleCallback, getSession } from '@auth0/nextjs-auth0';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default handleAuth({
  async callback(req, res) {
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