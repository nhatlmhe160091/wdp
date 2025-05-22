import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { Grid, Pagination, Autoplay } from 'swiper/modules';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import defaultArt from '../../assets/default_restaurant_card.jpg';
import { Typography } from '@mui/material';
import ImageService from '../../services/imageService';
export default function RestaurantCardCarousel({ restaurants, slidesPerView = 2 }) {
    const [imageMap, setImageMap] = useState({});

    useEffect(() => {
        const fetchImages = async () => {
            const images = {};
            for (const restaurant of restaurants) {
                const res = await ImageService.getImage(restaurant?._id);
                const urls = res?.data?.map(obj => obj?.url);
                images[restaurant._id] = urls?.[0] || defaultArt;
            }
            setImageMap(images);
        };

        if (restaurants && restaurants.length > 0) {
            fetchImages();
        }
    }, [restaurants]);

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
                style={{ height: "300px" }}
            >
                {
                    restaurants && restaurants.length > 0 && restaurants.map(restaurant => {
                        const image = imageMap[restaurant?._id] || defaultArt;

                        return (
                            <SwiperSlide key={restaurant?._id}>
                                <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                    <CardHeader
                                        action={
                                            <MoreVertIcon />
                                        }
                                        title={
                                            <Typography variant='body1' sx={{ fontWeight: "bold" }}>
                                                {restaurant?.name}
                                            </Typography>
                                        }
                                        subheader={
                                            <Typography variant='subtitle2' sx={{ color: '#808080' }} >
                                                {restaurant?.address}
                                            </Typography>
                                        }
                                    />
                                    <CardMedia
                                        component="img"
                                        style={{ objectFit: 'cover' }}
                                        height="140"
                                        image={image}
                                        alt="Restaurant picture"
                                    />
                                </Card >
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </>
    );
}
