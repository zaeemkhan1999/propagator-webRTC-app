import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import { useGetPostById } from './queries/getPostById';
import { CircularProgress } from '@mui/material';
import Feed from '../Feed';
import Scrolls from '@/app/scene/Home/components/Scrolls';
import { useSnapshot } from 'valtio';
import { userStore } from '@/store/user';

const ViewByID = () => {
    const user = useSnapshot(userStore.store).user;
    const navigate = useNavigate();
    const { type, id } = useParams();

    const searchParams = new URLSearchParams(window.location.search);

    const { fetchPost, loading: fetchingPost, data: postData } = useGetPostById();

    useEffect(() => {
        if (!(type?.toLowerCase() === 'post' || type?.toLowerCase() === 'scroll') || (!id || (id && isNaN(Number(id))))) {
            navigate('/not-found', { replace: true });
        } else if (type.toLowerCase() === "post") {
            fetchPost(Number(id));
        }
    }, []);

    return (
        <div className='h-screen'>
            {fetchingPost
                ? <div className='flex justify-center items-center h-screen'><CircularProgress /></div>
                : (type?.toLowerCase() === 'post' && postData)
                    ? <Feed
                        post={postData}
                        onDelete={() => navigate(-1)}
                        userId={user?.id}
                        performAction={searchParams.get('action') === "comments" ? 'comments' : ''}
                    />
                    : (type?.toLowerCase() === 'scroll' && id)
                        ? <Scrolls scrollId={Number(id)} />
                        : null}
        </div>
    );
};

export default ViewByID;
