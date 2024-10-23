import { useEffect, useState } from "react";

export function useOnlineStatus() {
    const [online, setOnline] = useState(true);
    useEffect(() => {
        function handler() {
            setOnline(navigator.onLine);
        }

        window.addEventListener("online", handler);
        window.addEventListener("offline", handler);

        return () => {
            window.removeEventListener("online", handler);
            window.removeEventListener("offline", handler);
        }
    });

    return online;
}