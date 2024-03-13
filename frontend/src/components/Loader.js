import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const Loader = () => {
    return (
        <Stack spacing={1}>
            {/* For variant="text", adjust the height via font-size */}

            {/* For other variants, adjust the size with `width` and `height` */}
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rectangular" width={210} height={60} />

        </Stack>
    )
}

export default Loader