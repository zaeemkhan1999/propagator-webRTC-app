import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import { useNavigate } from "react-router-dom";

interface SwipeablePageProps {
    children: React.ReactNode;
    onSwipeLeft?: string;
    onSwipeRight?: string;
    onSwipeUp?: string;
    onSwipeDown?: string;
    className?: string;
    ref?: any;
    onScroll?: any;
}

const SwipeablePage = ({
    children,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    className,
    ...props
}: SwipeablePageProps) => {
    const navigate = useNavigate();
    const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));

    const isYAxis = onSwipeUp || onSwipeDown;
    const isXAxis = onSwipeLeft || onSwipeRight;

    const bindSwipe = useDrag(
        ({
            target,
            down,
            movement: [mx, my],
            direction: [xDir, yDir],
            velocity: [vx, vy],
            last,
            initial: [ix, iy],
            cancel,
        }) => {
            const element = target as HTMLElement;
            if (element.closest(".video-seekbar") && Math.abs(mx) > Math.abs(my)) {
                return;
            }

            const thresholdX = window.innerWidth / 2;
            const thresholdY = window.innerHeight / 1;
            const cornerThreshold = 100;
            const cornerThresholdY = 20;
            const fastSwipe = vx > 0.2 || vy > 0.2;
            const isSwipingLeft = xDir === -1;
            const isSwipingRight = xDir === 1;
            const isSwipingUp = yDir === -1;
            const isSwipingDown = yDir === 1;
            const swipeFromLeftEdge = ix < cornerThreshold;
            const swipeFromRightEdge = ix > window.innerWidth - cornerThreshold;
            const swipeFromTopEdge = iy < cornerThresholdY;
            const swipeFromBottomEdge = iy > window.innerHeight - cornerThresholdY;

            if (last) {
                if (
                    isSwipingLeft &&
                    onSwipeLeft &&
                    swipeFromRightEdge &&
                    (Math.abs(mx) > thresholdX || fastSwipe)
                ) {
                    api.start({ x: -window.innerWidth });
                    setTimeout(() => {
                        navigate(onSwipeLeft);
                    }, 150);
                    cancel();
                } else if (
                    isSwipingRight &&
                    onSwipeRight &&
                    swipeFromLeftEdge &&
                    (Math.abs(mx) > thresholdX || fastSwipe)
                ) {
                    api.start({ x: window.innerWidth });
                    setTimeout(() => {
                        navigate(onSwipeRight, {
                            viewTransition: true,
                        });
                    }, 150);
                    cancel();
                } else if (
                    isSwipingUp &&
                    onSwipeUp &&
                    swipeFromTopEdge &&
                    (Math.abs(my) > thresholdY || fastSwipe)
                ) {
                    api.start({ y: -window.innerHeight });
                    setTimeout(() => {
                        navigate(onSwipeUp);
                    }, 150);
                    cancel();
                } else if (
                    isSwipingDown &&
                    onSwipeDown &&
                    swipeFromBottomEdge &&
                    (Math.abs(my) > thresholdY || fastSwipe)
                ) {
                    api.start({ y: window.innerHeight });
                    setTimeout(() => {
                        navigate(onSwipeDown);
                    }, 150);
                    cancel();
                } else {
                    api.start({ x: 0, y: 0 });
                }
            } else {
                api.start({ x: down ? mx : 0, y: down ? my : 0 });
            }
        },
        {
            filterTaps: true,
            axis:
                isYAxis && isXAxis ? undefined : isXAxis ? "x" : isYAxis ? "y" : "lock",
        },
    );

    return (
        <animated.div
            {...bindSwipe()}
            style={{
                x,
                y,
                willChange: "transform",
            }}
            className={className}
            {...props}
        >
            {children}
        </animated.div>
    );
};

export default SwipeablePage;
