import { Outlet } from 'react-router-dom';
import GuestHeader from '../components/headers/guestHeader';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Footer from '../components/footers/Footer';
const GuestLayout = () => {
    return (
        <>
            <Box>
                <Grid container >
                    <Grid size={12}>
                        <GuestHeader></GuestHeader>
                    </Grid>
                    <Grid size={12} >
                        <Outlet />
                    </Grid>
                    <Grid size={12}>
                        <Footer />
                    </Grid>
                </Grid >
            </Box>
        </>
    )
}
export default GuestLayout;