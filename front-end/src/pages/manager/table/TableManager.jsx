import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Card,
  CardContent,
  Button,
  IconButton,
} from '@mui/material';
import { BsPencilSquare, BsCheckCircle, BsXCircle, BsPlus, BsSearch } from 'react-icons/bs';

// Dữ liệu các bàn và đặt chỗ
const tables = [
  { tableNumber: 1, capacity: 4 },
  { tableNumber: 2, capacity: 2 },
  { tableNumber: 3, capacity: 4 },
  { tableNumber: 4, capacity: 6 },
  { tableNumber: 5, capacity: 6 },
];

const reservations = [
  {
    bookingDate: '2024-10-09',
    bookingTime: '00:15 AM',
    customer: { name: 'Bob Smith' },
    tableNumber: 4,
    adultsCount: 4,
    childrenCount: 2,
    status: 'CONFIRMED',
  },
  {
    bookingDate: '2024-10-09',
    bookingTime: '00:30 AM',
    customer: { name: 'James Wann' },
    tableNumber: 4,
    adultsCount: 4,
    childrenCount: 2,
    status: 'PENDING',
  },
];

const timeSlots = [
  { start: '00:00 AM', end: '02:00 AM' },
  { start: '02:00 AM', end: '04:00 AM' },
  { start: '04:00 AM', end: '06:00 AM' },
  { start: '06:00 AM', end: '08:00 AM' },
  { start: '08:00 AM', end: '10:00 AM' },
  { start: '10:00 AM', end: '12:00 PM' },
];

const generateTimeIntervals = (startHour, intervalMinutes) => {
  let intervals = [];
  for (let i = 15; i <= 60; i += intervalMinutes) {
    intervals.push(`${startHour}:${i.toString().padStart(2, '0')} AM`);
  }
  return intervals;
};

const getReservationForTableAndTime = (tableNumber, time) => {
  return reservations.find((res) => res.tableNumber === tableNumber && res.bookingTime === time);
};

const TableManager = () => {
  const [location, setLocation] = useState('Ha Noi');
  const [branch, setBranch] = useState('Dookki Vincom Tran...');
  const [searchName, setSearchName] = useState('');

  return (
    <Container sx={{ my: 4 }}>
      <Typography variant="h4" textAlign="center" gutterBottom>
        Table Booking Management
      </Typography>

      {/* Bộ lọc */}
      <Grid container spacing={2} mb={4}>
        <Grid item xs={12} md={3}>
          <Typography>Location</Typography>
          <Select
            fullWidth
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <MenuItem value="Ha Noi">Ha Noi</MenuItem>
            <MenuItem value="Ho Chi Minh">Ho Chi Minh</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>Branch</Typography>
          <Select
            fullWidth
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <MenuItem value="Dookki Vincom Tran...">Dookki Vincom Tran...</MenuItem>
            <MenuItem value="Another Branch">Another Branch</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>Search Name</Typography>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by customer name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton>
                  <BsSearch />
                </IconButton>
              ),
            }}
          />
        </Grid>
      </Grid>

      {/* Cấu trúc bảng */}
      <Card>
        <CardContent>
          <Grid container spacing={2} sx={{ borderBottom: 1, pb: 2, mb: 3 }}>
            <Grid item xs={2}>
              <Typography variant="h6">Timeslot</Typography>
            </Grid>
            {tables.map((table) => (
              <Grid item xs={2} key={table.tableNumber}>
                <Typography align="center" variant="h6">
                  Table {table.tableNumber} <br /> (Capacity: {table.capacity})
                </Typography>
              </Grid>
            ))}
          </Grid>

          {timeSlots.map((slot, index) => {
            const timeIntervals = generateTimeIntervals(slot.start.split(':')[0], 15);

            return (
              <Grid container spacing={2} key={index} sx={{ py: 3, borderBottom: 1 }}>
                <Grid item xs={2}>
                  <Typography><strong>{slot.start} - {slot.end}</strong></Typography>
                </Grid>

                {tables.map((table, tableIndex) => {
                  let reservationFound = false;

                  return (
                    <Grid item xs={2} key={tableIndex}>
                      <Card sx={{ textAlign: 'center', p: 2 }}>
                        {timeIntervals.map((time, idx) => {
                          const reservation = getReservationForTableAndTime(table.tableNumber, time);

                          if (reservation) {
                            return (
                              <Box key={idx}>
                                <Typography variant="h6">{reservation.customer.name}</Typography>
                                <Typography>
                                  {reservation.adultsCount} Adults, {reservation.childrenCount} Children
                                </Typography>
                                <Box display="flex" justifyContent="center">
                                  <IconButton color="primary">
                                    <BsPencilSquare />
                                  </IconButton>
                                  {reservation.status === 'CONFIRMED' ? (
                                    <IconButton color="success">
                                      <BsCheckCircle />
                                    </IconButton>
                                  ) : (
                                    <IconButton color="error">
                                      <BsXCircle />
                                    </IconButton>
                                  )}
                                </Box>
                              </Box>
                            );
                          } else if (!reservationFound) {
                            reservationFound = true;

                            return (
                              <Button
                                key={idx}
                                variant="outlined"
                                color="error"
                                size="small"
                                sx={{ mb: 2 }}
                                startIcon={<BsPlus />}
                              >
                                Reserve {time}
                              </Button>
                            );
                          }

                          return null;
                        })}
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            );
          })}
        </CardContent>
      </Card>
    </Container>
  );
};

export default TableManager;
