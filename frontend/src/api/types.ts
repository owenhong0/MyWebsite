export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

export interface CreateUserInput {
  name: string;
  email: string;
  age: number;
}
