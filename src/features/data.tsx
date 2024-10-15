export type User = {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
    age: number;
    sex: 'male' | 'female';
    income: number;
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