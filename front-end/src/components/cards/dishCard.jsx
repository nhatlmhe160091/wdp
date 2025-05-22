import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import defaultArt from '../../assets/default_dish_card.jpg';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import Chip from '@mui/material/Chip';
import RestaurantDrawer from '../drawers/restaurantDrawer';
import { useState } from 'react';
import VoucherDrawer from '../drawers/voucherDrawer';
import RestaurantService from '../../services/restaurantService';
import VoucherService from '../../services/voucherService';
import { useNavigate } from 'react-router-dom';
import Tooltip from '@mui/material/Tooltip';
import { useEffect } from 'react';
import ImageService from '../../services/imageService';

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

export default function DishCard({ dish }) {
    const navigate = useNavigate();
    const [openRestaurantDrawer, setOpenRestaurantDrawer] = useState(false);
    const [openVoucherDrawer, setOpenVoucherDrawer] = useState(false);
    const [restaurants, setRestaurants] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const res = await ImageService.getImage(dish?._id);
            const urls = res?.data?.map(obj => obj?.url);
            setImages(urls);
        }
        fetchImages();
    }, [dish]);

    const getFormatFoodTag = (foodTag) => {
        switch (foodTag) {
            case "SEASONAL": return "Theo mùa";
            case "HOT_SALE": return "Bán chạy";
            case "CHEF_SPECIAL": return "Đầu bếp khuyên dùng";
            default: return "";
        }
    }

    const getFormatCategory = (category) => {
        switch (category) {
            case "APPETIZER": return "Món khai vị";
            case "MAIN_COURSE": return "Món chính";
            case "DESSERT": return "Món tráng miệng";
            case "BEVERAGE": return "Đồ uống";
            case "SALAD": return "Salad";
            case "SOUP": return "Súp";
            default: return "";
        }
    }

    const handleOpenRestaurantDrawer = async (dishId) => {
        const res = await RestaurantService.getRestaurantsByDishId(dishId);
        setRestaurants(res.data);
        setOpenRestaurantDrawer(true);
    }

    const handleOpenVoucherDrawer = async (dishId) => {
        const res = await VoucherService.getVouchersByDishId(dishId);
        setVouchers(res.data);
        setOpenVoucherDrawer(true);
    }

    function formatCurrency(value) {
        if (value === null || value === undefined) return '0 VNĐ';
        const formattedValue = value.toLocaleString('vi-VN');
        return `${formattedValue} vnđ`;
    }

    return (
        <>
            <RestaurantDrawer open={openRestaurantDrawer} setOpen={setOpenRestaurantDrawer} restaurants={restaurants}></RestaurantDrawer>
            <VoucherDrawer open={openVoucherDrawer} setOpen={setOpenVoucherDrawer} vouchers={vouchers}></VoucherDrawer>
            <ThemeProvider theme={theme}>
                <Card sx={{
                    display: 'flex', flexDirection: 'column', height: '100%',
                    boxShadow: 3,
                    backgroundColor: 'white',
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                        backgroundColor: '#FFFAF0',
                        boxShadow: 6,
                    },
                }}>
                    <CardHeader
                        avatar={
                            <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                <LunchDiningIcon fontSize="large"></LunchDiningIcon>
                            </Avatar>
                        }
                        action={
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Chip
                                    sx={{
                                        mt: 1,
                                        bgcolor: '#d02028',
                                        color: '#ffff',
                                    }}
                                    label={getFormatFoodTag(dish?.foodTag)}
                                    onClick={() => {
                                        navigate(`/dish?foodTag=${dish?.foodTag}`);
                                    }} />
                                <Chip
                                    sx={{
                                        mt: 1,
                                        bgcolor: '#FFAF00',
                                        color: '#ffff',
                                    }}
                                    label={getFormatCategory(dish?.category)}
                                    onClick={() => {
                                        navigate(`/dish?category=${dish?.category}`);
                                    }} />
                            </Box>
                        }
                        title={
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {
                                    dish?.name
                                }
                            </Typography>
                        }
                        subheader={
                            <Typography variant="body1" sx={{ color: '#d02028' }}>
                                {
                                    formatCurrency(dish?.price)
                                }
                            </Typography>

                        }
                    ></CardHeader>
                    <CardMedia
                        component="img"
                        height="194"
                        image={images.length > 0 ? images[0] : defaultArt}
                        alt="dish picture"
                    />
                    <CardContent>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {
                                dish?.description
                                    ? dish?.description
                                    : "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."
                            }
                        </Typography>
                    </CardContent>
                    <CardActions sx={{ marginTop: 'auto' }}>
                        <Tooltip title="Xem các nhà hàng cung cấp món ăn này">
                            <Button sx={{ width: "50%" }} size="small" variant='contained' onClick={() => handleOpenRestaurantDrawer(dish?._id)}>
                                <Box display={'flex'}>
                                    <FoodBankIcon fontSize='medium'></FoodBankIcon>
                                    <Typography sx={{ mx: 1 }} variant='inherit'>Nhà hàng</Typography>
                                </Box>
                            </Button>
                        </Tooltip>
                        <Tooltip title="Xem các voucher áp dụng lên món ăn này">
                            <Button sx={{ width: "50%" }} size="small" variant='contained' color={'secondary'} onClick={() => handleOpenVoucherDrawer(dish?._id)} >
                                <Box display={'flex'} >
                                    <LoyaltyIcon fontSize='medium'></LoyaltyIcon>
                                    <Typography sx={{ mx: 1 }} variant='inherit'>Voucher</Typography>
                                </Box>
                            </Button>
                        </Tooltip>
                    </CardActions>
                </Card >
            </ThemeProvider >
        </>
    );
}
