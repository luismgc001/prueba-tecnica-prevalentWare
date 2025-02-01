import { getSession } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import ReportsView from "@/components/ReportsView";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ChartView from "@/components/ChartView";
import Link from "next/link";

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
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });

    if (!user || user.role !== "Admin") {
      return {
        redirect: {
          destination: "/unauthorized",
          permanent: false,
        },
      };
    }

    return {
      props: {},
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

export default function Reports({ error }) {
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  return (
    <div className="flex h-screen">
      <aside className="w-1/4 bg-gray-100 p-4">
        <h1 className="mb-8 text-xl font-bold">LOGO</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/movements">Ingresos y egresos</Link>
            </li>
            <li className="mb-4">
              <Link href="/users">Usuarios</Link>
            </li>
            <li>
              <Link href="/reports">Reportes</Link>
            </li>
          </ul>
        </nav>
        <Link
          href="/api/auth/logout"
          className="block mt-8 px-4 py-2 bg-red-500 text-white rounded-md text-center hover:bg-red-600"
        >
          Cerrar Sesión
        </Link>
      </aside>
      <main className="w-3/4 overflow-y-auto p-6">
        <div className="grid grid-cols-2 gap-6">
          <ReportsView />
          <div className="flex flex-col">
            <ChartView />
          </div>
        </div>
      </main>
    </div>
  );
}
