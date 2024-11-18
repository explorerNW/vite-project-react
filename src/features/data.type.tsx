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

export type TCreateUser = Pick<
  User,
  'firstName' | 'lastName' | 'sex' | 'email' | 'age' | 'salary' | 'password'
>;

export type TUpdateUser = Pick<
  User,
  'id' | 'firstName' | 'lastName' | 'age' | 'salary'
>;

export type TDeleteUser = Pick<User, 'id'>;
