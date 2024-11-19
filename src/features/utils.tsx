import {
  memo,
  ReactNode,
  useInsertionEffect,
  useSyncExternalStore,
} from 'react';

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
