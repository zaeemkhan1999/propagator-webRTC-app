import { CircularProgress, Switch, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useGetPermissions, UserPermissions } from '../queries/getPermissions';
import defaultPermissions from '@/constants/permissions';
import { useUpdatePermission } from '../mutations/updatePermissions';
import ArrowLeft from '@/assets/icons/ArrowLeft';

interface Props { };

const AdminPermissions = ({ }: Props) => {
    const navigate = useNavigate();
    const { username } = useParams();

    const [permissions, setPermissions] = useState<[] | UserPermissions[]>(defaultPermissions);
    const [updatingPermission, setUpdatingPermission] = useState<string>('');

    useEffect(() => {
        !username
            ? navigate(-1)
            : getPermissions({ skip: 0, take: 100, username });
    }, []);

    const { data, error, getPermissions, loading } = useGetPermissions();

    useEffect(() => {
        if (!data?.permissions_getPermissions?.result?.items?.length) {
            setPermissions(defaultPermissions);
            return;
        }

        const permissionsMap = new Map(data.permissions_getPermissions.result.items.map(p => [p.type, p]));

        const updatedPermissions = defaultPermissions.map(p => {
            return {
                ...p,
                ...permissionsMap.get(p.type),
            };
        });

        setPermissions(updatedPermissions);
    }, [data]);

    const isSwitchChecked = (type: string) => {
        const foundPermission = permissions.find(p => p.type === type);
        return foundPermission?.value === 'true' || false;
    }

    const { updatePermission, loading: updating } = useUpdatePermission();

    const handlePermissionChange = (type: string) => {
        setUpdatingPermission(type);

        const updatedPermissions = permissions.map(p =>
            p.type === type ? { type: p.type, selected: !p.selected, value: String(!p.selected) } : p
        );

        const userClaims = updatedPermissions.map(p => ({ type: p.type, value: p.value, selected: p.selected }));
        username && updatePermission({
            input: {
                username,
                userClaims
            },
            take: userClaims.length
        },
            (newPermissions) => setPermissions(newPermissions));

        setUpdatingPermission('');
    }

    return (
        <div className='h-screen pb-10 overflow-y-auto pt-3 px-3'>
            <div className='flex gap-5 items-center mb-3'>
                <ArrowLeft className='text-black' onClick={() => navigate(-1)} />
                <Typography variant='subtitle1'>
                    Admin Permissions ({username})
                </Typography>
            </div>

            <div>
                {loading
                    ? <div className='text-center'><CircularProgress /></div>
                    : error
                        ? <Typography variant="body1" className="text-center italic mt-10">
                            Some error occured while getting permissions!
                        </Typography>
                        : permissions.map((p) => (
                            <div key={p.type} className="flex justify-between items-center mb-2 bg-gray-100 p-3 rounded-lg">
                                <Typography variant="body1" className="mr-2">
                                    {p.type.split('.')[1] || ''}
                                </Typography>
                                {updatingPermission === p.type
                                    ? <div><CircularProgress /></div>
                                    : <Switch
                                        color='success'
                                        value={p.selected}
                                        checked={isSwitchChecked(p.type)}
                                        onChange={() => handlePermissionChange(p.type)}
                                        disabled={updatingPermission === p.type || updating}
                                    />}
                            </div>
                        ))}
            </div>
        </div>
    );
}

export default AdminPermissions;
