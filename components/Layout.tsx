import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

interface LayoutProps {
  children: React.ReactNode;
  role?: string;
}

export default function Layout({ children, role = "User" }: LayoutProps) {
  const { user } = useUser();
  const pathname = usePathname();

  // Función para determinar si un enlace está activo
  const isActivePath = (path: string) => {
    return pathname === path;
  };

  // Componente NavLink para mantener consistencia en los estilos
  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    const isActive = isActivePath(href);
    return (
      <Link
        href={href}
        className={`block py-2 px-4 rounded-md transition-colors relative ${
          isActive
            ? "bg-indigo-600 text-white"
            : "hover:bg-gray-700 hover:text-indigo-400"
        }`}
      >
        <div className="flex items-center">
          {isActive && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-white rounded-r-full" />
          )}
          <span className={`${isActive ? "ml-3" : ""}`}>{children}</span>
        </div>
      </Link>
    );
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Please login to continue</h1>
        <Link
          href="/api/auth/login"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6">
          <div className="mb-8 p-2 rounded-md">
            <Image
              src="https://www.prevalentware.com/wp-content/uploads/2024/07/logo-prevalentware.png"
              alt="Prevalentware Logo"
              width={150}
              height={40}
              className="w-full h-auto"
              priority
            />
          </div>
          <nav>
            <ul className="space-y-4">
              <li>
                <NavLink href="/movements">Ingresos y egresos</NavLink>
              </li>
              {role === "Admin" && (
                <>
                  <li>
                    <NavLink href="/users">Usuarios</NavLink>
                  </li>
                  <li>
                    <NavLink href="/reports">Reportes</NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <Link
            href="/api/auth/logout"
            className="block mt-8 w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md text-center transition-colors"
          >
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-900 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-400">
            <span className="text-white font-medium">
              {pathname === "/movements" && "Ingresos y egresos"}
              {pathname === "/users" && "Usuarios"}
              {pathname === "/reports" && "Reportes"}
            </span>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
