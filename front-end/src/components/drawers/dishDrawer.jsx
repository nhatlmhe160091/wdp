import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import defaultArt from '../../assets/default_dish_card.jpg';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { Fragment } from 'react'
import { useEffect, useState } from 'react';
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

export default function DishDrawer({ open, setOpen, dishes }) {
    const [imageMap, setImageMap] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            const images = {};
            for (const dish of dishes) {
                const res = await ImageService.getImage(dish._id);
                const urls = res?.data?.map(obj => obj?.url);
                images[dish._id] = urls?.[0];
            }
            setImageMap(images);
        };

        if (dishes && dishes.length > 0) {
            fetchImages();
        }
    }, [dishes]);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

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

    return (
        <div>
            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)} >
                <Box sx={{ width: 400 }} role="presentation"  >
                    <ThemeProvider theme={theme}>
                        {
                            dishes && dishes.length > 0 && dishes.map(dish => {
                                const image = imageMap[dish?._id] || defaultArt;

                                return (
                                    <Fragment key={dish._id}>
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
                                                    '& .MuiCardHeader-title': {
                                                        color: 'white',
                                                    },
                                                    '& .MuiCardHeader-subheader': {
                                                        color: 'white',
                                                    },
                                                    '& .MuiTypography-body2': {
                                                        color: 'white',
                                                    },
                                                    '& .MuiChip-root': {
                                                        backgroundColor: 'white',
                                                        color: 'black',
                                                        pointerEvents: 'none',
                                                    },
                                                },
                                            }}
                                        >
                                            <CardHeader
                                                avatar={
                                                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                                        <LunchDiningIcon fontSize="large"></LunchDiningIcon>
                                                    </Avatar>
                                                }
                                                action={
                                                    <Box sx={{ display: 'flex', flexDirection: 'column', pointerEvents: 'none', }}>
                                                        <Chip label={getFormatFoodTag(dish?.foodTag)} />
                                                        <Chip sx={{ mt: 1 }} label={getFormatCategory(dish?.category)} />
                                                    </Box>
                                                }
                                                title={dish?.name}
                                                subheader={`${dish?.price / 1000}.000 vnđ`}
                                            ></CardHeader>
                                            <CardMedia
                                                component="img"
                                                height="194"
                                                image={image}
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
