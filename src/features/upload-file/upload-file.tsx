import { Button } from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decreament, increament } from "../../redux/counter-slice";
import { logout } from "../../redux/user-login";
import { getCurrentUser } from "../login/login.api";
import { User } from "../data";
import { cleanStorage } from "../login/login";
import { useNavigate } from "react-router-dom";

export const loader = () => {
    return {};
}

const timeout = (ms: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

const clickHandler = async (pending: number, setPending: React.Dispatch<React.SetStateAction<number>>, completed: number, setCompleted: React.Dispatch<React.SetStateAction<number>>) => {
    setPending(pending + 1);
    await timeout(3000);
    setPending(pending - 1);
    setCompleted(completed + 1);

}

export default function UploadFile() {
    const [obj, setObj] = useState({
        firstName: 'Nie',
        lastName: 'Wang',
        fullName: 'Nie Wang',
        age: 29,
        income: 1000000
    } as User);
    const [pending, setPending] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [name, setName] = useState('');
    const [list, updateList] = useState<{id: number; name: string}[]>([]);
    const count = useSelector((state: { counter: {value: number} }) => state.counter.value);
    const userId = useSelector((state: { login: { currentUser: User } }) => state.login.currentUser.id);
    const dispatch = useDispatch();
    const [countDown, setcountDown] = useState(5);
    const [currentUser, setCurrentUser] = useState<User>({} as User);
    const navigate = useNavigate();

    const Counter = () => {
        return (
            <>
                <div className="flex items-center gap-2">
                    <Button type="primary" onClick={()=>dispatch(decreament())} >-</Button>
                    <span>{count}</span>
                    <Button type="primary" onClick={()=>dispatch(increament())} >+</Button>
                </div>
            </>
        );
    };

    return (
        <>
            <h2>UploadFile</h2>
            <div>
                {
                    Object.keys(obj).map((key, index) => {
                        return (
                            <span key={index}>{key}: {obj[key]}</span>
                        );
                    })
                }
                <br />
                <span>name: {obj.name}</span>
                <span>age: {obj.age}</span>
                <span>income: {obj.income}</span>
            </div>
            <Button onClick={() => {
                setObj({
                    firstName: 'Nie',
                    lastName: 'Wang',
                    fullName: 'Nie Wang',
                    age: 29,
                    income: 1000000
                } as User);

                setTimeout(() => {
                    console.log(obj);
                }, 3000)
            }} >update</Button>

            <div className="flex flex-col">
                <span>pending: {pending}</span>
                <span onClick={async () => {
                    await clickHandler(pending, setPending, completed, setCompleted)
                }}>completed: {completed}</span>
            </div>
            <div>
                <div className="flex gap-2">
                    <div className="border">
                        <input value={name} onChange={(e)=>setName(e.target.value)}></input>
                    </div>
                    <Button type="primary" onClick={()=>{ if(!name) { return; } updateList(()=>[...list, { id: list.length, name }]); setName('') }}>Add</Button>
                </div>
                <ul className="flex gap-2">
                    {
                        list.map((item, index)=>{
                            return (
                                <li key={index} className="flex items-center justify-center">
                                    <span>{item.id}-{item.name}</span>
                                    <span className="icon-[material-symbols--close] cursor-pointer relative top-[2px]" style={{color: "#bcbcbc"}} onClick={()=>{ updateList(()=> list.filter(({id}) => id !== item.id)) }} ></span>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
            <div className="mt-2">
                    <Counter />
            </div>
            <div>
                <Button onClick={() => {
                    const intervalue = setInterval(()=>{
                        setcountDown((value) => {
                            if (value < 2) {
                                clearInterval(intervalue);
                                dispatch(logout());
                                cleanStorage();
                                navigate("/login");
                            }
                            return value - 1;
                        });
                    }, 1000);
                }
                }>logout {countDown}s</Button>
            </div>
            <div>
                <Button onClick={ async ()=> { const user = await getCurrentUser(userId); setCurrentUser(user); }}>getCurrentUser</Button>
                <ul>
                    {
                        Object.keys(currentUser).map((field, key)=>{
                            return <li key={key}>{field}: { currentUser[field] }</li>
                        })
                    }
                </ul>
            </div>
        </>
    );
}