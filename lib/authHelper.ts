// utils/authHelper.ts
import { PrismaClient } from "@prisma/client";
import { getSession } from "@auth0/nextjs-auth0";

const prisma = new PrismaClient();

interface AuthOptions {
  requireAdmin?: boolean;
  allowedRoles?: string[];
}

export async function checkAuth(context: any, options: AuthOptions = {}) {
  try {
    const session = await getSession(context.req, context.res);

    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    const id = session.user.sub;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!user) {
      return {
        redirect: {
          destination: "/unauthorized",
          permanent: false,
        },
      };
    }

    // Si se requiere rol de Admin
    if (options.requireAdmin && user.role !== "Admin") {
      return {
        redirect: {
          destination: "/unauthorized",
          permanent: false,
        },
      };
    }

    // Si hay roles específicos permitidos
    if (options.allowedRoles && !options.allowedRoles.includes(user.role)) {
      return {
        redirect: {
          destination: "/unauthorized",
          permanent: false,
        },
      };
    }

    return {
      props: {
        role: user.role,
      },
    };
  } catch (error) {
    return {
      props: {
        error: "Error de conexión con la base de datos. Por favor intente más tarde.",
      },
    };
  }
}