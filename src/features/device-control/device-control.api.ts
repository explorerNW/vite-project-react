import { instance } from "../login/login.api";

export interface IChipInfo {
    chipId: string;
    cores: string;
    model: string;
    [key: string]: string;
}

export const lightsUp = async () => {
    return await instance.post('/iot/lights-up');
}

export const lightsDown = async () => {
    return await instance.post('/iot/lights-down');
}

export const getChipInfo = async ():Promise<IChipInfo> => {
    return (await instance.get('/iot/chip-info')).data.chip_info;
}