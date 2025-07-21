import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Divider from '@mui/material/Divider';
import DialogContentText from '@mui/material/DialogContentText';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { useAuth } from "../../contexts/authContext";
import LoadingOverlay from '../general/loadingOverlay';
import NotificationSnackbar from '../snackbars/notificationSnackbar';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import UserService from '../../services/userService';

export default function LoginDialog({ open, setOpen }) {
    const navigate = useNavigate();
    const { isUserLoggedIn, loading } = useAuth();
    const [tab, setTab] = useState(0);

    // Email login
    const [email, setEmail] = useState('');
    // Phone login
    const [phoneNumber, setPhoneNumber] = useState('');
    // Common
    const [password, setPassword] = useState('');
    const [openForgotPasswordDialog, setOpenForgotPasswordDialog] = useState(false);

    // Snackbar state
    const [openNotification, setOpenNotification] = useState(false);
    const [messageNotification, setMessageNotification] = useState('');
    const [severityNotification, setSeverityNotification] = useState('info');

    const handleClose = () => {
        setOpen(false);
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        setPassword('');
        setEmail('');
        setPhoneNumber('');
    };

   const handleOnSubmit = async (event) => {
    event.preventDefault();
    if (!isUserLoggedIn) {
        try {
            if (tab === 0) {
                // Đăng nhập bằng email
                await doSignInWithEmailAndPassword(email, password);
            } else {
                // Đăng nhập bằng sđt
                const data = await UserService.getEmailByPhoneNumber(phoneNumber);
                console.log("email",data.email)
                await doSignInWithEmailAndPassword(data.email, password);
            }
            handleClose();
            navigate('/');
        } catch (error) {
            setMessageNotification("Tài khoản hoặc mật khẩu của bạn không chính xác");
            setSeverityNotification("error");
            setOpenNotification(true);
        }
    }
}

    return (
        <React.Fragment>
            <NotificationSnackbar open={openNotification} setOpen={setOpenNotification} message={messageNotification} severity={severityNotification}></NotificationSnackbar>
            <ForgotPasswordDialog open={openForgotPasswordDialog} setOpen={setOpenForgotPasswordDialog}></ForgotPasswordDialog>
            <Dialog open={open} onClose={handleClose}>
                <LoadingOverlay open={loading}></LoadingOverlay>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: 'h4.fontSize', textAlign: 'center' }}>Đăng nhập</DialogTitle>
                <DialogContentText sx={{ fontSize: 'normal', textAlign: 'center', mb: 2 }}>
                    Chào mừng bạn đến với Reservation Service
                </DialogContentText>
                <Tabs value={tab} onChange={handleTabChange} centered>
                    <Tab label="Email" />
                    <Tab label="Số điện thoại" />
                </Tabs>
                <Divider orientation="horizontal" flexItem />
                <DialogContent>
                    {tab === 0 ? (
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            label="Địa chỉ email"
                            type="email"
                            fullWidth
                            variant="standard"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    ) : (
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            label="Số điện thoại"
                            type="tel"
                            fullWidth
                            variant="standard"
                            value={phoneNumber}
                            onChange={e => setPhoneNumber(e.target.value)}
                        />
                    )}
                    <TextField
                        required
                        margin="dense"
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        handleClose();
                        setOpenForgotPasswordDialog(true);
                    }} sx={{ mr: 'auto' }}>Quên mật khẩu</Button>
                    <Button onClick={handleOnSubmit}>Đăng nhập</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}