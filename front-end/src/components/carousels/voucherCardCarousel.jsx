import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { Grid, Pagination, Autoplay } from 'swiper/modules';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import { Typography } from '@mui/material';
import defaultBackground from '../../assets/default_voucher_card.svg';
import Box from '@mui/material/Box';
import CardContent from '@mui/material/CardContent';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

export default function VoucherCardCarousel({ vouchers, slidesPerView = 2 }) {
    return (
        <>
            <Swiper
                slidesPerView={slidesPerView}
                grid={{
                    rows: 1,
                }}
                spaceBetween={10}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                }}
                modules={[Grid, Pagination, Autoplay]}
                className="mySwiper"
                style={{ height: "200px" }}
            >
                {
                    vouchers && vouchers.length > 0 && vouchers.map(voucher => (
                        <SwiperSlide key={voucher._id}> {/* Thêm key cho mỗi slide */}
                            <Card sx={{ display: 'flex' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <CardContent sx={{ flex: '1 0 auto', minWidth: 200 }}>
                                        <Typography component="div" variant="h5" fontWeight="bold">
                                            {voucher?.code}
                                        </Typography>
                                        <Typography variant="subtitle2" component="div">
                                            Bắt đầu từ: {voucher?.validFrom}
                                        </Typography>
                                        <Typography variant="subtitle2" component="div">
                                            Kết thúc vào: {voucher?.validTo}
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
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
                                    alt="Voucher image"
                                />
                            </Card>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    );
}
