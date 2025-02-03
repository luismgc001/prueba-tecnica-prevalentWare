export interface LayoutProps {
    children: React.ReactNode;
    role?: 'Admin' | 'User';
  }

  export type UserData = {
    nickname?: string,
    name?: string,
    picture?: string
  } | unknown