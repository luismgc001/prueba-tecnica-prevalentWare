"use client";

import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useQuery, gql } from "@apollo/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

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

const chartConfig = {
  balance: {
    label: "balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function ChartView() {
  const { data, loading, error } = useQuery(GET_REPORTS);
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

  function getBalanceHistory(movements) {
    // Crear una copia del arreglo para no modificar el original
    const sortedMovements = [...movements].sort(
      (a, b) => parseInt(a.date) - parseInt(b.date)
    );

    // Calcular el balance acumulado
    let balanceHistory = [];
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

  const movements = data?.movements || [];
  const chartData = getBalanceHistory(movements);
  console.log("chartData2", chartData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Movimientos</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={true} />
            <XAxis
              dataKey="dia"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tickFormatter={(value) => value.slice(5)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="balance"
              type="natural"
              stroke="var(--color-balance)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-balance)",
              }}
              activeDot={{
                r: 6,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ChartView;
