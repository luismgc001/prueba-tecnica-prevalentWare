import { render, screen } from "@testing-library/react";
import ChartView from "@/components/ChartView";
import "@testing-library/jest-dom";

// Mock de todos los componentes necesarios
jest.mock("recharts", () => ({
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Line: () => <div data-testid="line" />,
  LineChart: ({ children }: any) => (
    <div data-testid="line-chart">{children}</div>
  ),
  XAxis: () => <div data-testid="x-axis" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => (
    <div data-testid="responsive-container">{children}</div>
  ),
}));

// Mock de los componentes UI
jest.mock("@/components/ui/chart", () => ({
  ChartConfig: () => null,
  ChartContainer: ({ children }: any) => (
    <div data-testid="chart-container">{children}</div>
  ),
  ChartTooltip: () => <div data-testid="chart-tooltip" />,
  ChartTooltipContent: () => <div data-testid="chart-tooltip-content" />,
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: any) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardHeader: ({ children }: any) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: any) => (
    <div data-testid="card-title">{children}</div>
  ),
  CardDescription: ({ children }: any) => (
    <div data-testid="card-description">{children}</div>
  ),
}));

describe("ChartView", () => {
  const mockData = [
    { dia: "2024-02-01", balance: 1000 },
    { dia: "2024-02-02", balance: 1500 },
    { dia: "2024-02-03", balance: 1200 },
  ];

  it("renderiza el título y descripción correctamente", () => {
    render(<ChartView data={mockData} />);

    expect(screen.getByText("Historial del Balance")).toBeInTheDocument();
    expect(
      screen.getByText("Evolución del balance en el tiempo")
    ).toBeInTheDocument();
  });

  it("renderiza el gráfico con los datos proporcionados", () => {
    render(<ChartView data={mockData} />);

    // Verifica que los componentes principales estén presentes
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("chart-container")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });

  it("renderiza sin datos", () => {
    render(<ChartView data={[]} />);
    expect(screen.getByText("Historial del Balance")).toBeInTheDocument();
  });
});
