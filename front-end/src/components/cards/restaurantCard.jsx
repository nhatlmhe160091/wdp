import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TableBarIcon from '@mui/icons-material/TableBar';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import defaultArt from '../../assets/default_restaurant_card.jpg';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoucherService from '../../services/voucherService';
import DishService from '../../services/dishService';
import DishDrawer from '../drawers/dishDrawer';
import VoucherDrawer from '../drawers/voucherDrawer';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import Tooltip from '@mui/material/Tooltip';
import ImageService from '../../services/imageService';
import { useEffect } from 'react';

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

export default function RestaurantCard({ restaurant }) {
    const navigate = useNavigate();
    const [openDishDrawer, setOpenDishDrawer] = useState(false);
    const [openVoucherDrawer, setOpenVoucherDrawer] = useState(false);
    const [dishes, setDishes] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const res = await ImageService.getImage(restaurant?._id);
            const urls = res?.data?.map(obj => obj?.url);
            setImages(urls);
        }
        fetchImages();
    }, [restaurant]);

    const handleOpenDishDrawer = async (restaurantId) => {
        const filter = {
            restaurantId
        }
        const res = await DishService.getDishes(filter);
        setDishes(res.data);
        setOpenDishDrawer(true);
    }

    const handleOpenVoucherDrawer = async (restaurantId) => {
        const res = await VoucherService.getVouchersByRestaurantId(restaurantId);
        setVouchers(res.data);
        setOpenVoucherDrawer(true);
    }

    return (
        < >
            <DishDrawer open={openDishDrawer} setOpen={setOpenDishDrawer} dishes={dishes}></DishDrawer>
            <VoucherDrawer open={openVoucherDrawer} setOpen={setOpenVoucherDrawer} vouchers={vouchers}></VoucherDrawer>
            <Card sx={{
                display: 'flex', flexDirection: 'column', height: '100%',
                transition: 'background-color 0.3s ease',
                '&:hover': {
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                    transform: 'scale(1.02)',
                    transition: 'transform 0.3s ease',
                },
            }}
            >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                            <FoodBankIcon fontSize="large"></FoodBankIcon>
                        </Avatar>
                    }
                    action={
                        <MoreVertIcon />
                    }
                    title={restaurant?.name}
                    subheader={restaurant?.address}
                />
                <CardMedia
                    component="img"
                    height="194"
                    image={images?.length > 0 ? images[0] : defaultArt}
                    alt="Restaurant picture"
                />
                <CardContent>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {
                            restaurant?.description
                                ? restaurant?.description
                                : "This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."
                        }
                    </Typography>
                </CardContent>
                <CardActions sx={{ marginTop: 'auto' }}>
                    <ThemeProvider theme={theme}>
                        <Button sx={{ width: "50%" }} size="small" variant='contained' onClick={() => navigate(`/restaurant/${restaurant._id}`)}>
                            <Box display={'flex'} >
                                <TableBarIcon fontSize='small' />
                                <Typography sx={{ mx: 1 }} variant='inherit'>Đặt bàn ngay</Typography>
                            </Box>
                        </Button>
                        <Tooltip title="Xem các món ăn mà nhà hàng cung cấp">
                            <Button sx={{ width: "25%" }} size="small" variant='contained' color={'secondary'} onClick={() => handleOpenDishDrawer(restaurant._id)}>
                                <LunchDiningIcon fontSize='small' />
                            </Button>
                        </Tooltip>
                        <Tooltip title="Xem các voucher mà nhà hàng áp dụng">
                            <Button sx={{ width: "25%" }} size="small" variant='contained' color={'secondary'} onClick={() => handleOpenVoucherDrawer(restaurant._id)}>
                                <LoyaltyIcon fontSize='small' />
                            </Button>
                        </Tooltip>
                    </ThemeProvider>
                </CardActions>
            </Card >
        </>
    );
}
