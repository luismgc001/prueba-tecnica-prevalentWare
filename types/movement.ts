export interface Movement {
    id: string;
    concept: string;
    amount: number;
    date: string;
    user: {
      id: string;
      name: string;
    };
  }

  export interface MovementsListProps {
    role: 'Admin' | 'User';  // O los roles específicos que uses
   }

  export interface MovementsProps {
    role: "Admin" | "User";
   }