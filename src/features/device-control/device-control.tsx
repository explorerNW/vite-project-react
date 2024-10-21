import { Button } from "antd";
import { getChipInfo, IChipInfo, lightsDown, lightsUp } from "./device-control.api";
import { useState } from "react";

export const loader = () => {
    return {};
}

export default function DeviceControl() {
    const [chipInfo, setChipInfo] = useState<IChipInfo>({} as IChipInfo);
    return (
        <>
            <h2>device control</h2>
            <Button onClick={ async () => { const chipIfo = await getChipInfo(); setChipInfo(()=>chipIfo) } }>fetch Chip Information</Button>
            <div className="flex flex-col">
                {
                    Object.keys(chipInfo).map((key, index)=>{
                        return (<span key={index}>{key}: { chipInfo[key] }</span>)
                    })
                }
            </div>
            <div className="flex gap-2">
                <Button onClick={() => { lightsUp() }}>lights Up</Button>
                <Button onClick={() => { lightsDown() }}>lights DOWN</Button>
            </div>
        </>
    );
}