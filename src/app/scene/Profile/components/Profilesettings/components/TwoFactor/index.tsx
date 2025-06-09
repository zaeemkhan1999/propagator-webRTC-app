import { Box, Switch, Typography } from "@mui/material"
import { useState } from "react";

const TwoFactor = () => {
    const [Direct, setDirect] = useState(false);

    const handleChange = (type: string) => {
        switch (type) {
            case 'Direct':
                setDirect(!Direct);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <Box>
                <h4 className='my-3 ms-4'>Two-Factor Authentication</h4>
                <Box className="flex justify-between items-center py-2">
                    <Typography>Two-Factor Authentication</Typography>
                    <Switch color="success" checked={Direct} onChange={() => handleChange('Direct')} />
                </Box>
            </Box>
        </>
    )
}

export default TwoFactor