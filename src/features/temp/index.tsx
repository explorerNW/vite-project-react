import {
    FormEvent,
    forwardRef,
    memo,
    ReactNode,
    Suspense,
    useCallback,
    useDeferredValue,
    useEffect,
    useId,
    useImperativeHandle,
    useInsertionEffect,
    useMemo,
    useRef,
    useState,
    useTransition,
} from 'react';
import {
    findItemOfSum,
    addTowNumbers,
    maxLenghtOfOne,
    moveZero,
    removeDuplicate,
} from '../algorithm/algorithm';
import {
    AVLTree,
    BinaryTree,
    DoubleLinkedList,
    LinkedList,
    Tree,
    TreeNode,
} from '../algorithm/data-structure';
import { Tooltip, useCSS } from '../utils';
import { Button } from 'antd';
import { getChipInfo } from '../device-control/device-control.api';
import { useLocalStorageState } from 'ahooks';

export const loader = () => {
    return {};
};

const Input = forwardRef(function Input(
    props: {
        value: string;
        placeholder: string;
        onChange: (e: { target: { value: string } }) => void;
    },
    ref
) {
    const inputRef = useRef(null);
    useImperativeHandle(ref, () => {
        return {
            focus() {
                if (inputRef.current) {
                    (inputRef.current as HTMLElement).focus();
                    (inputRef.current as HTMLElement).scrollIntoView();
                }
            },
        };
    });
    return <input {...props} ref={inputRef} />;
});

const Search = memo(
    forwardRef(function Search(props: { search: string }, ref) {
        const [list, setList] = useState<{ index: number; value: string }[]>(
            []
        );
        const $ref = useRef<{ fetching: boolean }>({ fetching: false });

        useEffect(() => {
            if (!$ref.current.fetching && props.search) {
                const fetch = async () => {
                    $ref.current.fetching = true;
                    await getChipInfo();
                    $ref.current.fetching = false;
                    setList(() => {
                        return Array(100)
                            .fill(true)
                            .map((item, index) => {
                                return {
                                    index,
                                    value: `${item}item:${index}`,
                                };
                            });
                    });
                };
                fetch();
            }
        }, [props.search]);

        useImperativeHandle(ref, () => {
            return {
                focus() {},
            };
        });

        const filterList = useMemo(() => {
            return list.filter(item =>
                item.value
                    .toLowerCase()
                    .includes(props.search.toLowerCase().trim())
            );
        }, [list]);
        if (!props.search) {
            return <></>;
        }
        return (
            <>
                <Suspense fallback={<>Loading...</>}>
                    <div className='flex flex-col max-h-[10rem] overflow-auto'>
                        {filterList.map((item, index) => {
                            return <span key={index}>{item.value}</span>;
                        })}
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
                    (divRef.current as HTMLElement).scrollTop = (
                        divRef.current as HTMLElement
                    ).scrollHeight;
                }
            },
        };
    }, []);
    return (
        <div
            ref={divRef}
            className='flex flex-col max-h-[10rem] overflow-scroll'
        >
            {props.children}
        </div>
    );
});

const FormSubmit = memo(function FormSubmit({ theme }: { theme: string }) {
    const [message, setMessage] = useState('');
    const [list, setList] = useState<string[]>([]);
    const submitHandler = useCallback(async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const field = Object.fromEntries(formData) as { message: string };
        setMessage('');
        if (field.message) {
            setList(list => [...list, field.message]);
        }
    }, []);

    return (
        <>
            <form onSubmit={submitHandler} className={theme}>
                <input
                    value={message}
                    name='message'
                    onChange={e => setMessage(e.target.value)}
                />
                <button type='submit' className='theme-background-color'>
                    submit
                </button>
            </form>
            <div className='flex flex-col gap-2'>
                {list.map((item, index) => {
                    return <span key={index}>item: {item}</span>;
                })}
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
    const [position, setPosition] = useState<{ x: number; y: number } | null>(
        null
    );
    const [message, setMessage] = useState('');
    const [messageAsync, setMessageAsync] = useState('');
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<{ focus: () => void }>(null);
    const listRef = useRef<{ scrollToBottom: () => void }>(null);
    const [theme, setTheme] = useState('light');
    const messageDeferred = useDeferredValue(message);
    const setMessageAsyncHandler = useCallback(
        async (message: string) => {
            setMessageAsync(
                await new Promise(resolve => {
                    setTimeout(() => {
                        resolve(message);
                    }, 1000);
                })
            );
        },
        [message]
    );

    const [messageInStorage, setMessageInStorage] = useLocalStorageState(
        'messageInStorage',
        { defaultValue: '' }
    );
    const [messageInStorage2, setMessageInStorage2] = useLocalStorageState(
        'messageInStorage2',
        { defaultValue: '' }
    );

    useEffect(() => {
        const linkedList = new LinkedList<number>();
        numb2.split('').forEach(item => {
            linkedList.insertToTail(Number(item));
        });
        linkedList.insertToSpecificPostion(5, 5);
        linkedList.removeSpecificPosition(10);
        console.log(linkedList);

        const doubleLinkedList = new DoubleLinkedList<number>();
        numb2.split('').forEach(item => {
            doubleLinkedList.insert(Number(item));
        });

        doubleLinkedList.removeBySpecificPosition(4);
        console.log(doubleLinkedList);

        const tree = new Tree(9);
        numb2.split('').forEach((item, index) => {
            if (index !== 0) {
                tree.root?.insertChildNode(new TreeNode(Number(item)));
            }
        });
        const children0 = new TreeNode(9);
        const grandSom0 = new TreeNode(8);
        grandSom0.insertChildNode(new TreeNode(7));
        children0.insertChildNode(grandSom0);
        tree.root?.insertChildNode(children0);
        console.log(tree);
        tree.travelDFS(node => console.log(node));
        tree.travelBFS(node => console.log(node));

        const binaryTree = new BinaryTree<number>();
        numb2.split('').forEach(item => {
            binaryTree.add(Number(item));
        });
        binaryTree.RLR(node => console.log(node));
        binaryTree.LRR(node => console.log(node));
        binaryTree.RRL(node => console.log(node));

        console.log(binaryTree.search(1));
        binaryTree.removeNode(1);
        console.log(binaryTree);

        const avlTree = new AVLTree();
        avlTree.setRoot(10);
        avlTree.addNode(9);
        avlTree.addNode(11);
        avlTree.addNode(8);
        avlTree.addNode(12);
        avlTree.addNode(13);
        console.log(avlTree);
        avlTree.LRR(node => console.log(node));
    }, []);

    useInsertionEffect(() => {
        document.documentElement.style.setProperty(
            '--background-color-theme',
            theme === 'dark' ? '#000' : '#5f85c1'
        );
    }, [theme]);

    return (
        <>
            <div className='flex flex-col'>
                <span>source: {source.join(' ,')}</span>
                <span>target: {target}</span>
                <span>
                    result:{' '}
                    {result.length
                        ? result.map(value => value.join(' + ')).join(' , ')
                        : 'none'}{' '}
                    = {target}
                </span>
            </div>
            <div className='flex flex-col'>
                <span>
                    add two numbers: {numb1} + {numb2}
                </span>
                <span>result: {addTowNumbers(numb1, numb2)}</span>
            </div>
            <div
                id={passwordHint}
                className={useCSS('red') + ' relative border'}
                onMouseEnter={e => {
                    const { height } = (
                        e.target as HTMLElement
                    ).getBoundingClientRect();
                    setPosition({ x: 0, y: height });
                }}
                onMouseLeave={() => {
                    setTimeout(() => {
                        setPosition(null);
                    }, 200);
                }}
            >
                useInsertionEffect
                {position !== null && (
                    <Tooltip position={position}>
                        {' '}
                        <span className='flex w-[10rem] h-[10rem]'>
                            hello
                        </span>{' '}
                    </Tooltip>
                )}
            </div>
            <div className='flex flex-col'>
                <span>isPending: {isPending ? 'true' : 'false'}</span>
                <div className='flex'>
                    <Button
                        type='primary'
                        onClick={() => {
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
                        }}
                        loading={isPending}
                        className='theme-background-color'
                    >
                        send
                    </Button>
                </div>
            </div>
            <Button
                type='primary'
                onClick={() => {
                    setTheme(theme => (theme === 'dark' ? 'light' : 'dark'));
                }}
                className='theme-background-color'
            >
                theme: {theme}
            </Button>
            <Input
                placeholder='Please input...'
                value={message}
                onChange={e => {
                    setMessage(e?.target?.value);
                    setMessageAsyncHandler(e?.target?.value);
                    setMessageInStorage(e?.target?.value);
                }}
                ref={inputRef}
            />
            {messageAsync}
            <Search search={messageDeferred} />
            <List ref={listRef}>
                {Array(100)
                    .fill(true)
                    .map((item, index) => {
                        return <span key={index}>{item ?? index}</span>;
                    })}
            </List>
            <FormSubmit theme={theme} />
            <div className='flex flex-col'>
                <span>
                    maxLenghtOfOne([1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2,
                    2, 2]):{' '}
                    {maxLenghtOfOne([
                        1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2,
                    ])}
                </span>
                <span>messageInStorage: {messageInStorage}</span>
                <span className='flex flex-col'>
                    <input
                        type='text'
                        value={messageInStorage2}
                        onChange={e => setMessageInStorage2(e?.target?.value)}
                    />
                    messageInStorage2: {messageInStorage2}
                </span>
                <span className='flex flex-col'>
                    <span>moveZero: [0,1,0,3,12] </span>
                    <span>
                        result: [{moveZero([0, 1, 0, 3, 12]).join(',')}]
                    </span>
                    <span>moveZero: [0] </span>
                    <span>result: [{moveZero([0]).join(',')}]</span>
                </span>
                <span className='flex flex-col'>
                    <span>removeDuplicate: [0, 0, 1, 1, 0 ,2, 3, 4, 0] </span>
                    <span>
                        result: [
                        {removeDuplicate([0, 0, 1, 1, 0, 2, 3, 4, 0]).join(',')}
                        ]
                    </span>
                </span>
                <span className='flex flex-col'>
                    <span>removeDuplicate: [0, 0, 1, 1, 0 ,2, 3, 4, 0] </span>
                    <span>
                        result: [
                        {removeDuplicate([0, 0, 1, 1, 0, 2, 3, 4, 0]).join(',')}
                        ]
                    </span>
                </span>
            </div>
        </>
    );
}
