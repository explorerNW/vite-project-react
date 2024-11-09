export type User = {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  email: string;
  isActive: boolean;
  age: number;
  sex: 'male' | 'female';
  income: number;
  [key: string]: string | number | boolean;
};
