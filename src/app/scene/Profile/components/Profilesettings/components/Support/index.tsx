import { Box, Button, Select, MenuItem, TextField } from '@mui/material';

const Support = () => {
    return (
        <Box>
            <Box>
                <h4 className='my-3 ms-4'>Support</h4>

                <Box sx={{ marginTop: 2 }}>
                    <Select
                        fullWidth
                        displayEmpty
                        variant="outlined"
                        defaultValue="category1"
                        autoComplete=''
                    >
                        <MenuItem value="">
                            Select Category
                        </MenuItem>
                        <MenuItem value="category1">Category 1</MenuItem>
                        <MenuItem value="category2">Category 2</MenuItem>
                        <MenuItem value="category3">Category 3</MenuItem>
                    </Select>
                </Box>

                <Box sx={{ marginTop: 2 }}>
                    <TextField
                        id="outlined-basic"
                        placeholder='Enter your Email'
                        fullWidth
                        variant="outlined" />

                </Box>

                <Box sx={{ marginTop: 2 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={6}
                        placeholder="Your message"
                    />
                </Box>

                <Box display="flex" justifyContent="flex-end" mt={4}>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        Send
                    </Button>
                </Box>
            </Box>
        </Box >
    );
};

export default Support;