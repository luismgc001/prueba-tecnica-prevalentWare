import { getSession } from '@auth0/nextjs-auth0';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Role } from '@/lib/enums';
import { prisma } from '@/lib/prisma';

type User = {
  id: string;
  role: Role;
}

type Context = {
  user: User;
}

export const createContext = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<Context> => {
  // Obtener la sesión desde Auth0
  const session = await getSession(req, res);

  if (!session || !session.user?.email) {
    throw new Error('No authenticated session');
  }

  const email = session.user.email;
  
  // Obtener el usuario desde la base de datos
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true },
  }) as User | null;

  if (!user) {
    throw new Error('User not found in the database');
  }

  // Validar el rol
  if (user.role !== Role.Admin && user.role !== Role.User) {
    throw new Error('Invalid role');
  }

  return { user };
};