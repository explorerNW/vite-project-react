import { Button, notification } from "antd";
import { getChipInfo, getLightsStatus, IChipInfo, lightsDown, lightsUp } from "./device-control.api";
import { useEffect, useRef, useState } from "react";
import { json } from "react-router-dom";
import { useOnlineStatus } from "../utils";
import { LoadingOutlined } from '@ant-design/icons';

export const loader = async () => {
    return json({});
}

export const action = async () => {
    return json({});
}

export default function DeviceControl() {
    const [chipInfo, setChipInfo] = useState<IChipInfo>({} as IChipInfo);
    const [lightStatus, setLightStatus] = useState(false);
    const [changed, setChanged] = useState(false);
    const online = useOnlineStatus();
    const ref = useRef({ dataLoaded: false });
    const [loading, setLoading] = useState({ loadingChipInfo: false, loadingLightsStatus: false });
    const [notificationApi, contextHolder] = notification.useNotification();

    const fetchLightsStatus = async () => {
        setLoading((state) => {
            return {
                ...state,
                loadingLightsStatus: true
            }
        });
        const lightStatus = await getLightsStatus();
        setLightStatus(lightStatus === 1);
        setLoading((state) => {
            return {
                ...state,
                loadingLightsStatus: false
            }
        });
    }

    useEffect(() => {
        if (changed) {
            if (lightStatus) {
                lightsUp().then(() => {
                    setTimeout(() => {
                        setLoading((state) => {
                            return {
                                ...state,
                                loadingLightsStatus: false
                            }
                        });
                    }, 500);
                }).catch(() => {
                    setLoading((state) => {
                        return {
                            ...state,
                            loadingLightsStatus: false
                        }
                    });
                    notificationApi.info({
                        message: '服务器-api异常',
                        description: ''
                    });
                });
            } else {
                lightsDown().then(() => {
                    setTimeout(() => {
                        setLoading((state) => {
                            return {
                                ...state,
                                loadingLightsStatus: false
                            }
                        });
                    }, 500);
                }).catch(() => {
                    setLoading((state) => {
                        return {
                            ...state,
                            loadingLightsStatus: false
                        }
                    });
                    notificationApi.info({
                        message: '服务器-api异常',
                        description: ''
                    });
                });
            }
        }
        if (!ref.current.dataLoaded) {
            fetchLightsStatus();
            ref.current.dataLoaded = true;
        }
        return () => {

        }
    }, [lightStatus, online]);

    return (
        <>
            {contextHolder}
            <div>
                <span>{online ? "Online" : "Offline"}</span>
            </div>
            <Button onClick={async () => {
                if (loading.loadingChipInfo) {
                    return;
                }
                setLoading((state) => {
                    return {
                        ...state,
                        loadingChipInfo: true
                    }
                });
                const chipIfo = await getChipInfo().catch(()=>{
                    notificationApi.info({
                        message: '服务器-api异常',
                        description: ''
                    });

                    return {} as IChipInfo;
                });
                setChipInfo(() => chipIfo);
                setTimeout(() => {
                    setLoading((state) => {
                        return {
                            ...state,
                            loadingChipInfo: false
                        }
                    });
                }, 500);
            }
            }>fetch Chip Information</Button>
            {
                loading.loadingChipInfo ? <LoadingOutlined /> :
                    (
                        <div className="flex flex-col">
                            {
                                chipInfo && Object.keys(chipInfo).map((key, index) => {
                                    return (<span key={index}>{key}: {chipInfo[key]}</span>)
                                })
                            }
                        </div>
                    )
            }
            <div className="flex flex-col gap-2">
                <div>
                    {
                        <span>灯: {loading.loadingLightsStatus ? <LoadingOutlined /> : lightStatus ? '开' : '关'}</span>
                    }
                </div>
                <Button className="w-[4rem]" onClick={() => {
                    if (loading.loadingLightsStatus) {
                        return;
                    }
                    setLoading((state) => {
                        return {
                            ...state,
                            loadingLightsStatus: true
                        }
                    });
                    setLightStatus((light) => !light);
                    setChanged(true);
                }}>{lightStatus ? '关' : '开'} 灯</Button>
            </div>
        </>
    );
}