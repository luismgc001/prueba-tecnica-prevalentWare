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

const ChartView = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Balance</CardTitle>
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
