import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';
import { Role } from '@/lib/enums';

const prisma = new PrismaClient();

export const createContext = async (req, res) => {
  // Obtener la sesión desde Auth0
  const session = await getSession(req, res);

  if (!session) {
    throw new Error('No authenticated session');
  }

  const email = session.name.email;
  // Obtener el usuario desde la base de datos
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, role: true }, // Seleccionamos solo id y role
  });

  if (!user) {
    throw new Error('User not found in the database');
  }

  // Validar el rol
  if (![Role.Admin, Role.User].includes(user.role)) {
    throw new Error('Invalid role');
  }



  return { user }; // Contexto con la información del usuario

};
