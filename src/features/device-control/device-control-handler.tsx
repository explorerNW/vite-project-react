import useRequest from 'ahooks/lib/useRequest';
import { useCallback, useState } from 'react';
import { apollo } from '../../apollo';
import { GET_USER } from '../../apollo.gql';
import { ApolloError } from '@apollo/client/errors';
import { NotificationInstance } from 'antd/es/notification/interface';
import { getChipInfo, getLightsStatus, IChipInfo } from './device-control.api';

export const useApolloFetchUser = () => {
  const [data, setData] = useState<{ name: string }>({ name: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApolloError>();
  apollo.useQuery<{ getUser: { name: string } }>(GET_USER, {
    fetchPolicy: 'cache-first',
    defaultOptions: {
      context: { headers: { admin: true } },
      refetchWritePolicy: 'overwrite',
    },
    onCompleted: data => {
      setData(user => {
        return { ...user, name: data.getUser.name };
      });
      setLoading(false);
    },
    onError: e => {
      setError(e);
    },
  });
  return { data, loading, error };
};

export const useRequestChipInfo = (notificationApi: NotificationInstance) => {
  const [chipInfo, setChipInfo] = useState<IChipInfo>({} as IChipInfo);
  const { loading, refresh } = useRequest(getChipInfo, {
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

  return { chipInfo, loadingChipInfo: loading, refresh };
};

export const useFetchLightStatus = (notificationApi: NotificationInstance) => {
  const [lightStatus, setLightStatus] = useState(false);
  const { loading, run } = useRequest(getLightsStatus, {
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

  const toggle = useCallback(() => {
    return setLightStatus(status => !status);
  }, []);

  return { lightStatus, toggle, loading, loadingLightsStatusAction: run };
};
