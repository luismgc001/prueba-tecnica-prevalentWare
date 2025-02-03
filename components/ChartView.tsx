"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
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
  balance: {
    label: "balance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;
import { ChartData } from "@/types/components";

const ChartView: React.FC<{ data: ChartData[] }> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial del Balance</CardTitle>
        <CardDescription>Evolución del balance en el tiempo</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={data} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="dia"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                // Extraer mes y día del formato YYYY-MM-DD
                const [year, month, day] = value.split("-");
                return `${month}-${day}`;
              }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              dataKey="balance"
              type="natural"
              strokeWidth={2}
              dot={{ fill: "var(--color-balance)" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ChartView;
