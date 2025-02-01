import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useToast } from "@/hooks/use-toast";
import { GET_MOVEMENTS } from "./MovementsList";

const CREATE_MOVEMENT = gql`
  mutation CreateMovement($concept: String!, $amount: Float!, $date: String!) {
    createMovement(concept: $concept, amount: $amount, date: $date) {
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

export default function AddMovement({ onClose }) {
  const { toast } = useToast();
  const [concept, setConcept] = useState("Ingreso");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  const [createMovement] = useMutation(CREATE_MOVEMENT, {
    refetchQueries: [{ query: GET_MOVEMENTS }],
    awaitRefetchQueries: true,
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        className: "error",
        duration: 3000,
        position: "top-center",
      });
    },
  });

  const validateAmount = (value) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setError("El monto debe ser un número válido");
      return false;
    }
    if (numValue <= 0) {
      setError("El monto debe ser mayor a 0");
      return false;
    }
    if (numValue > 1000000000) {
      setError("El monto no puede ser mayor a 1,000,000,000");
      return false;
    }
    if (value.includes(".")) {
      setError("El monto debe ser un número entero");
      return false;
    }
    setError("");
    return true;
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    validateAmount(value);
  };

  const handleSave = async () => {
    try {
      if (!concept || !amount || !date) {
        setError("Todos los campos son obligatorios");
        return;
      }

      if (!validateAmount(amount)) {
        return;
      }

      // Validar que la fecha sea válida
      const selectedDate = new Date(date);
      if (isNaN(selectedDate.getTime())) {
        setError("Fecha inválida");
        return;
      }

      if (selectedDate > new Date()) {
        setError("La fecha no puede ser futura");
        return;
      }

      await createMovement({
        variables: {
          concept,
          amount: parseInt(amount) * (concept === "Egreso" ? -1 : 1),
          date: date,
        },
      });

      toast({
        title: "¡Éxito!",
        description: "Movimiento creado correctamente",
        className: "success",
        duration: 3000,
        position: "top-center",
      });
      setConcept("Ingreso");
      setAmount("");
      setDate("");
      setError("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        className: "error",
        duration: 3000,
        position: "top-center",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-md shadow-lg p-8 w-1/2">
        <h2 className="text-xl font-bold mb-4">Nuevo Movimiento</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Tipo de Movimiento
            </label>
            <select
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Monto
            </label>
            <input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              min="1"
              step="1" // Cambiado a 1 para solo permitir enteros
              required
              placeholder="0"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              max={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2 hover:bg-gray-400"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={!!error}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
