import { memo, useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";

interface Props {
    isOpen: boolean;
    maxW?: string;
    onClose: () => void;
    children: React.ReactNode;
    position?: string;
    bottom?: string;
};

const BottomSheet: React.FC<Props> = memo(({ isOpen, onClose, children, maxW = "md", position, bottom }) => {

    const [{ y }, api] = useSpring(() => ({
        y: 100,
        config: { tension: 250, friction: 15 },
    }));

    useEffect(() => {
        if (isOpen) {
            api.start({ y: 0 });
        } else {
            api.start({ y: 50 });
        }
    }, [isOpen, api]);

    const bind = useDrag((state) => {
        const { down, movement: [, my], memo = y.get(), velocity, dragging, last } = state;

        if (dragging) {
            api.start({ y: memo + my, immediate: down });
        }

        if (last) {
            if (my > 50 && velocity[1] > 0.3) {
                onClose();
            } else if (my < 50) {
                api.start({ y: 0 });
            } else {
                api.start({ y: 50 });
            }
        }

        return memo;
    }, { threshold: 10 });

    useEffect(() => {
        if (!isOpen) {
            api.start({ y: 50 });
        }
    }, [isOpen, api]);

    if (!isOpen) return null;

    return (
        <div
            className={`${position ?? "absolute"} inset-0 bg-transparent z-[9999] left-0 bottom-[${bottom ?? "45px"}] flex items-end justify-center  pointer-events-auto`}
            onClick={onClose}
        >
            <animated.div
                {...bind()}
                style={{
                    touchAction: "none",
                    transform: y.to((y) => `translateY(${y}px)`),
                }}
                className="bg-[#272727] text-white rounded-t-2xl w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-3"></div>
                {children}
            </animated.div>
        </div>
    );
});

export default BottomSheet;
