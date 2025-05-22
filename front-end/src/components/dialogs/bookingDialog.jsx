import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
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
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { useState, useEffect } from 'react';
import SendIcon from '@mui/icons-material/Send';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useAuth } from '../../contexts/authContext';
import BookingService from '../../services/bookingService';
import GuestService from '../../services/guestService';
import ThankForBooking from './thankForBooking';
import EditProfileDialog from './editProfileDialog';
import { auth } from '../../firebase/firebase';
import NotificationSnackbar from '../snackbars/notificationSnackbar';
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

export default function BookingDialog({ open, setOpen, adultsCount, setAdultsCount, childrenCount, setChildrenCount, bookingTime, setBookingTime, restaurant }) {
    const { currentUser, isUserLoggedIn } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [note, setNote] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [openThankDialog, setOpenThankDialog] = useState(false);
    const [openEditProfileDialog, setOpenEditProfileDialog] = useState(false);
    const [otp, setOtp] = useState('');

    // Snackbar state
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [severityNotification, setSeverityNotification] = useState('info');

    useEffect(() => {
        if (isUserLoggedIn) {
            setName(currentUser?.lname + " " + currentUser?.fname);
            setEmail(currentUser?.email);
            setPhoneNumber(currentUser?.phoneNumber);
        }
    }, [open, setOpen, useAuth])

    const handleClose = () => {
        setOpen(false);
    };

    const handleBooking = async () => {
        var guestId = null;
        if (!isUserLoggedIn) {
            const filter = {
                name,
                phoneNumber,
                email
            };
            try {
                const res = await GuestService.insertGuest(filter);
                guestId = res?.data?._id
            } catch (error) {
                setOpenNotification(true);
                setMessageNotification(error.message);
                setSeverityNotification('error');
                return;
            }
        }
        try {
            const filter = {
                bookingTime: bookingTime.toDate(),
                customerId: currentUser?._id,
                guestId: guestId,
                note,
                adultsCount,
                childrenCount,
                restaurantId: restaurant?._id,
            }
            await BookingService.insertBooking(filter);
            setOpenThankDialog(true);
            setOpen(false);
        } catch (error) {
            setOpenNotification(true);
            setMessageNotification(error.message);
            setSeverityNotification('error');
        }
    }


    // const handleSendOtp = async () => {
    //     try {
    //         if (phoneNumber) {
    //             const response = await BookingService.sendOtp(phoneNumber);
    //             console.log(response);
    //         }
    //     } catch (err) {
    //         console.log(err.message);
    //     }
    // }

    // const handleVerifyOtp = async () => {
    //     try {
    //         const response = await BookingService.sendOtp(phoneNumber, otp);
    //         console.log(response);
    //     } catch (err) {
    //         console.log(err.message);
    //     }
    // }
console.log("restaurant", restaurant);
    return (
        <React.Fragment>
            <Dialog
                sx={{ width: '100%' }}
                maxWidth='lg'
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    <Typography variant='h5' gutterBottom sx={{ fontWeight: 'bold', color: 'black', p: 2, textTransform: 'uppercase', color: "#d02028" }}>
                        Đặt bàn tại "{restaurant?.name}"
                    </Typography>
                </DialogTitle>
                <DialogContent >
                    <Grid container spacing={3}>
                        {isUserLoggedIn ?
                            (<Grid size={7} >
                                <Box sx={{ ...borderStyles, p: 1 }}>
                                    <Box sx={{ p: 2, display: 'flex' }}>
                                        <Grid container spacing={1}>
                                            <Grid size={12} sx={{ color: 'black', display: 'flex' }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                    Thông tin người đặt
                                                </Typography>
                                            </Grid>
                                            <Grid size={12} sx={{ mb: 3 }}>
                                                <Divider></Divider>
                                            </Grid>
                                            <Grid size={6}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Tên liên lạc
                                                        </Typography>
                                                    </Box>
                                                    <TextField variant="outlined" sx={{ width: "100%" }} size="small"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        slotProps={{
                                                            input: {
                                                                readOnly: true,
                                                            },
                                                        }}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid size={6} >
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Địa chỉ Email
                                                        </Typography>
                                                    </Box>
                                                    <TextField variant="outlined" sx={{ width: "100%" }} size="small"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        slotProps={{
                                                            input: {
                                                                readOnly: true,
                                                            },
                                                        }}
                                                        required
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid size={12} sx={{ mt: 2 }}>
                                            </Grid>
                                            <Grid size={7}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Số điện thoại
                                                        </Typography>
                                                    </Box>
                                                    <Paper
                                                        component="form"
                                                        sx={{ display: 'flex', alignItems: 'center' }}
                                                    >
                                                        <InputBase
                                                            placeholder="Nhập số điện thoại và gửi mã OTP"
                                                            sx={{ ml: 2, flex: 1 }}
                                                            slotProps={{
                                                                input: {
                                                                    readOnly: true,
                                                                },
                                                            }}
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                                        />
                                                        {/* <Tooltip title="Gửi mã OTP" >
                                                            <IconButton type="button" color="primary" >
                                                                <SendIcon />
                                                            </IconButton>
                                                        </Tooltip> */}
                                                    </Paper>
                                                </Box>
                                            </Grid>
                                            {/* <Grid size={5}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Nhập mã OTP
                                                        </Typography>
                                                    </Box>
                                                    <TextField variant="outlined" sx={{ width: "100%" }} size="small"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                    />
                                                </Box>
                                            </Grid> */}
                                            <Grid size={12}>
                                                <Box sx={{ width: '100%', mt: 2 }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Ghi chú thêm
                                                        </Typography>
                                                    </Box>
                                                    <TextField
                                                        variant="outlined"
                                                        sx={{ width: "100%" }}
                                                        size="small"
                                                        multiline
                                                        rows={4}
                                                        value={note}
                                                        onChange={(e) => setNote(e.target.value)}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>)
                            :
                            (<Grid size={7} >
                                <Box sx={{ ...borderStyles, p: 1 }}>
                                    <Box sx={{ p: 2, display: 'flex' }}>
                                        <Grid container spacing={1}>
                                            <Grid size={12} sx={{ color: 'black', display: 'flex' }}>
                                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                    Thông tin người đặt
                                                </Typography>
                                            </Grid>
                                            <Grid size={12} sx={{ mb: 3 }}>
                                                <Divider></Divider>
                                            </Grid>
                                            <Grid size={6}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Tên liên lạc
                                                        </Typography>
                                                    </Box>
                                                    <TextField variant="outlined" sx={{ width: "100%" }} size="small"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid size={6} >
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Địa chỉ Email
                                                        </Typography>
                                                    </Box>
                                                    <TextField variant="outlined" sx={{ width: "100%" }} size="small"
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid size={12} sx={{ mt: 2 }}>
                                            </Grid>
                                            <Grid size={7}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Số điện thoại
                                                        </Typography>
                                                    </Box>
                                                    <Paper
                                                        component="form"
                                                        sx={{ display: 'flex', alignItems: 'center' }}
                                                    >
                                                        <InputBase
                                                            placeholder="Nhập số điện thoại"
                                                            sx={{ ml: 2, flex: 1 }}
                                                            value={phoneNumber}
                                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                                        />
                                                        {/* <Tooltip title="Gửi mã OTP">
                                                            <IconButton type="button" color="primary"  >
                                                                <SendIcon />
                                                            </IconButton>
                                                        </Tooltip> */}
                                                    </Paper>
                                                </Box>
                                            </Grid>
                                            {/* <Grid size={5}>
                                                <Box sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Nhập mã OTP
                                                        </Typography>
                                                    </Box>
                                                    <TextField variant="outlined" sx={{ width: "100%" }} size="small"
                                                        value={otp}
                                                        onChange={(e) => setOtp(e.target.value)}
                                                    />
                                                </Box>
                                            </Grid> */}
                                            <Grid size={12}>
                                                <Box sx={{ width: '100%', mt: 2 }}>
                                                    <Box sx={{ display: 'flex' }}>
                                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                            Ghi chú thêm
                                                        </Typography>
                                                    </Box>
                                                    <TextField
                                                        variant="outlined"
                                                        sx={{ width: "100%" }}
                                                        size="small"
                                                        multiline
                                                        rows={4}
                                                        value={note}
                                                        onChange={(e) => setNote(e.target.value)}
                                                    />
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Box>
                            </Grid>)
                        }

                        <Grid size={5} >
                            <Box sx={{ ...borderStyles, p: 1 }}>
                                <Box sx={{ p: 2, display: 'flex' }}>
                                    <Grid container spacing={1}>
                                        <Grid size={12} sx={{ color: 'black', display: 'flex' }}>
                                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                Thông tin đặt chỗ
                                            </Typography>
                                        </Grid>
                                        <Grid size={12} sx={{ mb: 1 }}>
                                            <Divider></Divider>
                                        </Grid>
                                        <Grid size={6}>
                                            <Box sx={{ width: '100%' }}>
                                                <Box sx={{ display: 'flex' }}>
                                                    <Person4Icon sx={{ mr: 1, color: "#d02028" }}></Person4Icon>
                                                    <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
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
                                                    <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
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

                                        <Grid size={12} sx={{ mt: 2 }}>
                                            <Box sx={{ display: 'flex' }}>
                                                <AccessTimeIcon sx={{ mr: 1, color: "#d02028" }}></AccessTimeIcon>
                                                <Typography variant="body2" gutterBottom sx={{ fontWeight: 'bold', color: 'black' }}>
                                                    Thời gian đến
                                                </Typography>
                                            </Box>
                                            <LocalizationProvider dateAdapter={AdapterDayjs} >
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
                                                <DemoContainer components={['TimePicker']} >
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
                                    </Grid>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {isUserLoggedIn === true && currentUser?.role === 'CUSTOMER' && (<Button onClick={handleClose} sx={{ px: 4, mr: 'auto' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }} onClick={() => setOpenEditProfileDialog(true)}>
                            Sửa thông tin cá nhân
                        </Typography>
                    </Button>)}
                    <Button onClick={handleClose}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            Quay lại
                        </Typography>
                    </Button>
                    <Button onClick={handleBooking}> <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Đặt bàn
                    </Typography></Button>
                </DialogActions>
            </Dialog>
            <NotificationSnackbar ></NotificationSnackbar>
            <ThankForBooking open={openThankDialog} setOpen={setOpenThankDialog}></ThankForBooking>
            <EditProfileDialog open={openEditProfileDialog} setOpen={setOpenEditProfileDialog}></EditProfileDialog>
            <NotificationSnackbar open={openNotification} setOpen={setOpenNotification} message={messageNotification} severity={severityNotification}></NotificationSnackbar>
        </React.Fragment >
    );
}
