import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import SectionHeading from '../../components/headings/sectionHeading';
import { useEffect, useState, Fragment } from 'react';
import { scrollToPosition } from '../../utils/handleScroll';
import VoucherCard from '../../components/cards/voucherCard';
import vouchersService from '../../services/voucherService';
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
const Voucher = () => {
    useEffect(() => {
        document.title = "Ratatouille | Vouchers";
        scrollToPosition(800, 800);
    }, []);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [vouchers, setVouchers] = useState([]);
    const [meta, setMeta] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState(searchParams.get('search') || '');

    useEffect(() => {
        const fetchVouchers = async (filter) => {
            try {
                const res = await vouchersService.getPaginatedVouchers(filter);
                setMeta(res.meta);
                setVouchers(res.data);
            } catch (error) {
                console.error('Failed to fetch vouchers:', error);
            }
        };

        const pageParam = parseInt(searchParams.get('page')) || 1;
        const searchQuery = searchParams.get('search') || '';
        const filter = {
            page: pageParam,
            code: searchQuery,
            limit: 6
        };

        fetchVouchers(filter);
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
        <Fragment>
            <Grid container>
                <Grid size={12}>
                    <SectionHeading headingTitle={'Mã giảm giá'} />
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
                            placeholder="Tìm kiểm theo mã code voucher"
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
            {searchParams.get('search') && <Grid container sx={{ mt: 3 }}>
                <Grid size={3}>
                </Grid>
                <Grid size={6}>
                    <Typography variant="h6" gutterBottom textAlign={'center'}>
                        Tìm thấy {meta?.total} sản phẩm
                    </Typography>
                </Grid>
                <Grid size={3}>
                </Grid>
            </Grid>}
            <Grid container spacing={2} sx={{ m: 3 }}>
                {vouchers && vouchers.length > 0 &&
                    vouchers.map(data => {
                        return (
                            <Fragment key={data?._id}>
                                <Grid size={4}>
                                    <VoucherCard voucher={data}>
                                    </VoucherCard>
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
        </Fragment >
    )
}

export default Voucher;