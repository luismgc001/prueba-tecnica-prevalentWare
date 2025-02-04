import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/prisma';
import { Movement } from '@prisma/client';

interface CreateMovementBody {
  concept: string;
  amount: string | number;
  date: string;
}

type ApiResponse<T> = {
  error?: string;
} & Partial<T>;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Movement>>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const session = await getSession(req, res);

  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { concept, amount, date } = req.body as CreateMovementBody;

  if (!concept || !amount || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const email = session.user?.email;

    if (!email) {
      return res.status(400).json({ error: 'User email not found in session' });
    }

    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Crear movimiento
    const movement = await prisma.movement.create({
      data: {
        concept,
        amount: parseFloat(amount.toString()),
        date: new Date(date),
        userId: user.id,
      },
    });

    return res.status(201).json(movement);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}