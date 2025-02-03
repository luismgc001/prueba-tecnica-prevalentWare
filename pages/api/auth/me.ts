import { getSession } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';

interface ExtendedNextApiRequest extends NextApiRequest {
 user?: {
   sub: string;
   name: string;
   nickname: string;
   picture: string;
 }
}

export default async function handler(req: ExtendedNextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    
    if (!session) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    return res.status(200).json({
      accessToken: session.accessToken, // Token de acceso para Apollo Client
      ...session.user, // Información del usuario
    });
  } catch (error) {
    console.error('Error en /api/auth/me:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
