import { Button } from "antd";
import { useState } from "react";


export const loader = () => {
    return {};
}

type User = {
    name: string;
    age: number;
    income: number;
    [key: string]: string | number;
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
        name: 'Nie Wang',
        age: 29,
        income: 1000000
    } as User);
    const [pending, setPending] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [name, setName] = useState('');
    const [list, updateList] = useState<{id: number; name: string}[]>([]);
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
                    name: 'Nie Wang',
                    age: 28,
                    income: 1000000
                });

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
        </>
    );
}