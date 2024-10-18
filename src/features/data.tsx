export type User = {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    fullName: string;
    age: number;
    sex: 'male' | 'female';
    income: number;
    [key: string]: string | number;
};

export const currentUser = {
    id: null,
    firstName: null,
    middleName: null,
    lastName: null,
    age: null,
    sex: 'male',
    income: 1000000
};