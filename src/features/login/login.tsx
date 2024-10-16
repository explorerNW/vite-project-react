
import SliderCaptcha from 'rc-slider-captcha';
import './login.scss';
import ImageBg from '../../assets/1bg@2x.7146d57f.jpg';
import ImagePuzzle from '../../assets/1puzzle@2x.png';
import { SetStateAction, useState } from 'react';
import { ActionFunctionArgs, Form, json, redirect, useActionData, useSubmit } from 'react-router-dom';
import { Button } from 'antd';

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    if (data.name === 'admin' && data.password === 'admin@me') {
        return redirect('/home');
    } else {
        return json({ error: { password: "password not correct" } });
    }
}

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
    const submit = useSubmit();
    const res = useActionData() as { error: { name: string; password: string } };
    return (
        <>
            <Form>
                <div className="login bg-white flex flex-col w-3/5 rounded-[3px] gap-2 p-2 shadow-inner max-w-xs">
                    <div className='flex flex-row items-center gap-1'>
                        <img src="/icon-cloud-home.svg" width="48px" height="48px"></img>
                        <span className='text-[#5e85c0] text-3xl'>欢迎登陆</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className='flex flex-col'>
                            <div className="field flex gap-1 w-full">
                                <span className='icon-[mdi--user] text-[2rem]' style={{ color: "#bcbcbc" }}></span>
                                <input className='w-full' placeholder='请输入账号名称/手机号码' name='name' value={name} onChange={(event) => { setName(event.target.value); }} />
                            </div>
                            <span className="text-red-500 float-left w-full">{res?.error?.name}</span>
                        </div>
                        <div className='flex flex-col'>
                            <div className="field gap-1 w-full">
                                <span className="icon-[mdi--password] text-[2rem]" style={{ color: "#bcbcbc" }}></span>
                                <input className='w-full' type="password" placeholder='请输入密码' name='password' value={password} onChange={(event) => { setPassword(event.target.value); }} />
                            </div>
                            <span className="text-red-500 float-left w-full">{res?.error?.password}</span>
                        </div>
                    </div>
                    <div>
                        <Button type="primary" className="float-end bg-[#5f85c1]" onClick={() => { loginCheck(name, password, setShowSlicderCaptcha); }}>登录</Button>
                    </div>
                </div>
            </Form>
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
                                if (result) {
                                    setShowSlicderCaptcha(false);
                                    submit({ name, password }, { method: "post", action: "/login" });
                                    setPassword('');
                                }
                                return result;
                            }}
                        />
                    </div>
                ) : (<></>)
            }
        </>
    );
}