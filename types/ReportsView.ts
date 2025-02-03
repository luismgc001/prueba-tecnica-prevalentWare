export interface User {
    id: string;
    name: string;
  }
  
  export interface Movement {
    id: string;
    concept: string;
    amount: number;
    date: string;
    user?: User;
  }
  
  export interface ChartDataPoint {
    period: string;
    income: number;
    expenses: number;
    balance: number;
  }
  
  export interface Totals {
    income: number;
    expenses: number;
    balance: number;
  }
  
  export interface BalanceHistoryPoint {
    dia: string;
    balance: number;
  }
  
  // Types para las respuestas de GraphQL
  export interface GetReportsData {
    movements: Movement[];
  }
  
  export interface GetUsersData {
    users: User[];
  }
  
  export interface GetCurrentUserData {
    currentUser: User;
  }
  
  // Props de los componentes
  export interface ReportBarChartProps {
    income: number;
    expense: number;
    balance: number;
  }
  
  export interface ChartViewProps {
    data: BalanceHistoryPoint[];
  }

 export interface AccumulatorType {
    [key: string]: ChartDataPoint;
  }