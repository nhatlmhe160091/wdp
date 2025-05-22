import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import RestaurantService from "../../services/restaurantService";
import { scrollToPosition } from "../../utils/handleScroll";
import { useEffect, useState, Fragment } from "react";
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import PictureCarousel from "../../components/carousels/pictureCarousel";
import PictureList from "../../components/carousels/pictureList";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import SectionHeading from '../../components/headings/sectionHeading';
import HomeIcon from '@mui/icons-material/Home';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import TableBarIcon from '@mui/icons-material/TableBar';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Person4Icon from '@mui/icons-material/Person4';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BookingDialog from '../../components/dialogs/bookingDialog';
import VoucherService from '../../services/voucherService';
import DishService from '../../services/dishService';
import NotificationSnackbar from '../../components/snackbars/notificationSnackbar';
import VoucherCardCarousel from '../../components/carousels/voucherCardCarousel';
import DishCardCarousel from '../../components/carousels/dishCardCarousel';
import MiniMap from '../../components/minimap/miniMap';
import ImageService from '../../services/imageService';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#d02028',
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

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

const borderStyles = {
    bgcolor: 'background.paper',
    border: 1,
    borderRadius: '16px',
    BorderColor: '#d02028'
};

const adultsArr = (() => {
    const arr = [];
    var index = 0;
    for (var i = 1; i <= 100; i++) {
        arr[index] = i;
        ++index;
    }
    return arr;
})();

const childrenArr = (() => {
    const arr = [];
    var index = 0;
    for (var i = 0; i <= 100; i++) {
        arr[index] = i;
        ++index;
    }
    return arr;
})();

const minDate = dayjs().startOf('month');
const maxDate = dayjs().add(1, 'month').endOf('month');

const RestaurantDetail = () => {
    useEffect(() => {
        document.title = "Ratatouille | Đặt Bàn";
        scrollToPosition(800, 800);
    }, []);

    const navigate = useNavigate();
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const [restaurant, setRestaurant] = useState(null);
    const [search, setSearch] = useState('');
    const [adultsCount, setAdultsCount] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);
    const [bookingTime, setBookingTime] = useState(dayjs());
    const [openBookingDialog, setOpenBookingDialog] = useState(false);
    const [vouchers, setVouchers] = useState([]);
    const [dishes, setDishes] = useState([]);

    // Snackbar state
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [severityNotification, setSeverityNotification] = useState('info');

    // Images
    const [images, setImages] = useState([]);

    useEffect(() => {
        const fetchImages = async () => {
            const res = await ImageService.getImage(id);
            setImages(res.data);
        }
        fetchImages();
    }, [searchParams, useParams]);

    useEffect(() => {
        const fetchVouchers = async (restaurantId) => {
            try {
                const res = await VoucherService.getVouchersByRestaurantId(restaurantId);
                setVouchers(res?.data);
            } catch (error) {
                setOpenNotification(true);
                setMessageNotification(error.message);
                setSeverityNotification('error');
            }
        }
        fetchVouchers(id)
    }, [searchParams, useParams])

    useEffect(() => {
        const fetchDishes = async () => {
            try {
                const filter = {
                    restaurantId: id
                }
                const res = await DishService.getDishes(filter);
                setDishes(res?.data);
            } catch (error) {
                setOpenNotification(true);
                setMessageNotification(error.message);
                setSeverityNotification('error');
            }
        }
        fetchDishes()
    }, [id])

    useEffect(() => {
        const fetchRestaurant = async (restaurantId) => {
            try {
                const res = await RestaurantService.getRestaurant(restaurantId);
                setRestaurant(res.data);
            } catch (error) {
                navigate('/invalid');
            }
        };
        fetchRestaurant(id);
    }, [searchParams, useParams]);

    useEffect(() => {
        const fetchVouchers = async (restaurantId) => {
            try {
                const res = await VoucherService.getVouchersByRestaurantId(restaurantId);
                setVouchers(res.data);
            } catch (error) {
                setVouchers([]);
            }
        };
        id && fetchVouchers(id);
    }, [searchParams, useParams]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (search.length > 0) {
            navigate(`/restaurant?page=1&search=${search}`);
        } else {
            navigate(`/restaurant?page=1`);
        }
    };


    return (
        <>
            <ThemeProvider theme={theme}>
                <Grid container>
                    <Grid size={12}>
                        <SectionHeading headingTitle={'Tiến hành đặt bàn'} />
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
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

                    <Grid container spacing={3} sx={{ mb: 9, mx: 20 }}>
                        <Grid size={8} >
                            <Grid container spacing={3}>
                                <Grid size={12} >
                                    <Box sx={{ ...borderStyles, p: 1 }}>
                                        <PictureCarousel pictures={images} ></PictureCarousel>
                                    </Box>
                                </Grid>
                                <Grid size={12} >
                                    <Box sx={{ ...borderStyles, p: 1, width: '100%' }}>
                                        <Box sx={{ p: 2, color: 'black' }} >
                                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                {restaurant?.name}
                                            </Typography>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                Thông tin cơ bản
                                            </Typography>
                                            <Box sx={{ display: 'flex' }}>
                                                <HomeIcon sx={{ mr: 1, color: "#d02028" }}></HomeIcon>
                                                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                    Địa chỉ:
                                                </Typography>
                                                <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                                                    {restaurant?.address}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex' }}>
                                                <LocalPhoneIcon sx={{ mr: 1, color: "#d02028" }}></LocalPhoneIcon>
                                                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                    Số điện thoại liên hệ:
                                                </Typography>
                                                <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                                                    {restaurant?.phoneNumber}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex' }}>
                                                <ApartmentIcon sx={{ mr: 1, color: "#d02028" }}></ApartmentIcon>
                                                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                    Tổng số tầng:
                                                </Typography>
                                                <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                                                    {restaurant?.totalFloor}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex' }}>
                                                <TableBarIcon sx={{ mr: 1, color: "#d02028" }}></TableBarIcon>
                                                <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                    Tổng số bàn ăn:
                                                </Typography>
                                                <Typography variant="body1" gutterBottom sx={{ ml: 1 }}>
                                                    {restaurant?.totalTable}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                    Giới thiệu
                                                </Typography>
                                                <Typography variant="body1" gutterBottom>
                                                    {restaurant?.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={12} width={'100%'}>
                                    <Box sx={{ ...borderStyles, p: 1 }}>
                                        <Box sx={{ p: 2, color: 'black' }}>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                Giờ hoạt động
                                            </Typography>
                                        </Box>
                                        <TableContainer component={Paper}>
                                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                                <TableHead>
                                                    <TableRow>
                                                        <StyledTableCell>Thứ</StyledTableCell>
                                                        <StyledTableCell align="right">Thứ Hai</StyledTableCell>
                                                        <StyledTableCell align="right">Thứ Ba</StyledTableCell>
                                                        <StyledTableCell align="right">Thứ Tư</StyledTableCell>
                                                        <StyledTableCell align="right">Thứ Năm</StyledTableCell>
                                                        <StyledTableCell align="right">Thứ Sáu</StyledTableCell>
                                                        <StyledTableCell align="right">Thứ Bảy</StyledTableCell>
                                                        <StyledTableCell align="right">Chủ Nhật</StyledTableCell>

                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    <StyledTableRow >
                                                        <StyledTableCell component="th" scope="row">
                                                            Giờ mở cửa
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.monday?.open}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.tuesday?.open}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.wednesday?.open}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.thursday?.open}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.friday?.open}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.saturday?.open}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.sunday?.open}</StyledTableCell>
                                                    </StyledTableRow>
                                                    <StyledTableRow >
                                                        <StyledTableCell component="th" scope="row">
                                                            Giờ đóng cửa
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.monday?.close}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.tuesday?.close}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.wednesday?.close}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.thursday?.close}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.friday?.close}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.saturday?.close}</StyledTableCell>
                                                        <StyledTableCell align="right">{restaurant?.activeTime?.sunday?.close}</StyledTableCell>
                                                    </StyledTableRow>

                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                </Grid>
                                <Grid size={12} width={'100%'}>
                                    <Box sx={{ ...borderStyles, p: 1 }}>
                                        <Box sx={{ p: 2, color: 'black' }}>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                Dịch vụ cung cấp
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    p: 1,
                                                    m: 1,
                                                    bgcolor: 'background.paper',
                                                    borderRadius: 1,
                                                }}
                                            >

                                                <List >
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.projector ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Máy chiếu"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.childSeat ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Ghế cho trẻ em"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.privateRoom ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Phòng riêng"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.balconyTable ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Bàn ban công"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.childrenArea ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Khu vực vui chơi trẻ em"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.smokingArea ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Khu vực hút thuốc"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.karaoke ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Karaoke"
                                                        />
                                                    </ListItem>
                                                </List>
                                                <List >
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.eventDecoration ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Trang trí sự kiện"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.cashPayment ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Hỗ trợ thanh toán tiền mặt"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.visaCard ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Hỗ trợ thanh toán bằng thẻ Visa"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.carParking ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Chỗ để xe ô tô"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.motorbikeParking ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Chỗ để xe máy"
                                                        />
                                                    </ListItem>
                                                    <ListItem>
                                                        <ListItemIcon>
                                                            {
                                                                restaurant?.services?.mc ? <CheckCircleIcon color={'success'} /> : <HighlightOffIcon color={'error'} />
                                                            }
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="MC dẫn chương trình"
                                                        />
                                                    </ListItem>
                                                </List>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid size={12} width={'100%'}>
                                    <Box sx={{ ...borderStyles, p: 1, bgcolor: '#d02028' }}>
                                        <Box sx={{ p: 2, color: 'white' }}>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                Các Món Ăn nhà hàng cung cấp
                                            </Typography>
                                        </Box>
                                        <DishCardCarousel dishes={dishes} slidesPerView={2}></DishCardCarousel>
                                    </Box>
                                </Grid>
                                <Grid size={12} width={'100%'} >
                                    <Box sx={{ ...borderStyles, p: 1, bgcolor: '#d02028' }}>
                                        <Box sx={{ p: 2, color: 'white' }}>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                                Các Voucher nhà hàng cung cấp
                                            </Typography>
                                        </Box>
                                        <VoucherCardCarousel vouchers={vouchers} slidesPerView={2}></VoucherCardCarousel>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid size={4}>
                            <Grid container spacing={3}>
                                <Grid size={12} >
                                    <Box sx={{ ...borderStyles, p: 1 }}>
                                        <PictureList pictures={images} ></PictureList>
                                    </Box>
                                </Grid>
                                <Grid size={12} width={'100%'}>
                                    <Box sx={{ ...borderStyles, p: 1 }}>
                                        <Box sx={{ p: 2, color: 'black', display: 'flex' }}>
                                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                Đặt bàn
                                            </Typography>
                                            <Typography variant="body1" gutterBottom sx={{ ml: 1, alignSelf: 'center' }}>
                                                (Để có chỗ trước khi đến)
                                            </Typography>
                                        </Box>
                                        <Box >
                                            <Grid container spacing={1}>
                                                <Grid size={6} >
                                                    <Box sx={{ width: '100%' }}>
                                                        <Box sx={{ display: 'flex' }}>
                                                            <Person4Icon sx={{ mr: 1, color: "#d02028" }}></Person4Icon>
                                                            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                                Người lớn:
                                                            </Typography>
                                                        </Box>
                                                        <FormControl sx={{ width: '100%' }}>
                                                            <Select
                                                                displayEmpty
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                value={adultsCount}
                                                                onChange={(e) => setAdultsCount(e.target.value)}
                                                                size="small"
                                                            >
                                                                {
                                                                    adultsArr?.length > 0 && adultsArr.map(number => {
                                                                        return (
                                                                            <MenuItem key={number} value={number}>{number}</MenuItem>
                                                                        )
                                                                    })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </Box>
                                                </Grid>
                                                <Grid size={6} >
                                                    <Box sx={{ width: '100%' }}>
                                                        <Box sx={{ display: 'flex' }}>
                                                            <ChildCareIcon sx={{ mr: 1, color: "#d02028" }}></ChildCareIcon>
                                                            <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                                Trẻ em:
                                                            </Typography>
                                                        </Box>
                                                        <FormControl sx={{ width: '100%' }}>
                                                            <Select
                                                                displayEmpty
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                                value={childrenCount}
                                                                onChange={(e) => setChildrenCount(e.target.value)}
                                                                size="small"
                                                            >
                                                                {
                                                                    childrenArr?.length > 0 && childrenArr.map(number => {
                                                                        return (
                                                                            <MenuItem key={number} value={number}>{number}</MenuItem>
                                                                        )
                                                                    })
                                                                }
                                                            </Select>
                                                        </FormControl>
                                                    </Box>
                                                </Grid>
                                                <Grid size={12} sx={{ mt: 3 }} >
                                                    <Box sx={{ display: 'flex' }}>
                                                        <AccessTimeIcon sx={{ mr: 1, color: "#d02028" }}></AccessTimeIcon>
                                                        <Typography variant="body1" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Thời gian đến
                                                        </Typography>
                                                    </Box>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['TimePicker']}>
                                                            <DatePicker
                                                                sx={{ width: '100%' }}
                                                                value={bookingTime}
                                                                minDate={minDate}
                                                                maxDate={maxDate}
                                                                onChange={(newValue) => {
                                                                    setBookingTime(newValue)
                                                                }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid size={12}>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <DemoContainer components={['TimePicker']}>
                                                            <TimePicker
                                                                sx={{ width: '100%' }}
                                                                value={bookingTime}
                                                                onChange={(newValue) => {
                                                                    setBookingTime(newValue)
                                                                }}
                                                            />
                                                        </DemoContainer>
                                                    </LocalizationProvider>
                                                </Grid>
                                                <Grid size={12} sx={{ mt: 4 }}>
                                                    <Button sx={{ width: '100%' }} variant="contained" onClick={() => setOpenBookingDialog(true)}>Đặt chỗ ngay</Button>
                                                </Grid>
                                            </Grid>

                                        </Box>
                                    </Box>
                                </Grid>
                                {
                                    restaurant?.location?.coordinates && (
                                        <Grid size={12} sx={{ width: "100%" }}>
                                            <Box sx={{ ...borderStyles, p: 1 }}>
                                                <MiniMap positions={[restaurant?.location?.coordinates]}></MiniMap>
                                            </Box>
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid >
                <BookingDialog
                    open={openBookingDialog}
                    setOpen={setOpenBookingDialog}
                    adultsCount={adultsCount}
                    setAdultsCount={setAdultsCount}
                    childrenCount={childrenCount}
                    setChildrenCount={setChildrenCount}
                    bookingTime={bookingTime}
                    setBookingTime={setBookingTime}
                    restaurant={restaurant}
                />
            </ThemeProvider >
            <NotificationSnackbar open={openNotification} setOpen={setOpenNotification} message={messageNotification} severity={severityNotification}></NotificationSnackbar>
        </>
    )
}

export default RestaurantDetail;