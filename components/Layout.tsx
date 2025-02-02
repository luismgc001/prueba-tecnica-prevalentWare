import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";

interface LayoutProps {
  children: React.ReactNode;
  role?: string;
}

export default function Layout({ children, role = "User" }: LayoutProps) {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Please login to continue</h1>
        <Link
          href="/api/auth/login"
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Login
        </Link>
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
            {role === "Admin" && (
              <>
                <li className="mb-4">
                  <Link href="/users">Usuarios</Link>
                </li>
                <li className="mb-4">
                  <Link href="/reports">Reportes</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        <Link
          href="/api/auth/logout"
          className="block mt-8 px-4 py-2 bg-red-500 text-white rounded-md text-center hover:bg-red-600"
        >
          Cerrar Sesión
        </Link>
      </aside>
      <main className="w-3/4 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
