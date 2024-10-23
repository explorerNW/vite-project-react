import { useState } from "react";
export const loader = () => {
    return {};
}

export default function UploadFile() {
    const [list, updateList] = useState<{ id: number; name: string }[]>([]);

    return (
        <>
            <div>
                <ul className="flex gap-2">
                    {
                        list.map((item, index) => {
                            return (
                                <li key={index} className="flex items-center justify-center">
                                    <span>{item.id}-{item.name}</span>
                                    <span className="icon-[material-symbols--close] cursor-pointer relative top-[2px]" style={{ color: "#bcbcbc" }} onClick={() => { updateList(() => list.filter(({ id }) => id !== item.id)) }} ></span>
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        </>
    );
}