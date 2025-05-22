import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';
import { Grid, Pagination, Autoplay } from 'swiper/modules';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import defaultArt from '../../assets/default_dish_card.jpg';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import ImageService from '../../services/imageService';

export default function DishCardCarousel({ dishes, slidesPerView = 2 }) {
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
                    dishes && dishes.length > 0 && dishes.map(dish => {
                        const image = imageMap[dish?._id] || defaultArt;

                        return (
                            <SwiperSlide key={dish._id} >
                                <>
                                    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                        <CardHeader
                                            action={
                                                <MoreVertIcon />
                                            }
                                            title={
                                                <Typography variant='body1' sx={{ fontWeight: "bold" }}>
                                                    {dish?.name}
                                                </Typography>
                                            }
                                            subheader={
                                                <Typography variant="body1" sx={{ color: '#d02028' }}>
                                                    {
                                                        `${dish?.price / 1000}.000 vnđ`
                                                    }
                                                </Typography>
                                            }
                                        />
                                        <CardMedia
                                            component="img"
                                            style={{ objectFit: 'cover' }}
                                            height="140"
                                            image={image}
                                            alt="dish picture"
                                        />
                                    </Card >
                                </>
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </>
    );
}
