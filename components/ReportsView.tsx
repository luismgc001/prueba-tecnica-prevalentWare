import React from "react";
import { useQuery, gql } from "@apollo/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ReportBarChart from "./ReportBarChart";

const GET_REPORTS = gql`
  query GetReports {
    movements {
      id
      concept
      amount
      date
      user {
        name
      }
    }
  }
`;

const ReportsView = () => {
  const { data, loading, error } = useQuery(GET_REPORTS);
  const [selectedPeriod, setSelectedPeriod] = React.useState("monthly");

  if (loading) {
    return (
      <Card className="w-full h-96">
        <CardContent className="flex items-center justify-center h-full">
          Loading...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Error: {error.message}</AlertDescription>
      </Alert>
    );
  }

  const movements = data?.movements || [];
  console.log("MOVEMENTS", movements);
  const totalBalance = movements.reduce((acc, mov) => acc + mov.amount, 0);
  console.log("TOTALB", totalBalance);

  function getBalanceHistory(movements) {
    // Convertir la fecha de string a número y ordenar por fecha ascendente
    const sortedMovements = [...movements].sort(
      (a, b) => parseInt(a.date) - parseInt(b.date)
    );

    // Calcular el balance acumulado
    let balanceHistory = [];
    let currentBalance = 0;

    for (let movement of sortedMovements) {
      currentBalance += movement.amount;
      balanceHistory.push(currentBalance);
    }

    return balanceHistory;
  }
  console.log("HISTORIAL DE BALANCE: ", getBalanceHistory(movements));

  const processData = (movements) => {
    const groupedData = movements.reduce((acc, mov) => {
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
    }, {});

    return Object.values(groupedData).sort((a, b) =>
      a.period.localeCompare(b.period)
    );
  };

  const chartData = processData(movements);
  console.log("CHARTDATA", chartData);

  const downloadCSV = () => {
    const headers = ["Fecha", "Concepto", "Monto", "Usuario"];
    const csvData = movements.map((m) => [
      new Date(Number(m.date)).toLocaleDateString(),
      m.concept,
      m.amount,
      m.user?.name || "N/A",
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reportes Financieros</h1>
        <div className="flex gap-4 items-center">
          <Button onClick={downloadCSV} variant="secondary">
            Descargar CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Balance General</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {new Intl.NumberFormat("es-MX", {
              style: "currency",
              currency: "MXN",
            }).format(totalBalance)}
          </div>
        </CardContent>
      </Card>
      <ReportBarChart
        income={chartData[0]?.income || 0}
        expense={chartData[0]?.expenses || 0}
        balance={chartData[0]?.balance || 0}
      />

      {/* <Card>
        <CardHeader>
          <CardTitle>Movimientos Financieros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="period"
                  tickFormatter={(value) =>
                    selectedPeriod === "monthly"
                      ? value.split("-")[1] + "/" + value.split("-")[0]
                      : value
                  }
                />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    new Intl.NumberFormat("es-MX", {
                      style: "currency",
                      currency: "MXN",
                    }).format(value)
                  }
                />
                <Legend />
                <Bar dataKey="income" fill="#4CAF50" name="Ingresos" />
                <Bar dataKey="expenses" fill="#f44336" name="Egresos" />
                <Bar dataKey="balance" fill="#2196F3" name="Balance" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default ReportsView;
