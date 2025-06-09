import { Dispatch, FC, memo, SetStateAction } from 'react';
import { Box, Button, TextField, Typography, InputLabel, Select, MenuItem, Avatar } from '@mui/material';
import { User } from '../../../../types/util.type';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { editModalData } from '..';
import Uploader from '../../Groups/components/Uploader';

// Dummy data for COUNTRIES and Gender
const COUNTRIES = [
    { code: '+1', name: 'United States' },
    { code: '+44', name: 'United Kingdom' },
    { code: '+91', name: 'India' },
    { code: '+61', name: 'Australia' },
    { code: '+81', name: 'Japan' },
];

const Gender = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
];

interface Props {
    user?: User | null;
    editData: editModalData;
    setEditData: Dispatch<SetStateAction<editModalData>>;
    handleSave: () => void;
    updatingProfile: boolean
};

const EditModal: FC<Props> = memo(({ user, editData, setEditData, handleSave, updatingProfile }) => {

    const handleProfileImageChange = (imageUrl?: string | null) => setEditData(prev => ({ ...prev, imageAddress: imageUrl ?? (user?.imageAddress ?? '') }));

    const handleCoverImageChange = (imageUrl?: string | null) => setEditData(prev => ({ ...prev, cover: imageUrl ?? (user?.cover ?? '') }));

    return (
        <Box sx={{ maxWidth: '600px', p: 2, textAlign: "start" }}>
            <Typography variant="h6">{user?.displayName}</Typography>
            <Box sx={{ my: 2 }}>
                <div className='flex items-center gap-4 mb-4'>
                    <Avatar
                        aria-label="recipe"
                        style={{ width: "100px", height: "100px" }}
                        className={`border ${!editData?.imageAddress && "bg-gray-200 text-black text-sm"} mb-3`}
                    >
                        {editData?.imageAddress
                            ? <LazyLoadImage className='object-cover w-full h-full' src={editData?.imageAddress} />
                            : <p className='uppercase'>{user?.displayName?.slice(0, 1)}</p>}

                    </Avatar>
                    <div>
                        <Uploader isProfile size='small' onFileChange={handleProfileImageChange} hintText='Upload Profile Image' elementId='profile-img' />
                    </div>
                </div>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Uploader onFileChange={handleCoverImageChange} />
                </Box>
            </Box>

            <Box>
                <InputLabel sx={{ my: 2 }}>Email</InputLabel>
                <TextField
                    variant="outlined"
                    fullWidth
                    disabled
                    value={user?.email}
                />
            </Box>

            <Box>
                <InputLabel sx={{ my: 2 }}>Display Name</InputLabel>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Display name"
                    value={editData?.displayName}
                    onChange={e => setEditData({ ...editData, displayName: e.target.value })}
                />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Box sx={{ flex: 1 }}>
                    <InputLabel sx={{ mb: 2 }}>Country</InputLabel>
                    <Select
                        fullWidth
                        value={editData?.countryCode}
                        onChange={e => setEditData({ ...editData, countryCode: e.target.value })}
                    >
                        {COUNTRIES.map((country) => (
                            <MenuItem key={country.code} value={country.code}>
                                {country.name}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <Box sx={{ flex: 1 }}>
                    <InputLabel sx={{ mb: 2 }}>Phone Number</InputLabel>

                    <TextField
                        variant="outlined"
                        fullWidth
                        placeholder="Phone number"
                        value={editData?.phoneNumber}
                        onChange={e => setEditData({ ...editData, phoneNumber: e.target.value })}
                    />
                </Box>
            </Box>

            <InputLabel sx={{ mt: 2 }}>Username</InputLabel>
            <TextField
                variant="outlined"
                fullWidth
                placeholder="User name"
                sx={{ mt: 2 }}
                value={user?.username || ''}
            />

            <InputLabel sx={{ mt: 2 }}>Location</InputLabel>
            <TextField
                variant="outlined"
                fullWidth
                placeholder="Location"
                sx={{ mt: 2 }}
                value={editData?.location}
                onChange={e => setEditData({ ...editData, location: e.target.value })}
            />

            <InputLabel sx={{ mt: 2 }}>Date of Birth</InputLabel>
            <TextField
                type="date"
                fullWidth
                sx={{ mt: 2 }}
                value={editData?.dateOfBirth}
                onChange={e => setEditData({ ...editData, dateOfBirth: e.target.value })}
            />

            <InputLabel sx={{ my: 2 }}>Gender</InputLabel>
            <Select fullWidth value={editData?.gender?.toLowerCase()} onChange={e => setEditData({ ...editData, gender: e.target.value.toUpperCase() })}>
                {Gender.map((gender) => (
                    <MenuItem key={gender.value} value={gender.value}>
                        {gender.label}
                    </MenuItem>
                ))}
            </Select>

            <InputLabel sx={{ mt: 2 }}>Bio</InputLabel>
            <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                sx={{ mt: 2 }}
                value={editData?.bio}
                onChange={e => setEditData({ ...editData, bio: e.target.value })}
            />

            <InputLabel sx={{ mt: 2 }}>URL</InputLabel>
            <TextField
                variant="outlined"
                fullWidth
                placeholder="Url"
                sx={{ mt: 2 }}
                value={editData?.url}
                onChange={e => setEditData({ ...editData, url: e.target.value })}
            />

            <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
                onClick={handleSave}
            >
                {updatingProfile ? 'Updating...' : 'Save'}
            </Button>
        </Box>
    );
});

export default EditModal;
