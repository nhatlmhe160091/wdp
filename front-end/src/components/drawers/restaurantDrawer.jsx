import { useState, useEffect, Fragment } from 'react';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FoodBankIcon from '@mui/icons-material/FoodBank';
import defaultArt from '../../assets/default_restaurant_card.jpg';
import Drawer from '@mui/material/Drawer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

export default function RestaurantDrawer({ open, setOpen, restaurants }) {
    const navigate = useNavigate();
    const [imageMap, setImageMap] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            const images = {};
            for (const restaurant of restaurants) {
                const res = await ImageService.getImage(restaurant?._id);
                const urls = res?.data?.map(obj => obj?.url);
                images[restaurant?._id] = urls?.[0] || defaultArt;
            }
            setImageMap(images);
        };

        if (restaurants && restaurants.length > 0) {
            fetchImages();
        }
    }, [restaurants]);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    return (
        <div>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)} >
                <Box sx={{ width: 400 }} role="presentation" >
                    <ThemeProvider theme={theme}>
                        {
                            restaurants && restaurants.length > 0 && restaurants.map(restaurant => {
                                const image = imageMap[restaurant?._id] || defaultArt;

                                return (
                                    <Fragment key={restaurant._id}>
                                        <Card
                                            sx={{
                                                width: "100%",
                                                m: 2,
                                                boxShadow: 3,
                                                backgroundColor: 'white',
                                                transition: 'background-color 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: 'black',
                                                    color: 'white',
                                                    cursor: 'pointer',
                                                    '& .MuiCardHeader-title': {
                                                        color: 'white',
                                                    },
                                                    '& .MuiCardHeader-subheader': {
                                                        color: 'white',
                                                    },
                                                    '& .MuiTypography-body2': {
                                                        color: 'white',
                                                    },
                                                },
                                            }}
                                            onClick={() => navigate(`/restaurant/${restaurant._id}`)}
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
                                                image={image}
                                                alt="Restaurant picture"
                                            />
                                            <CardContent>
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    {
                                                        restaurant?.description
                                                            ? restaurant?.description
                                                            : "This impressive paella is a perfect party restaurant and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like."
                                                    }
                                                </Typography>
                                            </CardContent>
                                        </Card >
                                    </Fragment>
                                )
                            })
                        }
                    </ThemeProvider>
                </Box>
            </Drawer>
        </div >
    );
}
