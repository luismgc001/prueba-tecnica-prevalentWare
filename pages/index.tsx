// File: /pages/index.js
import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";

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

    return {
      redirect: {
        destination: "/movements", // O la ruta principal para usuarios autenticados
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
  const { user } = useUser();
  console.log("USER: ", user);
  // const { data: session } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (!session) {
  //     signIn(); // Redirect to login if not authenticated
  //   }
  // }, [session, router]);

  // if (!session) return null; // Render nothing while redirecting
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
