import { toast } from "@/hooks/use-toast";
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";

export default function MainPage() {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-8">Bienvenido a la Aplicación</h1>
      <p className="text-lg mb-4 text-center">
        Explora las funcionalidades de nuestra plataforma. Para acceder a la
        gestión de usuarios, reportes, y más, por favor inicia sesión.
      </p>
      {user ? (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user.name}!</h1>
          <Link
            href="/movements"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/api/auth/logout"
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Logout
          </Link>
        </div>
      ) : (
        <Link
          href="/api/auth/login"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Iniciar Sesión
        </Link>
      )}
    </div>
  );
}
