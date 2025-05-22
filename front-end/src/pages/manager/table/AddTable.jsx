// import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
// import Zoom from '@mui/material/Zoom';
// import Fab from '@mui/material/Fab';
// import Tooltip from '@mui/material/Tooltip';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import TextField from '@mui/material/TextField';
// import AddIcon from '@mui/icons-material/Add';
// import Grid from '@mui/material/Grid';
// import Button from '@mui/material/Button';
// import Notification from './Notification';
// import UserService from '../../../services/api/UserService';
// import TableService from '../services/tableService';

// export default function AddTable() {
//     const theme = useTheme();
//     const [open, setOpen] = React.useState(false);
//     const [tableNumber, setTableNumber] = React.useState('');
//     const [capacity, setCapacity] = React.useState('');
//     const [notification, setNotification] = React.useState({ open: false, message: '', severity: '' });
    
//     const handleClickOpen = () => {
//         setOpen(true);
//     };
    
//     const handleClose = () => {
//         setOpen(false);
//     };
    
//     const handleAddTable = async () => {
//         try {
//         const response = await TableService.createTable();
//         if (response.status === 201) {
//             setNotification({
//             open: true,
//             message: 'Table added successfully',
//             severity: 'success',
//             });
//             setOpen(false);
//         }
//         } catch (error) {
//         setNotification({
//             open: true,
//             message: 'Failed to add table',
//             severity: 'error',
//         });
//         }
//     };
    
//     return (
//         <div>
//         <Tooltip title="Add Table" aria-label="add-table">
//             <Zoom in={true} timeout={theme.transitions.duration.enteringScreen}>
//             <Fab color="primary" onClick={handleClickOpen}>
//                 <AddIcon />
//             </Fab>
//             </Zoom>
//         </Tooltip>
//         <Dialog open={open} onClose={handleClose}>
//             <DialogTitle>Add Table</DialogTitle>
//             <DialogContent>
//             <DialogContentText>
//                 To add a table, please enter the table number and capacity here.
//             </DialogContentText>
//             <Grid container spacing={2}>
//                 <Grid item xs={12}>
//                 <TextField
//                     autoFocus
//                     margin="dense"
//                     id="tableNumber"
//                     label="Table Number"
//                     type="text"
//                     fullWidth
//                     value={tableNumber}
//                     onChange={(e) => setTableNumber(e.target.value)}
//                 />
//                 </Grid>
//                 <Grid item xs={12}>
//                 <TextField
//                     margin="dense"
//                     id="capacity"
//                     label="Capacity"
//                     type="number"
//                     fullWidth
//                     value={capacity}
//                     onChange={(e) => setCapacity(e.target.value)}
//                 />
//                 </Grid>
//             </Grid>
//             </DialogContent>
//             <DialogActions>
//             <Button onClick={handleClose} color="primary">
//                 Cancel
//             </Button>
//             <Button onClick={handleAddTable} color="primary">
//                 Add
//             </Button>
// }