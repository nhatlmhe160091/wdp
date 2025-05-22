import * as React from 'react';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

const borderStyles = {
    bgcolor: 'background.paper',
    border: 1,
    borderRight: 0,
    borderRadius: '16px'
};

export default function PictureList({ pictures = [] }) {
    React.useEffect(() => {
        if (pictures?.length <= 0) {
            pictures = picturesTemporary;
        }
    }, [pictures])

    return (
        <Box sx={{ maxHeight: 450, overflowY: 'scroll', ...borderStyles }}>
            <ImageList variant="masonry" cols={3} gap={8}>
                {pictures.map((item) => (
                    <ImageListItem key={item?.url}>
                        <img
                            srcSet={`${item?.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item?.url}?w=248&fit=crop&auto=format`}
                            alt={item?.title}
                            loading="lazy"
                        />
                    </ImageListItem>
                ))}
            </ImageList>
        </Box>
    );
}

const picturesTemporary = [
    {
        url: 'https://images.unsplash.com/photo-1526234362653-3b75a0c07438?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nzd8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
        title: 'Elegant Restaurant',
    },
    {
        url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
        title: 'Fine Dining',
    },
    {
        url: 'https://images.unsplash.com/photo-1497644083578-611b798c60f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
        title: 'Cozy Atmosphere',
    },
    {
        url: 'https://plus.unsplash.com/premium_photo-1661433201283-fcb240e88ad4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
        title: 'Chic Decor',
    },
    {
        url: 'https://images.unsplash.com/photo-1481833761820-0509d3217039?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
        title: 'Stylish Bar',
    },
    {
        url: 'https://images.unsplash.com/photo-1421622548261-c45bfe178854?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        title: 'Modern Table Setting',
    },
    {
        url: 'https://plus.unsplash.com/premium_photo-1670984940113-f3aa1cd1309a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjV8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
        title: 'Gourmet Meal',
    },
    {
        url: 'https://images.unsplash.com/photo-1541557435984-1c79685a082b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTR8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
        title: 'Luxury Interior',
    },
    {
        url: 'https://images.unsplash.com/photo-1517638851339-a711cfcf3279?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
        title: 'Dim Lighting',
    },
    {
        url: 'https://images.unsplash.com/photo-1520209268518-aec60b8bb5ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
        title: 'Intimate Dinner',
    },
    {
        url: 'https://images.unsplash.com/photo-1430931071372-38127bd472b8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
        title: 'Artistic Presentation',
    },
    {
        url: 'https://images.unsplash.com/photo-1494346480775-936a9f0d0877?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzV8fHJlc3RhdXJhbnR8ZW58MHx8MHx8fDA%3D',
        title: 'Sleek Design',
    },
];

