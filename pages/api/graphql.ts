// pages/api/graphql.ts
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { typeDefs, resolvers } from './schema';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';

interface MyContext {
  user?: {
    id: string;
    role: string;
    email: string;
  };
}

const server = new ApolloServer<MyContext>({
  typeDefs,
  resolvers,
});

export default startServerAndCreateNextHandler(server, {
  context: async (req, res) => {
    try {
      // Usar getSession en lugar de decodificar el token manualmente
      const session = await getSession(req, res);
      
      if (!session || !session.user) {
        console.log('No session found');
        throw new Error('Authentication required');
      }
      // Obtener el email del usuario desde la sesión
      const userId = session.user.sub;
      
      if (!userId) {
        console.log('No Id found in session');
        throw new Error('Invalid session data');
      }

      // Buscar el usuario en la base de datos
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {id: true, name: true, role: true, email: true },
      });

      if (!user) {
        console.log('User not found in database:', userId);
        throw new Error('User not found');
      }

      return { user };
    } catch (error) {
      console.error('Context error:', error);
      throw new Error('Authentication required');
    }
  }
});