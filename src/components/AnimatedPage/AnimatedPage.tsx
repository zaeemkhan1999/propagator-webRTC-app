import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useLocation } from 'react-router-dom';

const AnimatedPage = ({ children, ...props }: { children: React.ReactNode;[key: string]: any }) => {
    const location = useLocation();
    const [styles, api] = useSpring(() => ({
        opacity: 0,
    }));

    useEffect(() => {
        api.start({
            opacity: 1,
            config: { tension: 200, friction: 20 },
            delay: 300,
        });

        return () => {
            api.start({
                opacity: 0,
                config: { tension: 200, friction: 20 },
                delay: 300,
            });
        };
    }, [location.pathname, api]);

    return (
        <animated.div style={styles} {...props}>
            {children}
        </animated.div>
    );
};

export default AnimatedPage;