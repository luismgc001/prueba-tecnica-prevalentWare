import { useQuery, gql } from "@apollo/client";
import LoadingSpinner from "./LoadingSpinner";
import { useState } from "react";

export const GET_MOVEMENTS = gql`
  query GetMovements($userId: ID) {
    movements(userId: $userId) {
      id
      concept
      amount
      date
      user {
        id
        name
      }
    }
  }
`;

export default function MovementsList({ role }) {
  const [showModal, setShowModal] = useState(false);
  const { data: userData } = useQuery(gql`
    query GetCurrentUser {
      currentUser {
        id
      }
    }
  `);

  const { data, loading, error } = useQuery(GET_MOVEMENTS, {
    variables: { userId: userData?.currentUser?.id },
    pollInterval: 1000,
  });
  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error.message}</p>;

  // Función para formatear montos como moneda entera
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Función para formatear fechas desde timestamp
  const formatDate = (dateString) => {
    const timestamp = Number(dateString);
    const date = new Date(timestamp);

    // Ajustar para evitar diferencias por zona horaria
    const year = date.getUTCFullYear();
    const month = date.toLocaleString("es-MX", {
      month: "long",
      timeZone: "UTC",
    });
    const day = date.getUTCDate();

    return `${day} de ${month} de ${year}`;
  };

  return (
    <div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Usuario</th>

            <th className="border border-gray-300 px-4 py-2">Monto</th>
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {data.movements.map((movement) => (
            <tr key={movement.id}>
              <td className="border border-gray-300 px-4 py-2">
                {movement.user?.name || "Sin usuario"}
              </td>

              <td
                className={`border border-gray-300 px-4 py-2 font-medium ${
                  movement.amount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {formatCurrency(Math.abs(movement.amount))}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {formatDate(movement.date)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-100">
          <tr>
            <td className="border border-gray-300 px-4 py-2 font-bold">
              Total
            </td>
            <td
              className={`border border-gray-300 px-4 py-2 font-bold ${
                data.movements.reduce((sum, mov) => sum + mov.amount, 0) >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(
                data.movements.reduce((sum, mov) => sum + mov.amount, 0)
              )}
            </td>
            <td className="border border-gray-300 px-4 py-2"></td>
            <td className="border border-gray-300 px-4 py-2"></td>
          </tr>
        </tfoot>
      </table>
      {role === "Admin" && (
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
          onClick={() => setShowModal(true)}
        >
          Nuevo Movimiento
        </button>
      )}
    </div>
  );
}
