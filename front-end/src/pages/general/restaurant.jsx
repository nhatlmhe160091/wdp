import SectionHeading from "../../components/headings/sectionHeading";
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import RestaurantCard from "../../components/cards/restaurantCard";
import RestaurantService from "../../services/restaurantService";
import { scrollToPosition } from "../../utils/handleScroll";
import { useEffect, useState, Fragment } from "react";
import { useSearchParams, useNavigate } from 'react-router-dom';
import Pagination from '@mui/material/Pagination';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';

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

const Restaurant = () => {
    useEffect(() => {
        document.title = "Ratatouille | Nhà Hàng";
        scrollToPosition(800, 800);
    }, []);

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const [meta, setMeta] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [restaurants, setRestaurants] = useState([]);
    const [search, setSearch] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const fetchRestaurants = async (filter) => {
            try {
                const res = await RestaurantService.getPaginatedRestaurants(filter);
                setMeta(res.meta);
                setRestaurants(res.data);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            }
        };

        const pageParam = parseInt(searchParams.get('page')) || 1;
        const searchQuery = searchParams.get('search') || "";
        const filter = {
            page: pageParam,
            limit: 6,
            name: searchQuery
        };

        fetchRestaurants(filter);
        setCurrentPage(pageParam);
    }, [searchParams]);

    useEffect(() => {
        const pageParam = parseInt(searchParams.get('page')) || 1;

        if (meta?.totalPages && pageParam > meta.totalPages) {
            navigate('/invalid');
        } else {
            setCurrentPage(pageParam);
        }
    }, [meta, searchParams, navigate]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.set('page', 1);
        if (search.length > 0) {
            params.set('search', search);
        }
        navigate(`?${params.toString()}`);
    };

    const handleNavigate = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        navigate(`?${params.toString()}`);
    };

    return (
        <>
            <Grid container>
                <Grid size={12}>
                    <SectionHeading headingTitle={'Danh sách nhà hàng'} />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={3}></Grid>
                <Grid size={6}>
                    <Paper
                        component="form"
                        sx={{ mt: 3, display: 'flex', alignItems: 'center' }}
                        onSubmit={handleSearchSubmit}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Tìm kiểm theo tên nhà hàng"
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
                        Bao gồm {meta?.total} nhà hàng
                    </Typography>
                </Grid>
                <Grid size={3}>

                </Grid>

            </Grid>
            <Grid container sx={{ mx: 9, my: 6 }} spacing={2}>
                {restaurants && restaurants.length > 0 &&
                    restaurants.map(data => {
                        return (
                            <Fragment key={data._id}>
                                <Grid size={4}>
                                    <RestaurantCard restaurant={data}>
                                    </RestaurantCard>
                                </Grid>
                            </Fragment>
                        )
                    })
                }
            </Grid>
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
                                    handleNavigate(value);
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

export default Restaurant;