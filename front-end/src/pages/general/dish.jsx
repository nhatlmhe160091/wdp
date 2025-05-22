import * as React from 'react';
import Grid from '@mui/material/Grid2';
import SectionHeading from '../../components/headings/sectionHeading';
import DishCard from '../../components/cards/dishCard';
import DishService from '../../services/dishService';
import { useEffect, useState, Fragment } from 'react';
import { scrollToPosition } from '../../utils/handleScroll';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { ListItem, ListItemButton } from '@mui/material';
import Slider from '@mui/material/Slider';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const theme = createTheme({
    palette: {
        primary: {
            main: '#B8001F',
        },
        secondary: {
            main: '#EEEEEE',
        },
    },
});

const marks = [
    {
        value: 0,
        label: '0 vnđ',
    },
    {
        value: 250000,
        label: '250.000 vnđ',
    },
    {
        value: 500000,
        label: '500.000 vnđ',
    },
];

const Dish = () => {
    useEffect(() => {
        document.title = "Ratatouille | Thực Đơn"
        scrollToPosition(800, 800);
    }, []);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [meta, setMeta] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [dishes, setDishes] = useState([]);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get("category") || 'ALL');
    const [foodTag, setFoodTag] = useState(searchParams.get("foodTag") || 'ALL');
    const [price, setPrice] = React.useState([Number(searchParams.get("minPrice")) || 0, Number(searchParams.get("maxPrice")) || 100000]);
    useEffect(() => {
        const fetchDish = async (filter) => {
            try {
                const res = await DishService.getPaginatedDishes(filter);
                setMeta(res.meta);
                setDishes(res.data);
            } catch (error) {
                console.error('Failed to fetch dishes:', error);
            }
        };

        const pageParam = parseInt(searchParams.get('page')) || 1;
        const searchQuery = searchParams.get('search') || '';
        const categoryQuery = searchParams.get('category') || 'ALL';
        const foodTagQuery = searchParams.get('foodTag') || 'ALL';
        const minPrice = Number(searchParams.get('minPrice')) || 0;
        const maxPrice = Number(searchParams.get('maxPrice')) || 100000;

        const filter = {
            page: pageParam,
            limit: 6,
            name: searchQuery,
            minPrice: minPrice,
            maxPrice: maxPrice,
            category: categoryQuery === 'ALL' ? null : categoryQuery,
            foodTag: foodTagQuery === 'ALL' ? null : foodTagQuery,
        };

        fetchDish(filter);
        setCurrentPage(pageParam);
    }, [searchParams]);

    useEffect(() => {
        const pageParam = parseInt(searchParams.get('page')) || 1;

        if (meta?.totalPages && pageParam > meta.totalPages) {
            navigate('/invalid');
        } else if (meta?.totalPages && pageParam <= meta.totalPages) {
            setCurrentPage(pageParam);
        }

    }, [meta, searchParams, navigate]);

    const minDistance = 100000;
    const handleChangePrice = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setPrice([Math.min(newValue[0], price[1] - minDistance), price[1]]);
        } else {
            setPrice([price[0], Math.max(newValue[1], price[0] + minDistance)]);
        }
    };

    const valueLabelFormat = (value) => {
        return `${value} vnđ`;
    }

    const handleFilter = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();

        if (search.length > 0) params.append('search', search);
        if (category !== 'ALL') params.append('category', category);
        if (foodTag !== 'ALL') params.append('foodTag', foodTag);
        params.append('minPrice', price[0]);
        params.append('maxPrice', price[1]);

        navigate(`?${params.toString()}`);
    }

    const handleNavigate = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        navigate(`?${params.toString()}`);
    }
    return (
        <>
            <Grid container>
                <Grid size={12}>
                    <SectionHeading headingTitle={'Thực đơn'} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={3}></Grid>
                <Grid size={6}>
                    <Paper
                        component="form"
                        sx={{ mt: 3, display: 'flex', alignItems: 'center' }}
                        onSubmit={(e) => handleFilter(e)}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Tìm kiểm theo tên món ăn"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <IconButton type="button" sx={{ p: '10px' }} aria-label="search" >
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Grid>
                <Grid size={3}></Grid>
            </Grid>
            <Grid container sx={{ mt: 3 }}>
                <Grid size={3}>
                </Grid>
                <Grid size={6}>
                    <Typography variant="h6" gutterBottom textAlign={'center'}>
                        Bao gồm {meta?.total} món ăn
                    </Typography>
                </Grid>
                <Grid size={3}>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ m: 3 }}>
                <Grid size={3}>
                    <Box
                        sx={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 1,
                            boxShadow: 1,   
                            '&:hover': {
                                boxShadow: 3,
                            },
                            transition: '0.3s',
                        }}
                    >
                        <ThemeProvider theme={theme}>
                            <Box sx={{ p: 2 }}>
                                <ListItemButton sx={{ display: 'flex', alignContent: 'center' }} onClick={(e) => handleFilter(e)}>
                                    <FilterAltIcon >
                                    </FilterAltIcon>
                                    <ListItemText
                                        primary={<Typography variant="button" gutterBottom sx={{ p: 1, display: 'block' }}>
                                            Tiến hành lọc sản phẩm
                                        </Typography>} />
                                </ListItemButton>
                                <List
                                    sx={{ width: '100%' }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"

                                >
                                    <ListItemText sx={{ marginLeft: 4 }} >
                                        <ListItemText
                                            primary={<Typography variant="button" gutterBottom sx={{ display: 'block' }}>
                                                Phân loại thực đơn
                                            </Typography>} />
                                    </ListItemText>
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={category}
                                            onChange={e => setCategory(e.target.value)}
                                            defaultValue="ALL"
                                        >
                                            <List sx={{ marginLeft: 4 }} disablePadding>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="ALL" control={<Radio />} label={<ListItemText primary="Hiển thị tất cả" />} />
                                                </ListItem>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="APPETIZER" control={<Radio />} label={<ListItemText primary="Món khai vị" />} />
                                                </ListItem>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="MAIN_COURSE" control={<Radio />} label={<ListItemText primary="Món chính" />} />
                                                </ListItem>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="DESSERT" control={<Radio />} label={<ListItemText primary="Món tráng miệng" />} />
                                                </ListItem>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="BEVERAGE" control={<Radio />} label={<ListItemText primary="Đồ uống" />} />
                                                </ListItem>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="SALAD" control={<Radio />} label={<ListItemText primary="Salad rau trộn" />} />
                                                </ListItem>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="SOUP" control={<Radio />} label={<ListItemText primary="Canh súp" />} />
                                                </ListItem>
                                            </List>
                                        </RadioGroup>
                                    </FormControl>
                                    <ListItemText sx={{ pl: 4 }}>
                                        <ListItemText
                                            primary={<Typography variant="button" gutterBottom sx={{ display: 'block' }}>
                                                Chọn theo danh mục
                                            </Typography>} />
                                    </ListItemText>
                                    <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-controlled-radio-buttons-group"
                                            name="controlled-radio-buttons-group"
                                            value={foodTag}
                                            onChange={e => setFoodTag(e.target.value)}
                                            defaultValue="ALL"
                                        >
                                            <List sx={{ marginLeft: 4 }} disablePadding>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="ALL" control={<Radio />} label={<ListItemText primary="Hiển thị tất cả" />} />
                                                </ListItem>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="HOT_SALE" control={<Radio />} label={<ListItemText primary="Bán chạy nhất" />} />
                                                </ListItem>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="SEASONAL" control={<Radio />} label={<ListItemText primary="Món ăn theo mùa" />} />
                                                </ListItem>
                                                <ListItem sx={{ pl: 4 }}>
                                                    <FormControlLabel value="CHEF_SPECIAL" control={<Radio />} label={<ListItemText primary="Khẩu phần đặc biệt" />} />
                                                </ListItem>
                                            </List>
                                        </RadioGroup>
                                    </FormControl>
                                    <ListItemText sx={{ pl: 4 }}>
                                        <ListItemText
                                            primary={<Typography variant="button" gutterBottom sx={{ display: 'block' }}>
                                                Khoảng giá
                                            </Typography>} />
                                    </ListItemText>
                                    <List sx={{ marginLeft: 4 }} disablePadding>
                                        <ListItem >
                                            <Slider
                                                sx={{
                                                    mt: 3
                                                }}
                                                value={price}
                                                onChange={handleChangePrice}
                                                step={10000}
                                                min={0}
                                                max={500000}
                                                marks={marks}
                                                valueLabelDisplay="on"
                                                getAriaValueText={valueLabelFormat}
                                                valueLabelFormat={valueLabelFormat}
                                                disableSwap

                                            />
                                        </ListItem>
                                    </List>

                                </List>
                            </Box>
                        </ThemeProvider>
                    </Box>
                </Grid >
                <Grid size={9}>
                    <Grid container spacing={2} >
                        {dishes && dishes.length > 0 &&
                            dishes.map(data => {
                                return (
                                    <Fragment key={data._id}>
                                        <Grid size={4}>
                                            <DishCard dish={data}>
                                            </DishCard>
                                        </Grid>
                                    </Fragment>
                                )
                            })
                        }
                    </Grid>
                </Grid>
            </Grid >

            <Grid container>
                <Grid size={12}>
                    <ThemeProvider theme={theme}>
                        <Box
                             sx={{
                                p: 2,
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'center',
                            }}
                        >
                            <Pagination count={meta?.totalPages}
                                onChange={(event, value) => {
                                    handleNavigate(value)
                                }}
                                page={currentPage} variant="outlined" shape="rounded" color="secondary"
                            />
                        </Box>
                    </ThemeProvider>
                </Grid>
            </Grid>
        </>
    )
}

export default Dish