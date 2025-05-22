import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Person3Icon from '@mui/icons-material/Person3';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import TableBarIcon from '@mui/icons-material/TableBar';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LoginDialog from '../dialogs/loginDialog'
import RegisterDialog from '../dialogs/registerDialog';
import Link from '@mui/material/Link';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
    palette: {
        primary: {
            main: '#d02028',
        },
        secondary: {
            main: '#FFAF00',
        }
    },
});

function GuestHeader() {
    const navigate = useNavigate();
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <AppBar
                position="fixed"
                sx={{
                    backgroundColor: scrolled ? '#d02028' : '#fff',
                    color: scrolled ? '#fff' : '#000',
                    boxShadow: scrolled ? 4 : 0,
                    transition: 'background-color 0.3s, color 0.3s'
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <TableBarIcon
                            onClick={() => navigate('/')}
                            sx={{
                                cursor: 'pointer',
                                display: { xs: 'none', md: 'flex' },
                                mr: 1,
                                color: scrolled ? 'inherit' : '#d02028'
                            }}
                        />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: scrolled ? 'inherit' : '#d02028',
                                textDecoration: 'none',
                            }}
                        >
                            Ratatouille
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Link
                                sx={{ ml: 3, textAlign: 'center', textTransform: "uppercase", fontWeight: "bold" }}
                                component="button"
                                color="inherit"
                                variant="body2"
                                underline="hover"
                                onClick={() => navigate('/')}
                            >
                                Trang chủ
                            </Link>
                            <Link
                                sx={{ ml: 3, textAlign: 'center', textTransform: "uppercase", fontWeight: "bold" }}
                                component="button"
                                color="inherit"
                                variant="body2"
                                underline="hover"
                                onClick={() => navigate('/restaurant')}
                            >
                                Danh sách Nhà hàng
                            </Link>
                            <Link
                                sx={{ ml: 3, textAlign: 'center', textTransform: "uppercase", fontWeight: "bold" }}
                                component="button"
                                color="inherit"
                                variant="body2"
                                underline="hover"
                                onClick={() => navigate('/dish')}
                            >
                                Danh sách món ăn
                            </Link>
                            <Link
                                sx={{ ml: 3, textAlign: 'center', textTransform: "uppercase", fontWeight: "bold" }}
                                component="button"
                                color="inherit"
                                variant="body2"
                                underline="hover"
                                onClick={() => navigate('/voucher')}
                            >
                                Ưu đãi hấp dẫn
                            </Link>
                        </Box>
                        <Box sx={{ display: 'flex' }} >
                            <Person3Icon sx={{ p: 0, color: scrolled ? 'inherit' : 'grey.700' }} />
                            <Link
                                sx={{
                                    ml: 1,
                                    textAlign: 'center',
                                    fontWeight: "bold",
                                    color: scrolled ? 'inherit' : 'grey.700'
                                }}
                                component="button"
                                color="inherit"
                                variant="body1"
                                underline="hover"
                                onClick={() => setOpenLogin(true)}
                            >
                                Đăng nhập
                            </Link>
                            <Typography sx={{ ml: 1, textAlign: 'center', color: scrolled ? 'inherit' : 'grey.700' }}>/</Typography>
                            <Link
                                sx={{
                                    ml: 1,
                                    textAlign: 'center',
                                    fontWeight: "bold",
                                    color: scrolled ? 'inherit' : 'grey.700'
                                }}
                                component="button"
                                color="inherit"
                                variant="body1"
                                underline="hover"
                                onClick={() => setOpenRegister(true)}
                            >
                                Đăng ký
                            </Link>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
            <LoginDialog open={openLogin} setOpen={setOpenLogin}></LoginDialog>
            <RegisterDialog open={openRegister} setOpen={setOpenRegister}></RegisterDialog>
        </ThemeProvider>
    );
}
export default GuestHeader;