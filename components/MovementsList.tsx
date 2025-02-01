import { useQuery, gql } from "@apollo/client";

export const GET_MOVEMENTS = gql`
  query GetMovements {
    movements {
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

export default function MovementsList() {
  const { data, loading, error } = useQuery(GET_MOVEMENTS);

  console.log("DATA MOV LIST", data);

  if (loading) return <p>Loading...</p>;
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
    </div>
  );
}
