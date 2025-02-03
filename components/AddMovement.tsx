import { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useToast } from "@/hooks/use-toast";
import { GET_MOVEMENTS } from "./MovementsList";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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
  const [isSaving, setIsSaving] = useState(false);

  const [createMovement] = useMutation(CREATE_MOVEMENT, {
    refetchQueries: [{ query: GET_MOVEMENTS }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast({
        title: "¡Éxito!",
        description: "Movimiento creado correctamente",
        variant: "default",
        className: "success",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        className: "error",
        duration: 3000,
        variant: "destructive",
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
    setIsSaving(true);
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
      });
      setConcept("Ingreso");
      setAmount("");
      setDate("");
      setError("");
      onClose();
      setIsSaving(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        className: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-900 text-gray-100">
        <DialogHeader>
          <DialogTitle>Nuevo Movimiento</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Tipo de Movimiento</Label>
            <Select value={concept} onValueChange={setConcept}>
              <SelectTrigger className="bg-gray-800 border-gray-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 font-bold text-white">
                <SelectItem value="Ingreso">Ingreso</SelectItem>
                <SelectItem value="Egreso">Egreso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Monto</Label>
            <Input
              type="number"
              value={amount}
              onChange={handleAmountChange}
              min="1"
              step="1"
              required
              placeholder="0"
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
              className="bg-gray-800 border-gray-700"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-900 bg-gray-400 hover:bg-gray-200 text-white"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!!error || isSaving}
              className="bg-sky-700 hover:bg-sky-400 "
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
