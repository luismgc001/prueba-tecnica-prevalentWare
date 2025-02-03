export interface ChartData {
  dia: string;
  balance: number;
 }

 export interface ServerSideContext {
  req: any;  // Puedes ser más específico si conoces la estructura
  res: any;
  query: {
    [key: string]: string | string[];
  };
 }