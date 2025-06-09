import { Box, Typography, Switch, } from '@mui/material';
import { useState } from 'react';

const Notification = () => {
  const [Direct, setDirect] = useState(false);
  const [Follow, setFollow] = useState(false);
  const [Like, setLike] = useState(false);
  const [Comment, setComment] = useState(false);

  const handleChange = (type: string) => {
    switch (type) {
      case 'Direct':
        setDirect(!Direct);
        break;
      case 'Follow':
        setFollow(!Follow);
        break;
      case 'Like':
        setLike(!Like);
        break;
      case 'Comment':
        setComment(!Comment);
        break;
      default:
        break;
    }
  };

  return (
    <Box className="w-full">
      <h4 className='my-3 ms-4'>Notifications</h4>
      <Box className="flex justify-between items-center py-2">
        <Typography>Direct</Typography>
        <Switch color="success" checked={Direct} onChange={() => handleChange('Direct')} />
      </Box>

      <Box className="flex justify-between items-center py-2">
        <Typography>Follow back</Typography>
        <Switch color="success" checked={Follow} onChange={() => handleChange('Follow')} />
      </Box>

      <Box className="flex justify-between items-center py-2">
        <Typography>Like</Typography>
        <Switch color="success" checked={Like} onChange={() => handleChange('Like')} />
      </Box>

      <Box className="flex justify-between items-center py-2">
        <Typography>Comment</Typography>
        <Switch color="success" checked={Comment} onChange={() => handleChange('Comment')} />
      </Box>
    </Box>
  );
};

export default Notification;