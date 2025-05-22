import * as React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import TableBarIcon from '@mui/icons-material/TableBar';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
    palette: {
        primary: {
            main: '#d02028',
        },
        secondary: {
            main: '#FFAF00',
        },
    },
});

export default function Footer() {
    const navigate = useNavigate();

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    backgroundColor: '#1b1b1b',
                    color: '#fff',
                    pt: 5,
                    pb: 3,
                    mt: 5,
                }}
            >
                <Container maxWidth="xl">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={4}>
                            <Box display="flex" alignItems="center" mb={1}>
                                <TableBarIcon sx={{ fontSize: 30, mr: 1, color: 'secondary.main' }} />
                                <Typography variant="h6" fontWeight="bold">
                                    Ratatouille
                                </Typography>
                            </Box>
                            <Typography variant="body2">
                                Nền tảng quản lý nhà hàng thông minh, tối ưu quy trình đặt bàn, thực đơn và hỗ trợ khách hàng.
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Liên kết nhanh
                            </Typography>
                            <Box>
                                <Link
                                    onClick={() => navigate('/')}
                                    sx={{ display: 'block', color: '#fff', mb: 1, cursor: 'pointer' }}
                                    underline="hover"
                                >
                                    Trang chủ
                                </Link>
                                <Link
                                    onClick={() => navigate('/restaurant')}
                                    sx={{ display: 'block', color: '#fff', mb: 1, cursor: 'pointer' }}
                                    underline="hover"
                                >
                                    Đặt bàn
                                </Link>
                                <Link
                                    onClick={() => navigate('/dish')}
                                    sx={{ display: 'block', color: '#fff', mb: 1, cursor: 'pointer' }}
                                    underline="hover"
                                >
                                    Thực đơn
                                </Link>
                                <Link
                                    onClick={() => navigate('/support')}
                                    sx={{ display: 'block', color: '#fff', mb: 1, cursor: 'pointer' }}
                                    underline="hover"
                                >
                                    Hỗ trợ
                                </Link>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" gutterBottom>
                                Liên hệ
                            </Typography>
                            <Box display="flex" alignItems="center" mb={1}>
                                <PhoneIcon sx={{ mr: 1 }} /> 
                                <Typography variant="body2">0123 456 789</Typography>
                            </Box>
                            <Box display="flex" alignItems="center" mb={1}>
                                <EmailIcon sx={{ mr: 1 }} /> 
                                <Typography variant="body2">contact@ratatouille.vn</Typography>
                            </Box>
                            <Box display="flex" alignItems="center">
                                <LocationOnIcon sx={{ mr: 1 }} /> 
                                <Typography variant="body2">123 Đường Nhà Hàng, TP. HCM</Typography>
                            </Box>
                        </Grid>
                    </Grid>

                    <Box mt={5} textAlign="center" borderTop="1px solid #444" pt={2}>
                        <Typography variant="body2" color="text.secondary">
                            © {new Date().getFullYear()} Ratatouille. All rights reserved.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
