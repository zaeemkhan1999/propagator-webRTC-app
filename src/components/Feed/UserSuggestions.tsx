import { useGetUsers } from '@/app/scene/Admin/queries/getUsers';
import { useState, useEffect, memo, useRef } from 'react';
import { MentionedUser } from './Comments';
import { Avatar, CircularProgress } from '@mui/material';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import Modal from '../Modals/Modal';

interface Props {
    show: boolean;
    onClose: Function;
    searchTerm: string;
    excludeId: number
    onClick: (u: MentionedUser) => void;
};

const UserSuggestions = memo(({ show, onClose, searchTerm, excludeId, onClick }: Props) => {
    const lastUserRef = useRef<null | HTMLDivElement>(null);

    const [suggestions, setSuggestions] = useState<MentionedUser[]>([]);

    const {
        data: usersData,
        isFetching: usersIsfetching,
        isLoading: usersIsLoading,
        refetch: getUsers,
        hasNextPage,
        fetchNextPage
    } = useGetUsers({
        searchTerm,
        excludeUserIds: [excludeId],
        isActive: true,
        ofTypes: ["ADMIN", "SUPER_ADMIN", "USER"]
    });

    useEffect(() => {
        show && getUsers();
    }, [show]);

    useEffect(() => {
        const timer = setTimeout(() => {
            searchTerm && getUsers();
        }, 250);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        const users = usersData?.pages?.flatMap(page => page?.user_getUsers?.result?.items?.map(u => ({ id: u?.id, username: u?.username, imageAddress: u?.imageAddress })));

        setSuggestions(users || []);
    }, [usersData]);

    const handleSuggestionClick = (u: MentionedUser) => {
        onClick(u);
        onClose();
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !usersIsfetching && !usersIsLoading) {
                    fetchNextPage();
                }
            },
            { threshold: 0.8 }
        );

        if (lastUserRef.current) {
            observer.observe(lastUserRef.current);
        }

        return () => {
            if (lastUserRef.current) {
                observer.unobserve(lastUserRef.current);
            }
        };
    }, [hasNextPage, usersIsfetching, usersIsLoading]);

    return (show &&
        <Modal
            title='Suggestions'
            isOpen={show}
            onClose={onClose}
        >
            <div className="w-1/2 m-auto">
                {(usersIsLoading && !usersIsfetching)
                    ? <div className="text-center"><CircularProgress /></div>
                    : suggestions.length
                        ? suggestions.map(u => (
                            <div key={u.id} className='flex gap-3 items-center' onClick={() => handleSuggestionClick(u)}>
                                <Avatar
                                    aria-label="recipe"
                                    className={`my-1 border ${!u?.imageAddress && "bg-gray-200 text-black text-sm"}`}
                                >
                                    {u?.imageAddress
                                        ? <LazyLoadImage src={u?.imageAddress} alt='User Image' />
                                        : <p className='uppercase'>{u?.username?.slice(0, 1)}</p>}
                                </Avatar>

                                <p>{u?.username}</p>
                            </div>
                        ))
                        : <p className="text-center">No User found!</p>}
            </div>

            <div ref={lastUserRef}></div>
            {!usersIsLoading && usersIsfetching && <div className="text-center"><CircularProgress size={18} /></div>}
        </Modal>
    );
});

export default UserSuggestions;
