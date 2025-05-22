import { useState, Fragment } from 'react';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Drawer from '@mui/material/Drawer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import defaultBackground from '../../assets/default_voucher_card.svg'

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

export default function VoucherDrawer({ open, setOpen, vouchers }) {
    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <div>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}  >
                <Box sx={{ width: 400 }} role="presentation" >
                    <ThemeProvider theme={theme}>
                        {
                            vouchers && vouchers.length > 0 && vouchers.map(voucher => {
                                return (
                                    <Fragment key={voucher._id}>
                                        <Card sx={{
                                            m: 2,
                                            display: 'flex',
                                            transition: 'background-color 0.3s ease',
                                            '&:hover': {
                                                backgroundColor: 'black',
                                                color: 'white',
                                                '& .MuiCardHeader-title': {
                                                    color: 'white',
                                                },
                                                '& .MuiCardHeader-subheader': {
                                                    color: 'white',
                                                },
                                                '& .MuiTypography-body2': {
                                                    color: 'white',
                                                },
                                                '& .MuiTypography-subtitle2': {
                                                    color: 'white',
                                                }
                                            },
                                        }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <CardContent sx={{ flex: '1 0 auto', minWidth: 200 }}>
                                                    <Typography component="div" variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                                                        {voucher?.code}
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle2"
                                                        component="div"
                                                    >
                                                        Bắt đầu từ: {voucher?.validFrom}
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle2"
                                                        component="div"
                                                    >
                                                        Kết thúc vào: {voucher?.validTo}
                                                    </Typography>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{ color: 'text.secondary', mt: 1 }}
                                                    >
                                                        {voucher?.description}
                                                    </Typography>
                                                    <ThemeProvider theme={theme}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', pt: 3 }}>
                                                            <Typography
                                                                variant="h6"
                                                                fontWeight="bold"
                                                                color={'primary'}
                                                                sx={{ textDecoration: "underline" }}
                                                            >
                                                                Giảm ngay {voucher?.discountPercentage}%
                                                            </Typography>
                                                        </Box>
                                                    </ThemeProvider>
                                                </CardContent>
                                            </Box>
                                            <CardMedia
                                                component="img"
                                                sx={{ width: 300, height: 250 }}
                                                image={defaultBackground}
                                                alt="Live from space album cover"
                                            />
                                        </Card >
                                    </Fragment>
                                )
                            })
                        }
                    </ThemeProvider>
                </Box>
            </Drawer>
        </div>
    );
}
