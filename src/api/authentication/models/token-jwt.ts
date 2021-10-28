export interface Token {
  email: string;
  name: string;
  lastName: string;
  username: string;
  type: string;
  role: Role | null;
}

export interface Role {
  name: string;
  description: string;
}
