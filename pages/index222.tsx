import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSession } from "@auth0/nextjs-auth0";

export async function getServerSideProps(context) {
  try {
    const session = await getSession(context.req, context.res);
    console.log("SESSION: ", session);

    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      redirect: {
        destination: "/movements",
        permanent: false,
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

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login"); // Redirección usando Next.js router
    }
  }, [isLoading, user, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return null; // Evitar el renderizado mientras redirige

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
      </aside>
      <main className="w-3/4 p-8">
        <h2 className="text-2xl font-bold">
          Sistema de gestión de ingresos y gastos
        </h2>
        <div className="grid grid-cols-3 gap-4 mt-8">
          <Link
            href="/movements"
            className="p-4 bg-gray-200 text-center rounded-md shadow-md hover:bg-gray-300"
          >
            Sistema de gestión de ingresos y gastos
          </Link>
          <Link
            href="/users"
            className="p-4 bg-gray-200 text-center rounded-md shadow-md hover:bg-gray-300"
          >
            Gestión de usuarios
          </Link>
          <Link
            href="/reports"
            className="p-4 bg-gray-200 text-center rounded-md shadow-md hover:bg-gray-300"
          >
            Reportes
          </Link>
        </div>
      </main>
    </div>
  );
}
