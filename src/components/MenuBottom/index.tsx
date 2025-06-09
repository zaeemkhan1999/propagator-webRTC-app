import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GroupIcon from '../../assets/iconMenu/Group';
import LiveIcon from '../../assets/iconMenu/Live';
import AddIcon from '../../assets/iconMenu/moon';
import ExploreIcon from '../../assets/iconMenu/Explore';
import IconProfile from '../../assets/iconMenu/Profile';
import { Box } from '@mui/material';
import useScreenDetector from '@/app/utility/misc.helpers';

export interface Props {
    isActiveMobileMenu: boolean;
    handelmenuLeft?: () => void;
};

const navigationItems = [
    { route: '/specter/profile', Icon: IconProfile },
    { route: '/specter/live', Icon: LiveIcon },
    { route: '/specter/create', Icon: AddIcon },
    { route: '/specter/groups', Icon: GroupIcon },
    { route: '/specter/explore', Icon: ExploreIcon },
];

const BottomMenu = ({ isActiveMobileMenu }: Props) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { isDesktop } = useScreenDetector();

    const getColor = (path: string): string => {
        if (pathname.includes(path)) {
            return '#38bdf8';
        }
        if (['/specter/groups'].includes(pathname)) {
            return '#fff';
        }
        return '#fff';
    };

    const showBottomIcons = useCallback((): 'none' | 'flex' => {
        const hiddenPaths = ['inbox', 'notifications', 'subscription', 'promotions', 'discounts', 'scrolls', 'news', 'explore', 'profile', 'groups', 'create', 'userProfile', 'youtube', "privacy-policy", "terms-and-conditions", 'watch-history', 'free-market'];
        const shouldHide = hiddenPaths.some(path => pathname.includes(path));
        return (isActiveMobileMenu && shouldHide) || isDesktop ? 'none' : 'flex';
    }, [pathname, isActiveMobileMenu, isDesktop]);

    return (
        <Box
            className="bg-transparent"
            id="menubottom"
            sx={{
                display: showBottomIcons(),
                justifyContent: 'space-between',
                gap: 2,
                alignItems: 'center',
                position: 'fixed',
                width: '100%',
                bottom: 0,
                left: 0,
                zIndex: 999,
                p: 2,
                height: '53px',
                maxHeight: '53px',
            }}
        >
            {navigationItems.map(({ route, Icon }, index) => (
                <Box
                    key={index}
                    sx={{ cursor: 'pointer', padding: 1 }}
                    onClick={() => {
                        navigate(route);
                        // if (navigator) {
                        //     navigator.vibrate(60);
                        // };
                    }}
                >
                    <Icon className={"shadow-light-black"} color={getColor(route)} />
                </Box>
            ))}
        </Box>
    );
};

export default BottomMenu;
