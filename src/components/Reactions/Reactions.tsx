import React, { useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';
import './reactions.css';

interface EmojiPickerProps {
    children: React.ReactNode;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ children }) => {
    const [isPressed, setIsPressed] = useState(false);

    const [{ x }, api] = useSpring(() => ({
        x: 0,
        config: { tension: 300, friction: 30 },
    }));

    const bind = useDrag(({ down, movement: [mx] }) => {
        api.start({ x: down ? mx : 0, immediate: down });
        if (mx <= -100) {
            setIsPressed(true);
        } else {
            setIsPressed(false);
        }
    });

    return (
        <div className="relative">
            <animated.div
                {...bind()}
                style={{
                    touchAction: 'none',
                    transform: x.to((x) => `translateX(${x}px)`),
                }}
            >
                {children}
            </animated.div>

            {isPressed && (
                <div
                    className="emoji-picker rounded-[25px]"
                    style={{
                        position: 'absolute',
                        bottom: -20,
                        left: '-100px',
                        transition: 'left 0.3s ease-out',
                    }}
                >
                    {['😀', '❤️', '😂', '😢', '👍'].map((emoji, index) => (
                        <div key={index} className="emoji">
                            {emoji}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EmojiPicker;