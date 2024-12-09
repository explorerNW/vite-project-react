import {
  memo,
  ReactNode,
  useEffect,
  useInsertionEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { ITableUser } from './users-manage/user-list';

export function useOnlineStatus() {
  function subscribe(callback: () => void) {
    window.addEventListener('online', callback);
    window.addEventListener('offline', callback);

    return () => {
      window.removeEventListener('online', callback);
      window.removeEventListener('offline', callback);
    };
  }
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );
}

const isInserted = new Set();
export function useCSS(rule: string) {
  useInsertionEffect(() => {
    if (!isInserted.has(rule)) {
      isInserted.add(rule);
      const styleNode = document.createElement('style');
      styleNode.innerHTML = getStyleForRule(rule);
      styleNode.setAttribute('type', 'text/css');
      document.head.appendChild(styleNode);
    }
  });

  return rule;
}

function getStyleForRule(rule: string) {
  switch (rule) {
    case 'red':
      return '.red { color: red; }';
    default:
      return '';
  }
}

export const Tooltip = memo(function Tooltip({
  position,
  children,
}: {
  position: { x: number; y: number };
  children: ReactNode;
}) {
  return (
    <>
      <div
        className='absolute border bg-[white] z-10'
        style={{
          top: 0,
          left: 0,
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      >
        <div className='contant'>{children}</div>
      </div>
    </>
  );
});

export const interval = (delay = 1000, callback: () => void) => {
  let start: number | null = null;
  function interval(timestemp: number) {
    if (start == null) {
      start = timestemp;
    }
    const elapsed = timestemp - start;
    if (elapsed > delay) {
      start = null;
      if (callback) {
        callback();
      }
    }
    requestAnimationFrame(interval);
  }
  requestAnimationFrame(interval);
};

export const isEmail = (email: string) => {
  return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(email);
};

export const isPhone = (phone: string) => {
  return /^1\d{10}$|^(0\d{2,3}-?|\(0\d{2,3}\))?[1-9]\d{4,7}(-\d{1,8})?$/.test(
    phone
  );
};

export class SSE {
  sse: EventSource;
  constructor(url: string) {
    this.sse = new EventSource(url);
  }

  onMessage(callback: (this: EventSource, ev: Event) => void) {
    this.sse.onmessage = callback;
  }

  onError(callback: (this: EventSource, ev: Event) => void) {
    this.sse.onerror = callback;
  }
}

export const CanvasTable = memo(function CanvasTable({
  data,
}: {
  data: ITableUser[];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const rowHeight = 20;
      const columnWidth = [150, 50, 50];
      canvas.height = data.length * rowHeight;
      canvas.width = columnWidth.reduce((a, b) => a + b, 0);
      data.forEach((row, index) => {
        const y = index * rowHeight;
        ctx!.fillText(row.full_name, 0, y + rowHeight / 2);
        ctx!.fillText(row.sex, columnWidth[0], y + rowHeight / 2);
        ctx!.fillText(
          row.age.toString(),
          columnWidth[0] + columnWidth[1],
          y + rowHeight / 2
        );
        ctx!.strokeRect(0, y, canvas.width, canvas.height);
      });
    }
  }, [data]);

  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
});

const tileSize = 100;
const rowHeight = 20;
export const CanvasTileTable = memo(function CanvasTileTable({
  data,
  containerHeight,
  scrollTop,
}: {
  data: ITableUser[];
  containerHeight: number;
  scrollTop: number;
}) {
  const canvasRef = useRef(null);
  const [visibleTiles, setVisibleTiles] = useState<number[]>([]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const columnWidth = [150, 50, 50];

      canvas.height = containerHeight;
      canvas.width = columnWidth.reduce((a, b) => a + b, 0);
      data.forEach(() => {
        const start = Math.ceil(scrollTop / (tileSize * rowHeight));
        const end = start + Math.floor(canvas.height / (tileSize * rowHeight));
        const tiles: number[] = [];
        for (let i = start; i <= end; i++) {
          tiles.push(i);
        }

        setVisibleTiles(() => tiles);
      });
    }
  }, [scrollTop, containerHeight, data]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      const columnWidth = [150, 50, 50];

      visibleTiles.forEach(tileIndex => {
        const startRow = tileIndex * tileSize;
        const endRow = Math.min(data.length, startRow + tileSize);
        for (let rowIndex = startRow; rowIndex < endRow; rowIndex++) {
          const row = data[rowIndex];
          const y = (rowIndex - startRow) * rowHeight;
          ctx!.fillText(row.full_name, 0, y + rowHeight / 2);
          ctx!.fillText(row.sex, columnWidth[0], y + rowHeight / 2);
          ctx!.fillText(
            row.age.toString(),
            columnWidth[0] + columnWidth[1],
            y + rowHeight / 2
          );
          ctx!.strokeRect(0, y, canvas.width, canvas.height);
        }
      });
    }
  }, [visibleTiles, data]);

  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
});
