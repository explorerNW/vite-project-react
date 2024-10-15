
import SliderCaptcha from 'rc-slider-captcha';
import './login.scss';
import ImageBg from '../../assets/1bg@2x.7146d57f.jpg';
import ImagePuzzle from '../../assets/1puzzle@2x.png';
import { SetStateAction, useState } from 'react';

const verifyCaptcha = async (data: { x: number }) => {
    if (data?.x && data.x > 87 && data.x < 93) {
        return Promise.resolve(true);
    }
    return Promise.reject(false);
};

const loginCheck = (name: string, password: string, setShowSlicderCaptcha: { (value: SetStateAction<boolean>): void; (arg0: boolean): void; }) => {
    if (name && password) {
        setShowSlicderCaptcha(true);
    }
}

export function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showSlicderCaptcha, setShowSlicderCaptcha] = useState(false);
    return (
        <>
            <div className="login bg-white flex flex-col w-3/5 rounded-[3px] gap-2 p-2 shadow-inner max-w-xs">
                <div className='flex flex-row items-center gap-1'>
                    <img src="/icon-cloud-home.svg" width="48px" height="48px"></img>
                    <span className='text-[#5e85c0] text-3xl'>欢迎登陆</span>
                </div>
                <div className='field'>
                    <span className='icon-[mdi--user] text-[2rem]' style={{ color: "#bcbcbc" }}></span>
                    <input className='w-full' placeholder='请输入账号名称/手机号码' value={name} onChange={(event) => { setName(event.target.value) }} />
                </div>
                <div className='field'>
                    <span className="icon-[mdi--password] text-[2rem]" style={{ color: "#bcbcbc" }}></span>
                    <input className='w-full' type="password" placeholder='请输入密码' value={password} onChange={(event) => { setPassword(event.target.value) }} />
                </div>
                <div>
                    <button type="button" className="float-end" onClick={() => loginCheck(name, password, setShowSlicderCaptcha)}>登录</button>
                </div>
            </div>
            {
                    showSlicderCaptcha ? (
                        <div className="slider-capt-cha" style={{ display: showSlicderCaptcha ? 'block' : 'none' }}>
                            <div className="back-drop"></div>
                            <SliderCaptcha
                                request={async () => {
                                    return {
                                        bgUrl: ImageBg,
                                        puzzleUrl: ImagePuzzle
                                    };
                                }}
                                onVerify={async (data) => {
                                    const result = await verifyCaptcha(data);
                                    setTimeout(() => {
                                        if (result) {
                                            setShowSlicderCaptcha(false);
                                        }
                                    }, 500);
                                    return result;
                                }}
                            />
                        </div>
                    ) : (<></>)
                }
        </>
    );
}