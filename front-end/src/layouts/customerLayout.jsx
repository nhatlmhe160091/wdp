import { Outlet } from 'react-router-dom';
import CustomerHeader from '../components/headers/customerHeader';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Footer from '../components/footers/Footer';
const CustomerLayout = () => {
    return (
        <>
            <Box>
                <Grid container>
                    <Grid size={12}>
                        <CustomerHeader></CustomerHeader>
                    </Grid>
                    <Grid size={12}>
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
export default CustomerLayout;