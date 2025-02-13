import { instance } from '../login/login.api';

export interface IChipInfo {
  chipId: string;
  cores: string;
  model: string;
  [key: string]: string;
}

export const lightsUp = async () => {
  return await instance.post('/iot/lights-up').catch(e => {
    console.error(e);
  });
};

export const lightsDown = async () => {
  return await instance.post('/iot/lights-down').catch(e => {
    console.error(e);
  });
};

export const getChipInfo = async (): Promise<IChipInfo> => {
  return (
    await instance.get('/iot/chip-info').catch(e => {
      console.error(e);
    })
  )?.data?.chip_info;
};

export const getLightsStatus = async () => {
  return (
    await instance.post('/iot/light-status').catch(e => {
      console.error(e);
    })
  )?.data?.lights_up;
};
