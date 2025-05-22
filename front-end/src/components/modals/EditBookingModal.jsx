import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
  Grid,
  MenuItem,
} from '@mui/material';
import BookingService from '../../services/bookingService';
const statusMapping = {
  PENDING: 'Đang xử lí',
  CONFIRMED: 'Đã xác nhận',
  TABLE_ASSIGNED: 'Đã xếp bàn',
  CANCELLED: 'Đã Hủy',
  COMPLETED: 'Đã hoàn thành'
};

const getStatusInVietnamese = (status) => {
  return statusMapping[status] || status;
};
const EditBookingModal = ({ open, onClose, bookingData,fetchBookings }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (bookingData) {
      const bookingDate = new Date(bookingData.bookingTime);
      setSelectedDate(bookingDate.toISOString().split('T')[0]);
      setSelectedTime(bookingDate.toTimeString().split(' ')[0].substring(0, 5));
      setAdultsCount(bookingData.adultsCount);
      setChildrenCount(bookingData.childrenCount);
      setNote(bookingData.note);
      setStatus(bookingData.status);
    }
  }, [bookingData]);

  const handleSave = async () => {
    try {
      const updatedBooking = {
        bookingTime:new Date(`${selectedDate}T${selectedTime}:00`) ,
        adultsCount: adultsCount,
        childrenCount,
        note,
        status,
      };

      await BookingService.updateBooking( bookingData._id, updatedBooking);
      alert('Booking updated successfully!');
      fetchBookings();
      onClose();
    } catch (error) {
      console.error('Error updating booking:', error?.message);
      alert(error?.message);
    }
  };
// console.log("bookingDataEdit",bookingData);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <Box p={3}>
        <DialogTitle>Chỉnh sửa thông tin đặt bàn</DialogTitle>

        {/* <Box textAlign="center" mt={2}>
          <Typography variant="h6">{bookingData?.customer || 'Customer Name'}</Typography>
          <Typography color="textSecondary">{bookingData?.guest?.phone || 'Customer Phone'}</Typography>
        </Box> */}

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <TextField
              type="Ngày đến"
              label="Date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              type="Thời gian đến"
              label="Time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Người lớn"
              type="number"
              value={adultsCount}
              onChange={(e) => setAdultsCount(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Trẻ em"
              type="number"
              value={childrenCount}
              onChange={(e) => setChildrenCount(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Ghi chú thêm"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="PENDING">{getStatusInVietnamese('PENDING')}</MenuItem>
              <MenuItem value="CONFIRMED">{getStatusInVietnamese('CONFIRMED')}</MenuItem>
              <MenuItem value="TABLE_ASSIGNED">{getStatusInVietnamese('TABLE_ASSIGNED')}</MenuItem>
              <MenuItem value="CANCELLED">{getStatusInVietnamese('CANCELLED')}</MenuItem>
              <MenuItem value="COMPLETED">{getStatusInVietnamese('COMPLETED')}</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          sx={{ mt: 2, width: '100%', bgcolor: '#f5b942' }}
          onClick={handleSave}
        >
          Lưu thay đổi
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditBookingModal;