"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts";

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

const chartConfig = {
  cantidad: {
    label: "Cantidad: ",
  },
  ingresos: {
    label: "Ingresos",
    color: "hsl(var(--chart-2))",
  },
  egresos: {
    label: "Egresos",
    color: "hsl(var(--chart-1))",
  },
  balance: {
    label: "Balance",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function ReportBarChart({
  income,
  expense,
  balance,
}: {
  income: number;
  expense: number;
  balance: number;
}) {
  const chartData = [
    {
      concepto: "ingresos",
      cantidad: income,
      fill: "var(--color-ingresos)",
    },
    {
      concepto: "egresos",
      cantidad: expense,
      fill: "var(--color-egresos)",
    },
    {
      concepto: "balance",
      cantidad: balance,
      fill: "var(--color-balance)",
    },
  ];
  console.log("REPORTCHART: ", chartData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos Financieros.</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="concepto"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="cantidad"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
