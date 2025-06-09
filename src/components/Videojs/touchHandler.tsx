import { useCallback, useRef } from "react";

type TapHandlerOptions = {
    onTap: () => void;
    threshold?: number;
};

export const useTapHandler = ({ onTap, threshold = 10 }: TapHandlerOptions) => {
    const touchStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        const touch = e.touches[0];
        touchStart.current = { x: touch.clientX, y: touch.clientY };
    }, []);

    const handleTouchEnd = useCallback(
        (e: React.TouchEvent) => {
            const touch = e.changedTouches[0];
            const diffX = Math.abs(touch.clientX - touchStart.current.x);
            const diffY = Math.abs(touch.clientY - touchStart.current.y);

            if (diffX < threshold && diffY < threshold) {
                onTap(); // Trigger only if it's a tap
            }
        },
        [onTap, threshold]
    );

    return { handleTouchStart, handleTouchEnd };
};