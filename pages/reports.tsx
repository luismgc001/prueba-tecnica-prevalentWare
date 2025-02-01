import { getSession } from "@auth0/nextjs-auth0";
import { PrismaClient } from "@prisma/client";
import ReportsView from "@/components/ReportsView";
import Chart from "@/components/Chart";
import Link from "next/link";

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
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
}

export default function Reports() {
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
      <main className="w-3/4 overflow-y-auto">
        <ReportsView />
        <Chart />
      </main>
    </div>
  );
}
