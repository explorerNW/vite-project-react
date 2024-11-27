import { Button, notification } from 'antd';
import {
  getChipInfo,
  getLightsStatus,
  IChipInfo,
  lightsDown,
  lightsUp,
} from './device-control.api';
import { useEffect, useRef, useState } from 'react';
import { SSE, useOnlineStatus } from '../utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRequest, useUpdateEffect } from 'ahooks';
import { SSE_URL } from '../users-manage/user-apis';
import socketIO, { sendToRMQ } from '../socket.io';
import { devicePageLoader } from '../../loader';
import { devicePageAction } from '../../action';

export const loader = devicePageLoader;

export const action = devicePageAction;

export default function DeviceControl() {
  const [chipInfo, setChipInfo] = useState<IChipInfo>({} as IChipInfo);
  const [lightStatus, setLightStatus] = useState(false);
  const online = useOnlineStatus();
  const [notificationApi, contextHolder] = notification.useNotification();
  const ref = useRef<{ mounted: boolean }>({ mounted: false });
  const { loading: loagingChipInfo, refresh } = useRequest(getChipInfo, {
    loadingDelay: 200,
    debounceWait: 200,
    manual: true,
    onSuccess: chipIfo => {
      setChipInfo(() => chipIfo);
    },
    onError: () => {
      notificationApi.info({
        message: '服务器-api异常',
        description: '',
      });
    },
  });

  useEffect(() => {
    loadingLightsStatusAction();
  }, []);

  const [message, setMessage] = useState('');
  const { runAsync: sentToRMQ } = useRequest(sendToRMQ, {
    manual: true,
    debounceWait: 200,
  });

  useEffect(() => {
    if (!ref.current.mounted) {
      const sse = new SSE(`${SSE_URL}/message`);
      sse.onMessage(() => {
        sse.sse.close();
      });
      socketIO.connect();
      socketIO.on('connect', () => {
        console.log('socker connect');
      });
      socketIO.on('channel-0', (data: { data: string }) => {
        notificationApi.info({
          message: data.data,
          description: 'channel-0',
        });
      });
      socketIO.on('to-client', (data: { data: string }) => {
        notificationApi.info({
          message: data.data,
          description: 'socket-message',
        });
      });
      socketIO.on('exception', (data: { data: string }) => {
        console.log('event', data);
      });
      socketIO.on('disconnect', function () {
        console.log('Disconnected');
      });
      ref.current.mounted = true;
    }
  }, []);

  const { loading: loadingLightsStatus, run: loadingLightsStatusAction } =
    useRequest(getLightsStatus, {
      manual: true,
      onError: () => {
        notificationApi.info({
          message: '服务器-api异常',
          description: '',
        });
      },
      onSuccess: res => {
        setLightStatus(res === 1);
      },
    });

  const {
    loading: loadingLightsUp,
    run: lightsUpAction,
    error: lightsUpError,
  } = useRequest(lightsUp, {
    manual: true,
    debounceWait: 200,
    loadingDelay: 200,
  });
  const {
    loading: loadingLightsDown,
    run: lightsDownAction,
    error: lightsDownError,
  } = useRequest(lightsDown, {
    manual: true,
    debounceWait: 200,
    loadingDelay: 200,
  });

  useUpdateEffect(() => {
    if (lightStatus) {
      lightsUpAction();
    } else {
      lightsDownAction();
    }
    if (lightsUpError || lightsDownError) {
      notificationApi.info({
        message: '服务器-api异常',
        description: (lightsUpError || lightsDownError)?.message,
      });
    }
  }, [lightStatus]);

  return (
    <>
      {contextHolder}
      <div>
        <span>{online ? 'Online' : 'Offline'}</span>
      </div>
      <div>
        <Button
          onClick={async () => {
            if (loagingChipInfo) {
              return;
            }
            refresh();
          }}
        >
          fetch Chip Information
        </Button>
        {loagingChipInfo ? (
          <LoadingOutlined />
        ) : (
          <div className='flex flex-col'>
            {chipInfo &&
              Object.keys(chipInfo).map((key, index) => {
                return (
                  <span key={index}>
                    {key}: {chipInfo[key]}
                  </span>
                );
              })}
          </div>
        )}
      </div>
      <div className='flex flex-col gap-2'>
        <div>
          {
            <span>
              灯:{' '}
              {loadingLightsUp || loadingLightsDown || loadingLightsStatus ? (
                <LoadingOutlined />
              ) : lightStatus ? (
                '开'
              ) : (
                '关'
              )}
            </span>
          }
        </div>
        <Button
          className='w-[4rem]'
          onClick={() => {
            setLightStatus(status => !status);
          }}
        >
          {lightStatus ? '关' : '开'} 灯
        </Button>
      </div>
      <div className='flex flex-col gap-4'>
        <div className='flex gap-4'>
          <Button
            onClick={() => {
              socketIO.emit('events');
            }}
          >
            receive server message
          </Button>
          <Button
            onClick={() => {
              socketIO.emit('stop-interval');
            }}
          >
            stop server interval
          </Button>
        </div>
        <div className='flex gap-2'>
          <input
            className='border'
            value={message}
            onChange={e => {
              setMessage(e.target.value);
            }}
          />
          <Button
            onClick={() => {
              if (message) {
                setMessage('');
                sentToRMQ({ channel: 'channel-0', data: message });
              }
            }}
          >
            send
          </Button>
        </div>
      </div>
    </>
  );
}
