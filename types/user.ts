export interface User {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    user?: {
      id?: string;
      name?: string;
      nickname?: string;
      picture?: string;
    };
  }

  export interface SelectedUser extends Pick<User, 'id' | 'name' | 'role'> {}