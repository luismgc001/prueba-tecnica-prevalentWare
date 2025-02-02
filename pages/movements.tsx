import { useState } from "react";
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@auth0/nextjs-auth0";
import { Toaster } from "@/components/ui/toaster";
import MovementsList from "@/components/MovementsList"; // Componente para listar movimientos
import AddMovement from "@/components/AddMovement"; // Componente para agregar movimiento
import { checkAuth } from "@/lib/authHelper";
import { toast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";

const prisma = new PrismaClient();

export async function getServerSideProps(context) {
  return checkAuth(context, { allowedRoles: ["Admin", "User"] });
}

export default function Movements({ role }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <Layout role={role}>
      <h2 className="text-2xl font-bold mb-4">Gestión de Movimientos</h2>
      {showModal && <AddMovement onClose={() => setShowModal(false)} />}
      <MovementsList />
      {role === "Admin" && (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
          onClick={() => setShowModal(true)}
        >
          Nuevo Movimiento
        </button>
      )}
      <Toaster />
    </Layout>
  );
}
