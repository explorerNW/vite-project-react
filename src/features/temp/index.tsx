import { FormEvent, forwardRef, memo, ReactNode, Suspense, useCallback, useDeferredValue, useEffect, useId, useImperativeHandle, useInsertionEffect, useMemo, useRef, useState, useTransition } from 'react';
import { findItemOfSum, addTowNumbers } from '../algorithm/algorithm';
import { ListNode, lengthOfLongestSubstring } from '../algorithm/data-structure';
import { Tooltip, useCSS } from '../utils';
import { Button } from 'antd';
import { getChipInfo } from '../device-control/device-control.api';

export const loader = () => {
    return {};
}

const Input = forwardRef(function Input(props: { value: string, placeholder: string, onChange: (e: { target: { value: string } }) => void }, ref) {
    const inputRef = useRef(null);
    useImperativeHandle(ref, () => {
        return {
            focus() {
                if (inputRef.current) {
                    (inputRef.current as HTMLElement).focus();
                    (inputRef.current as HTMLElement).scrollIntoView();
                }
            }
        }
    });
    return (<input {...props} ref={inputRef} />);
});

const Search = memo(forwardRef(function Search(props: { search: string }, ref) {
    const [list, setList] = useState<{ index: number; value: string }[]>([]);
    const $ref = useRef<{ fetching: boolean }>({ fetching: false });

    useEffect(() => {
        if (!$ref.current.fetching && props.search) {
            const fetch = async () => {
                $ref.current.fetching = true;
                await getChipInfo();
                $ref.current.fetching = false;
                setList(() => {
                    return Array(100).fill(true).map((item, index) => {
                        return {
                            index,
                            value: `item:${index}`
                        };
                    });
                });
            }
            fetch();
        }
    }, [props.search]);

    useImperativeHandle(ref, () => {
        return {
            focus() {

            }
        }
    });

    const filterList = useMemo(() => {
        console.log(list);
        return list.filter(item => item.value.toLowerCase().includes(props.search.toLowerCase().trim()));
    }, [list]);
    if (!props.search) {
        return <></>;
    }
    return (
        <>
            <Suspense fallback={<>Loading...</>} >
                <div className="flex flex-col max-h-[10rem] overflow-auto">
                    {
                        filterList.map((item, index) => {
                            return <span key={index}>{item.value}</span>
                        })
                    }
                </div>
            </Suspense>
        </>
    );
})
);

const List = forwardRef(function List(props: { children: ReactNode }, ref) {
    const divRef = useRef(null);
    useImperativeHandle(ref, () => {
        return {
            scrollToBottom() {
                if (divRef.current) {
                    (divRef.current as HTMLElement).scrollTop = (divRef.current as HTMLElement).scrollHeight;
                }
            }
        }
    }, []);
    return (
        <div ref={divRef} className="flex flex-col max-h-[10rem] overflow-scroll">
            {props.children}
        </div>
    );
});

const FormSubmit = memo(function FormSubmit({ theme }: { theme: string; }) {
    const [message, setMessage] = useState('');
    const [list, setList] = useState<string[]>([]);
    const submitHandler = useCallback(
        async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const field = Object.fromEntries(formData) as { message: string; };
            setMessage('');
            if (field.message) {
                setList((list) => [...list, field.message]);
            }
        },
        []);

    return (
        <>
            <form onSubmit={submitHandler} className={theme}>
                <input value={message} name="message" onChange={(e) => setMessage(e.target.value)} />
                <button type="submit" className="theme-background-color">submit</button>
            </form>
            <div className="flex flex-col gap-2">
                {
                    list.map((item, index) => {
                        return (
                            <span key={index}>item: {item}</span>
                        )
                    })
                }
            </div>
        </>
    );
});

export default function Temp() {
    const target = 199;
    const source = [100, 200, 2, 3, 400, -1];
    const result = findItemOfSum(source, target);
    const numb1 = '12345678987654321';
    const numb2 = '987654321';
    const passwordHint = useId();
    const containerRef = useRef(null);
    const [position, setPosition] = useState<{ x: number, y: number } | null>(null);
    const [message, setMessage] = useState('');
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<{ focus: () => void }>(null);
    const listRef = useRef<{ scrollToBottom: () => void }>(null);
    const [theme, setTheme] = useState('light');
    const messageDeferred = useDeferredValue(message);

    useEffect(() => {
        const list: ListNode = (new ListNode).of(numb2.split('').map(item => Number(item))) as ListNode;
        console.log(list);
        lengthOfLongestSubstring('abcabcdd');
    }, []);

    useInsertionEffect(() => {
        document.documentElement.style.setProperty('--background-color-theme', theme === 'dark' ? '#000' : '#5f85c1');
    }, [theme]);

    return (
        <>
            <div className="flex flex-col">
                <span>source: {source.join(' ,')}</span>
                <span>target: {target}</span>
                <span>result: {result.length ? result.map((value) => value.join(' + ')).join(' , ') : 'none'} = {target}</span>
            </div>
            <div className="flex flex-col">
                <span>add two numbers: {numb1} + {numb2}</span>
                <span>result: {addTowNumbers(numb1, numb2)}</span>
            </div>
            <div id={passwordHint} className={useCSS('red') + " relative border"} ref={containerRef}
                onMouseEnter={() => {
                    if (containerRef.current) {
                        const { bottom } = (containerRef.current as HTMLElement).getBoundingClientRect();
                        setPosition({ x: 0, y: bottom });
                    }
                }}
                onMouseLeave={() => {
                    setPosition(null);
                }}
            >
                useInsertionEffect
                {
                    position !== null && <Tooltip position={position}> <span>hello</span> </Tooltip>
                }
            </div>
            <div className="flex flex-col">
                <span>isPending: {isPending ? 'true' : 'false'}</span>
                <div className="flex">
                    <Button type="primary" onClick={() => {
                        startTransition(() => {
                            setMessage(() => {
                                return '';
                            });
                        });
                        if (inputRef.current) {
                            inputRef.current.focus();
                        }
                        if (listRef.current) {
                            listRef.current.scrollToBottom();
                        }
                    }} loading={isPending} className="theme-background-color" >send</Button>
                </div>
            </div>
            <Button type="primary" onClick={() => {
                setTheme(theme => theme === 'dark' ? 'light' : 'dark');
            }} className="theme-background-color" >theme: {theme}</Button>
            <Input placeholder="Please input..." value={message} onChange={(e) => { setMessage(e?.target?.value) }} ref={inputRef} />
            <Search search={messageDeferred} />
            <List ref={listRef}>
                {
                    Array(100).fill(true).map((item, index) => {
                        return (
                            <span key={index}>{index}</span>
                        );
                    })
                }
            </List>
            <FormSubmit theme={theme} />
        </>
    );
}