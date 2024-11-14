import { Button, notification } from 'antd';
import {
  getChipInfo,
  getLightsStatus,
  IChipInfo,
  lightsDown,
  lightsUp,
} from './device-control.api';
import { useEffect, useState } from 'react';
import { json } from 'react-router-dom';
import { interval, useOnlineStatus } from '../utils';
import { LoadingOutlined } from '@ant-design/icons';
import { useRequest, useUpdateEffect } from 'ahooks';

export const loader = async () => {
  return json({});
};

export const action = async () => {
  return json({});
};

export default function DeviceControl() {
  const [chipInfo, setChipInfo] = useState<IChipInfo>({} as IChipInfo);
  const [lightStatus, setLightStatus] = useState(false);
  const online = useOnlineStatus();
  const [notificationApi, contextHolder] = notification.useNotification();
  const [count, setCount] = useState(0);
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
      <div className='flex items-center gap-4'>
        count: {count}
        <button
          onClick={() => {
            interval(1000, () => setCount(count => count + 1));
          }}
        >
          start
        </button>
      </div>
    </>
  );
}
