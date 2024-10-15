import { Outlet, useNavigate } from 'react-router-dom';
import './home.scss';

export const loader = () => {
    return {};
}

const navList = ['/home'];
const homeNavList = ['upload-file', 'device-control',];

export default function Home() {
    const navigate = useNavigate();
    return (
        <>
            <div className="flex flex-col flex-l-1 w-full h-full bg-white">
                <div className='h-[2rem] leading-8 header bg-[#5e85c0]'>
                    <div className="flex items-center justify-between pr-4 text-white">
                        <ul className="flex gap-4 ml-[8rem]">
                            {
                                navList.map((path, index) => {
                                    return (
                                        <li className="cursor-pointer hover:text-[#eab308]" onClick={() => navigate(path)} key={index}>{path.toString().replace('/', '').trim()}</li>
                                    );
                                })
                            }
                        </ul>
                        <span className="cursor-pointer hover:text-[#eab308]" onClick={() => navigate('/login')}>logout</span>
                    </div>
                </div>
                <div className='flex-l-1 relative p-4'>
                    <div>
                        <ul className="flex gap-4 text-black">
                            {
                                homeNavList.map((path, index) => {
                                    return (
                                        <li className="cursor-pointer hover:text-[#eab308]" onClick={() => navigate(path)} key={index}>{path.toString().replace('/', '').trim()}</li>
                                    );
                                })
                            }
                        </ul>
                    </div>
                    <Outlet />
                </div>
                <div className='h-[2rem] leading-8 bg-[#5e85c0]'></div>
            </div>
        </>
    );
}