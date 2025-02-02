import { useState } from "react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@auth0/nextjs-auth0";
import { Toaster } from "@/components/ui/toaster";
import MovementsList from "@/components/MovementsList"; // Componente para listar movimientos
import AddMovement from "@/components/AddMovement"; // Componente para agregar movimiento
import { toast } from "@/hooks/use-toast";

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  try {
    const session = await getSession(context.req, context.res);

    if (!session) {
      return {
        redirect: {
          destination: "/main",
          permanent: false,
        },
      };
    }

    const id = session.user.sub;
    // Buscar el rol en la base de datos
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

    // Comparar roles usando strings o el enum definido manualmente

    if (!["Admin", "User"].includes(user.role)) {
      throw new Error("Invalid role");
    }

    return {
      props: {
        role: user.role,
      },
    };
  } catch (error) {
    return {
      props: {
        error:
          "Error de conexión con la base de datos. Por favor intente más tarde.",
      },
    };
  }
}

export default function Movements({ role }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex h-screen">
      <aside className="w-1/4 bg-gray-100 p-4">
        <Link
          href="/api/auth/logout"
          className="block mt-8 px-4 py-2 bg-red-500 text-white rounded-md text-center hover:bg-red-600"
        >
          Cerrar Sesión
        </Link>
        <h1 className="mb-8 text-xl font-bold">LOGO</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/movements">Ingresos y egresos</Link>
            </li>

            {role === "Admin" && (
              <>
                <li className="mb-4">
                  <Link href="/users">Usuarios</Link>
                </li>

                <li>
                  <Link href="/reports">Reportes</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>

      <main className="w-3/4 p-8">
        <h2 className="text-2xl font-bold mb-4">Gestión de Movimientos</h2>

        {/* Modal para agregar movimiento */}

        {showModal && <AddMovement onClose={() => setShowModal(false)} />}

        {/* Lista de movimientos */}

        <MovementsList />

        {/* Botón para mostrar el formulario de agregar movimiento */}
        {role === "Admin" && (
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
            onClick={() => setShowModal(true)}
          >
            Nuevo Movimiento
          </button>
        )}
      </main>

      <Toaster />
    </div>
  );
}
