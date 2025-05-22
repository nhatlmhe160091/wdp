import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Box from '@mui/material/Box';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import './sectionCarousel.css';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import DishBackgroundImage from '../../assets/default_dish_background_heading.jpg';
import RestaurantBackgroundImage from '../../assets/default_restaurant_background_heading.jpg';
import VoucherBackgroundImage from '../../assets/default_voucher_background_heading.jpg';

const theme = createTheme({
    palette: {
        primary: {
            main: '#d02028',
        },
        secondary: {
            main: '#d02028',
        },
    },
});

export default function SectionCarousel() {
    const navigate = useNavigate();

    return (
        <>
            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
            >
                <SwiperSlide>
                    <Box
                        sx={{
                            width: "100 %",
                            height: 600,
                            maxWidth: "true",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundImage: `url(${RestaurantBackgroundImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                        <Box sx={{ textTransform: 'uppercase', fontWeight: 'bold', typography: 'h2', color: "white", textShadow: '2px 2px 4px #000000' }} >
                            Nhà hàng sang trọng
                        </Box>
                        <Box sx={{ mt: 2, textTransform: 'uppercase', fontWeight: 'bold', typography: 'h5', color: "white", textShadow: '2px 2px 4px #000000' }} >
                            Mỗi nhà hàng đều được thiết kế phong cách riêng
                        </Box>
                        <Box sx={{ textTransform: 'uppercase', fontWeight: 'bold', typography: 'h5', color: "white", textShadow: '2px 2px 4px #000000' }} >
                            phù hợp với phong cách sống của bạn
                        </Box>
                        <ThemeProvider theme={theme}>
                            <Box sx={{ mt: 8, textTransform: 'uppercase', fontWeight: 'bold', color: "white", textShadow: '2px 2px 4px #000000' }} >
                                <Button sx={{ width: 400 }} variant="contained" onClick={() => navigate("/restaurant")}>Khám phá ngay</Button>
                            </Box>
                        </ThemeProvider>
                    </Box>
                </SwiperSlide>
                <SwiperSlide>
                    <Box
                        sx={{
                            width: "100 %",
                            height: 600,
                            maxWidth: "true",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundImage: `url(${DishBackgroundImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                        <Box sx={{ textTransform: 'uppercase', fontWeight: 'bold', typography: 'h2', color: "white", textShadow: '2px 2px 4px #000000' }} >
                            Thực đơn chọn lọc
                        </Box>
                        <Box sx={{ mt: 2, textTransform: 'uppercase', fontWeight: 'bold', typography: 'h5', color: "white", textShadow: '2px 2px 4px #000000' }} >
                            Thực đơn phong phú và dinh dưỡng
                        </Box>
                        <Box sx={{ textTransform: 'uppercase', fontWeight: 'bold', typography: 'h5', color: "white", textShadow: '2px 2px 4px #000000' }} >
                            với những đầu bếp hàng đầu
                        </Box>
                        <ThemeProvider theme={theme}>
                            <Box sx={{ mt: 8, textTransform: 'uppercase', fontWeight: 'bold', color: "white", textShadow: '2px 2px 4px #000000' }} >
                                <Button sx={{ width: 400 }} variant="contained" onClick={() => navigate("/dish")}>Khám phá ngay</Button>
                            </Box>
                        </ThemeProvider>
                    </Box>
                </SwiperSlide>
                <SwiperSlide>
                    <Box
                        sx={{
                            width: "100 %",
                            height: 600,
                            maxWidth: "true",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundImage: `url(${VoucherBackgroundImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                    >
                        <Box sx={{ textTransform: 'uppercase', fontWeight: 'bold', typography: 'h2', color: "white", textShadow: '2px 2px 4px #000000' }} >
                            Mã giảm giá đa dạng
                        </Box>
                        <Box sx={{ mt: 2, textTransform: 'uppercase', fontWeight: 'bold', typography: 'h4', color: "white", textShadow: '2px 2px 4px #000000' }} >
                            Cho phép bạn giảm số tiền theo giá trị Voucher
                        </Box>
                        <Box sx={{ textTransform: 'uppercase', fontWeight: 'bold', typography: 'h5', color: "white", textShadow: '2px 2px 4px #000000' }} >
                            Hãy đăng nhập và tích điểm
                        </Box>
                        <ThemeProvider theme={theme}>
                            <Box sx={{ mt: 8, textTransform: 'uppercase', fontWeight: 'bold', color: "white", textShadow: '2px 2px 4px #000000' }} >
                                <Button sx={{ width: 400 }} variant="contained" onClick={() => navigate("/voucher")}>Khám phá ngay</Button>
                            </Box>
                        </ThemeProvider>
                    </Box>
                </SwiperSlide>
            </Swiper >
        </>
    );
}
