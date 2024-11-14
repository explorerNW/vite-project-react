export type User = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  isActive: boolean;
  age: number;
  sex: 'male' | 'female';
  salary: string;
  [key: string]: string | number | boolean;
};

export type TCreateUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type TUpdateUser = {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  salary: string;
};
