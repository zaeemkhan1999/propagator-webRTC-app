import { useNavigate } from 'react-router-dom';

export const Goback = () => {
    const navigate = useNavigate();
    return () => navigate(-1);
};
