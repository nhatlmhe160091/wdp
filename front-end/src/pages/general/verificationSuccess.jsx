import React, { useState } from 'react';
import { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuth } from '../../contexts/authContext';
import { doSignOut } from '../../firebase/auth';
import { useNavigate } from 'react-router-dom';
const theme = createTheme({
    palette: {
        primary: {
            main: '#d02028',
        
        secondary: {
            main: '#FFAF00',
        }
        }
    },
});

const VerificationSuccess = () => {
    const navigate = useNavigate();
    const { isUserLoggedIn } = useAuth();
    const [count, setCount] = useState(5);

    useEffect(() => {
        document.title = "Ratatouille | Xác Thực Thành Công";
        const intervalId = setInterval(() => {
            setCount(prev => {
                if (prev === 1) {
                    clearTimeout(intervalId);
                    navigate('/');
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (isUserLoggedIn) {
            const signOut = async () => {
                await doSignOut();
            }
            signOut();
        }
    }, [isUserLoggedIn]);

    return (
        <React.Fragment>
            <ThemeProvider theme={theme}>
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}
                >
                    <Card 
                    sx={{ 
                        textAlign: 'center', 
                        padding: 2 ,
                        borderRadius: 4,
                        boxShadow: 3,
                    }}>
                        <CardContent>
                            <CheckCircleIcon
                                sx={{ fontSize: 100, color: 'green', marginBottom: 2 }}
                            />
                            <Typography variant="h4" component="div">
                                Xác thực thành công!
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: "text.secondary", mt: 2 }}>
                                Chào mừng bạn đến với hệ thống đặt bàn nhà hàng Ratatouille.
                            </Typography>
                            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                                Trở về trang chủ sau {count}.
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>
            </ThemeProvider>
        </React.Fragment>

    );
};

export default VerificationSuccess;