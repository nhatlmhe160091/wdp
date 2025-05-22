import Grid from '@mui/material/Grid2';
import SectionCarousel from '../../components/carousels/sectionCarousel';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import defaultDishPic from '../../assets/default_dish_card.jpg';
import defaultRestaurantPic from '../../assets/default_restaurant_card.jpg';
import defaultVoucherPic from '../../assets/default_voucher_card.svg';

import { Button, Typography } from '@mui/material';
import RestaurantCardCarousel from '../../components/carousels/restaurantCardCarousel';
import Divider from '@mui/material/Divider';
import DishCardCarousel from '../../components/carousels/dishCardCarousel';
import { useNavigate } from 'react-router-dom';
import VoucherCardCarousel from '../../components/carousels/voucherCardCarousel';
import RestaurantService from '../../services/restaurantService';
import DishService from '../../services/dishService';
import VoucherService from '../../services/voucherService';
import { useState, useEffect } from 'react';
const theme = createTheme({
    palette: {
        primary: {
            main: '#007FFF',
            dark: '#0066CC',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
    },
});

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        document.title = "Ratatouille | Trang Chủ"
    }, []);

    useEffect(() => {
        const fetchRestaurants = async () => {
            const res = await RestaurantService.getAllRestaurants();
            setRestaurants(res);
        }
        fetchRestaurants();
    }, []);

    useEffect(() => {
        const fetchDishes = async () => {
            const res = await DishService.getAllDishes();
            setDishes(res.data);
        }
        fetchDishes();
    }, []);

    useEffect(() => {
        const fetchVouchers = async () => {
            const res = await VoucherService.getAllValidVouchers();
            setVouchers(res.data);
        };
        fetchVouchers();
    }, []);

    const navigate = useNavigate();
    return (
        <>
            <Grid container >
                <Grid size={12} >
                    <SectionCarousel></SectionCarousel>
                </Grid>
            </Grid >

            <Grid container sx={{ mx: 12, my: 9 }} spacing={10}>
                <ThemeProvider theme={theme}>
                    <Grid size={7}>
                        <Typography variant='h4' sx={{ fontWeight: "bold" }}>
                            Nơi Giao Thoa Hương Vị
                        </Typography>
                        <Typography variant='h4' sx={{ mt: 1, fontWeight: "bold" }}>
                            Hành Trình Ẩm Thực Độc Đáo
                        </Typography>
                        <Typography variant='body1' sx={{ mt: 3, fontWeight: "medium" }}>
                            Khám phá không gian ẩm thực độc đáo của chúng tôi, nơi mỗi món ăn là một tác phẩm nghệ thuật, mang đậm bản sắc văn hóa. Từ những nguyên liệu tươi ngon đến dịch vụ tận tâm, chúng tôi cam kết mang đến cho bạn trải nghiệm ẩm thực đáng nhớ.
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <RestaurantCardCarousel restaurants={restaurants} slidesPerView={2} ></RestaurantCardCarousel>
                        </Box>
                        <Box sx={{ mt: 3 }} onClick={() => navigate('/restaurant')}>
                            <Button variant="contained" sx={{ color: '#ffff', bgcolor: "#d02028" }}>Danh sách nhà hàng</Button>
                        </Box>
                    </Grid>
                </ThemeProvider>
                <Grid size={5}>
                    <ThemeProvider theme={theme}>
                        <img
                            src={defaultRestaurantPic}
                            alt="Restaurant"
                            style={{ borderRadius: '5%', width: '100%', height: '550px', objectFit: 'cover' }}
                        />
                    </ThemeProvider>
                </Grid>
            </Grid>

            <Grid container sx={{ m: 6 }}>
                <Grid size={12} >
                    <Divider sx={{ width: '100%', bgcolor: "#ffff" }}></Divider>
                </Grid>
            </Grid >

            <Grid container sx={{ mx: 12, my: 9 }} spacing={10}>
                <Grid size={5}>
                    <ThemeProvider theme={theme}>
                        <img
                            src={defaultDishPic}
                            alt="Dish"
                            style={{ borderRadius: '5%', width: '100%', height: '550px', objectFit: 'cover' }}
                        />
                    </ThemeProvider>
                </Grid>
                <ThemeProvider theme={theme}>
                    <Grid size={7}>
                        <Typography variant='h4' sx={{ fontWeight: "bold" }}>
                            Khám Phá Hương Vị Mới:
                        </Typography>
                        <Typography variant='h4' sx={{ mt: 1, fontWeight: "bold" }}>
                            Những Món Ăn Tuyệt Hảo Đang Chờ Bạn
                        </Typography>

                        <Typography variant='body1' sx={{ mt: 3, fontWeight: "medium" }}>
                            Tận hưởng hành trình ẩm thực độc đáo với những món ăn được chế biến tỉ mỉ từ nguyên liệu tươi ngon nhất. Mỗi món ăn không chỉ là một trải nghiệm vị giác mà còn là sự hòa quyện của màu sắc, hương thơm và cảm xúc.
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <DishCardCarousel dishes={dishes} slidesPerView={2}></DishCardCarousel>
                        </Box>
                        <Box sx={{ mt: 3 }} onClick={() => navigate('/dish')}>
                            <Button variant="contained" sx={{ color: '#ffff', bgcolor: "#d02028" }}>Danh sách món ăn</Button>
                        </Box>
                    </Grid>
                </ThemeProvider>
            </Grid>

            <Grid container sx={{ m: 6 }}>
                <Grid size={12} >
                    <Divider sx={{ width: '100%', bgcolor: "#ffff" }}></Divider>
                </Grid>
            </Grid >


            <Grid container sx={{ mx: 12, my: 9 }} spacing={10}>
                <ThemeProvider theme={theme}>
                    <Grid size={7}>
                        <Typography variant='h4' sx={{ fontWeight: "bold" }}>
                            Khám Phá Voucher
                        </Typography>
                        <Typography variant='h4' sx={{ mt: 1, fontWeight: "bold" }}>
                            Tiết Kiệm Hơn, Thưởng Thức Tốt Hơn
                        </Typography>

                        <Typography variant='body1' sx={{ mt: 3, fontWeight: "medium" }}>
                            Voucher mang đến cơ hội tiết kiệm khi thưởng thức ẩm thực tại nhà hàng. Là món quà ý nghĩa và cách tuyệt vời để khám phá món mới.
                        </Typography>
                        <Box sx={{ mt: 3 }}>
                            <VoucherCardCarousel vouchers={vouchers} slidesPerView={2}></VoucherCardCarousel>
                        </Box>
                        <Box sx={{ mt: 3 }} onClick={() => navigate('/voucher')}>
                            <Button variant="contained" sx={{ color: '#ffff', bgcolor: "#d02028" }}>Danh sách voucher</Button>
                        </Box>
                    </Grid>
                </ThemeProvider >
                <Grid size={5}>
                    <ThemeProvider theme={theme}>
                        <img
                            src={defaultVoucherPic}
                            alt="Voucher"
                            style={{ borderRadius: '5%', width: '100%', height: '400px', objectFit: 'cover' }}
                        />
                    </ThemeProvider>
                </Grid>
            </Grid >
        </>
    )
}

export default Home;