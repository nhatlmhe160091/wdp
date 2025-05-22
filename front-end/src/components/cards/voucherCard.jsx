import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import defaultBackground from '../../assets/default_voucher_card.svg'
import FoodBankIcon from '@mui/icons-material/FoodBank';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import DishDrawer from '../drawers/dishDrawer';
import { useState } from 'react';
import RestaurantDrawer from '../drawers/restaurantDrawer';
import InvalidVoucherMask from '../general/invalidVoucherMask';
import RestaurantService from '../../services/restaurantService';
import DishService from '../../services/dishService';
import Tooltip from '@mui/material/Tooltip';

export default function VoucherCard({ voucher }) {
  const [openDishDrawer, setOpenDishDrawer] = useState(false);
  const [openRestaurantDrawer, setOpenRestaurantDrawer] = useState(false);
  const [dishes, setDishes] = useState([]);
  const [restaurants, setRestaurants] = useState([]);

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

  const handleOpenRestaurantDrawer = async (voucherId) => {
    const res = await RestaurantService.getRestaurantsByVoucherId(voucherId);
    setRestaurants(res.data);
    setOpenRestaurantDrawer(true);
  }

  const handleOpenDishDrawer = async (voucherId) => {
    const res = await DishService.getDishesByVoucherId(voucherId);
    setDishes(res.data);
    setOpenDishDrawer(true);
  }

  return (
    <>
      <DishDrawer open={openDishDrawer} setOpen={setOpenDishDrawer} dishes={dishes}></DishDrawer>
      <RestaurantDrawer open={openRestaurantDrawer} setOpen={setOpenRestaurantDrawer} restaurants={restaurants}></RestaurantDrawer>
      <InvalidVoucherMask status={voucher?.status}>
        <ThemeProvider theme={theme}>
          <Card
            sx={{
              display: 'flex',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                transform: 'scale(1.02)',
                transition: 'transform 0.3s ease',
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
                  sx={{ mt: 1, color: 'text.secondary' }}
                >
                  {voucher?.description}
                </Typography>
                <ThemeProvider theme={theme}>
                  <Box sx={{ display: 'flex', alignItems: 'center', pt: 1 }}>
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
              <Box sx={{ display: 'flex', alignItems: 'center', pl: 2, pb: 1 }}>
                <Tooltip title="Xem các nhà hàng mà voucher này có thể áp dụng">
                  <Button size="small" variant='contained' onClick={() => handleOpenRestaurantDrawer(voucher?._id)}>
                    <Box display={'flex'} flexDirection={'row'}>
                      <FoodBankIcon fontSize='medium'></FoodBankIcon>
                      <Typography variant='inherit'></Typography>
                    </Box>
                  </Button>
                </Tooltip>
                <Tooltip title="Xem các món ăn mà voucher này có thể áp dụng">
                  <Button sx={{ mx: 1 }} size="small" variant='contained' color={'secondary'} onClick={() => handleOpenDishDrawer(voucher?._id)}>
                    <Box display={'flex'} flexDirection={'row'} >
                      <LunchDiningIcon fontSize='medium'></LunchDiningIcon>
                      <Typography variant='inherit'></Typography>
                    </Box>
                  </Button>
                </Tooltip>
              </Box>
            </Box>
            <CardMedia
              component="img"
              sx={{ width: 300, height: 250 }}
              image={defaultBackground}
              alt="Live from space album cover"
            />
          </Card>
        </ThemeProvider>
      </InvalidVoucherMask>
    </>
  );
}
