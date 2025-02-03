import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import MovementsList from "@/components/MovementsList"; // Componente para listar movimientos
import AddMovement from "@/components/AddMovement"; // Componente para agregar movimiento
import { checkAuth } from "@/lib/authHelper";
import Layout from "@/components/Layout";
import { ServerSideContext } from "@/types/components";
import { MovementsProps } from "@/types/movement";

export async function getServerSideProps(context: ServerSideContext) {
  return checkAuth(context, { allowedRoles: ["Admin", "User"] });
}

export default function Movements({ role }: MovementsProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <Layout role={role}>
      <h2 className="text-2xl font-bold mb-4">Gestión de Movimientos</h2>
      {showModal && <AddMovement onClose={async () => setShowModal(false)} />}
      <MovementsList role={role} />

      <Toaster />
    </Layout>
  );
}
