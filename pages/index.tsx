import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { ArrowRight, DollarSign, Users, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const usuario = user?.name;

  useEffect(() => {
    if (user && !isLoading) {
      router.push("/movements");
    }
  }, [user, isLoading, router]);

  // Si está cargando o el usuario está autenticado, no mostrar nada
  if (isLoading || user) {
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Fondo animado */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pizarra-950/20 via-pizarra-600/20 to-pizarra-100/20" />
        <div className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-900/30 via-purple-900/30 to-pink-900/30" />
      </div>

      {/* Contenido principal */}
      <div className="relative h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl text-center space-y-8">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-pizarra-400 animate-gradient">
            Sistema de Gestión Financiera
          </h1>

          {!user ? (
            <>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Una plataforma integral para la gestión de ingresos y egresos,
                administración de usuarios y generación de reportes detallados.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
                  <DollarSign className="w-12 h-12 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Control Financiero
                  </h3>
                  <p className="text-gray-400">
                    Gestiona tus ingresos y egresos.
                  </p>
                </div>

                <div className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
                  <Users className="w-12 h-12 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Gestión de Usuarios
                  </h3>
                  <p className="text-gray-400">
                    Administra roles y permisos de usuarios.
                  </p>
                </div>

                <div className="p-6 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700">
                  <BarChart3 className="w-12 h-12 text-indigo-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Reportes
                  </h3>
                  <p className="text-gray-400">
                    Visualiza y analiza datos con reportes personalizados.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <Link href="/api/auth/login">
                  <Button className="bg-gray-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg rounded-xl transition-all transform hover:scale-105">
                    Comenzar ahora
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="space-y-6 backdrop-blur-sm bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              <h2 className="text-3xl font-bold text-white">
                ¡Bienvenido de nuevo, {usuario}!
              </h2>
              <p className="text-gray-300">
                Continúa gestionando tus movimientos financieros y reportes.
              </p>
              <div className="flex gap-4">
                <Link href="/movements">
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                    Ir al Dashboard
                    <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <Link href="/api/auth/logout">
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cerrar Sesión
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
