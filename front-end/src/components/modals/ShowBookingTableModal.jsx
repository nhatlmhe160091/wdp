import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Grid,
  Button,
    Divider,
} from '@mui/material';
import BookingService from '../../services/bookingService';

function ShowBookingTableModal({ tableId,tableNumber, open, onClose }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (open && tableId) {
      const fetchBookings = async () => {
        try {
          const response = await BookingService.getBookingsByTableId(tableId);
          setBookings(response.data);
          console.log("bookings", bookings);
        } catch (error) {
          console.error("Error fetching bookings:", error);
        }
      };
      fetchBookings();
    }
  }, [open, tableId]);
console.log("tableId, open, onClose", tableId, open, onClose)
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Lịch đặt bàn cho bàn số {tableNumber}</DialogTitle>
      <DialogContent dividers>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <Grid container spacing={2} key={booking._id} style={{ marginBottom: '16px' }}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Thời gian đặt bàn:</strong> {new Date(booking.bookingTime).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Khách hàng:</strong> {booking.customer ? `${booking.customer.fname} ${booking.customer.lname}` : 'Không'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Khách lạ:</strong> {booking.guest ? `${booking.guest.fname} ${booking.guest.lname}` : 'Không'}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body1">
                  <strong>Số người:</strong> {booking.adultsCount} Người lớn, {booking.childrenCount} Trẻ em
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body1">
                  <strong>Ghi chú:</strong> {booking.note?.length > 0 ? booking.note : 'Không'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography>No bookings available for this table.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShowBookingTableModal;
