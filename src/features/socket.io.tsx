import { io } from 'socket.io-client';
import { instance } from './login/login.api';

const socketIO = io('s0.v100.vip:16220');

export const sendToRMQ = async (message: {
  channel: string;
  data: string;
}): Promise<{ message_send: boolean }> =>
  await instance.post('micro-service/message-rmq', {
    message: { channel: message.channel, data: message.data },
  });

export default socketIO;
