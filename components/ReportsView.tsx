import React, { useEffect, useState } from "react";
import { useQuery, gql } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReportBarChart from "./ReportBarChart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ChartView from "./ChartView";
import LoadingSpinner from "./LoadingSpinner";
import {
  Movement,
  ChartDataPoint,
  GetReportsData,
  AccumulatorType,
  Totals,
  BalanceHistoryPoint,
} from "@/types/ReportsView";
import { User } from "@/types/user";

const GET_REPORTS = gql`
  query GetReports($userId: ID) {
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
const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
    }
  }
`;

const ReportsView = () => {
  const [selectedPeriod, setSelectedPeriod] = React.useState<
    "monthly" | "yearly"
  >("monthly");
  const { data: userData } = useQuery(GET_USERS);
  const { data: currentUserData } = useQuery(gql`
    query GetCurrentUser {
      currentUser {
        id
        name
      }
    }
  `);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    currentUserData?.currentUser?.id || null
  );
  const { data, loading, error } = useQuery<GetReportsData>(GET_REPORTS, {
    variables: { userId: selectedUserId },
  });
  useEffect(() => {
    if (currentUserData?.currentUser?.id) {
      setSelectedUserId(currentUserData.currentUser.id);
    }
  }, [currentUserData]);

  if (loading) return <LoadingSpinner />;
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error: {error.message}</AlertDescription>
      </Alert>
    );
  }

  const movements = data?.movements || [];
  const totalBalance = movements.reduce((acc, mov) => acc + mov.amount, 0);

  const processData = (movements: Movement[]): ChartDataPoint[] => {
    const groupedData: AccumulatorType = movements.reduce(
      (acc: AccumulatorType = {}, mov) => {
        const date = new Date(Number(mov.date));
        const key =
          selectedPeriod === "monthly"
            ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
                2,
                "0"
              )}`
            : date.getFullYear().toString();

        if (!acc[key]) {
          acc[key] = {
            period: key,
            income: 0,
            expenses: 0,
            balance: 0,
          };
        }

        if (mov.amount > 0) {
          acc[key].income += mov.amount;
        } else {
          acc[key].expenses += Math.abs(mov.amount);
        }
        acc[key].balance = acc[key].income - acc[key].expenses;

        return acc;
      },
      {}
    );

    return Object.values(groupedData).sort((a, b) =>
      a.period.localeCompare(b.period)
    );
  };

  const chartData = processData(movements);

  const downloadCSV = (): void => {
    const headers = ["Fecha", "Concepto", "Monto", "Usuario"];
    const csvData = movements.map((movement) => [
      new Date(Number(movement.date)).toLocaleDateString(),
      movement.concept,
      movement.amount,
      movement.user?.name || "N/A",
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_financiero_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };
  const getTotals = (movements: Movement[]): Totals => {
    const totals = movements.reduce(
      (acc, mov) => {
        if (mov.amount > 0) {
          acc.income += mov.amount;
        } else {
          acc.expenses += Math.abs(mov.amount);
        }
        acc.balance = acc.income - acc.expenses;
        return acc;
      },
      { income: 0, expenses: 0, balance: 0 }
    );

    return totals;
  };
  const totals = getTotals(movements);
  function getBalanceHistory(movements: Movement[]): BalanceHistoryPoint[] {
    // Crear una copia del arreglo para no modificar el original
    const sortedMovements = [...movements].sort(
      (a, b) => parseInt(a.date) - parseInt(b.date)
    );

    // Calcular el balance acumulado
    let balanceHistory: BalanceHistoryPoint[] = [];
    let currentBalance = 0;

    for (let movement of sortedMovements) {
      currentBalance += movement.amount;

      // Convertir la fecha en milisegundos a una fecha legible
      const date = new Date(parseInt(movement.date))
        .toISOString()
        .split("T")[0];

      // Guardar el balance junto con la fecha
      balanceHistory.push({
        dia: date,
        balance: currentBalance,
      });
    }

    return balanceHistory;
  }

  const userMovements = getBalanceHistory(movements);

  return (
    <div>
      <div className="space-y-6">
        {/* Filtros */}
        <div className="flex gap-4 items-center">
          <Select
            value={selectedUserId || ""}
            onValueChange={setSelectedUserId}
            defaultValue=""
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar usuario" />
            </SelectTrigger>
            <SelectContent>
              {userData?.users.map((user: User) => (
                <SelectItem key={user.id} value={user.id || ""}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={downloadCSV} variant="secondary">
            Descargar CSV
          </Button>
        </div>

        {/* Grid para balances */}
        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Balance General</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Ingresos</p>
                  <div className="text-xl font-bold text-green-500">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(totals.income)}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Gastos</p>
                  <div className="text-xl font-bold text-red-500">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(totals.expenses)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Balance Total</p>
                  <div className="text-xl font-bold">
                    {new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(totalBalance)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Grid para gráficas */}
        <div className="grid grid-cols-2 gap-6">
          <ReportBarChart
            income={totals.income || 0}
            expense={totals.expenses || 0}
            balance={totals.balance || 0}
          />
          <div className="flex flex-col">
            <ChartView data={userMovements} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;
