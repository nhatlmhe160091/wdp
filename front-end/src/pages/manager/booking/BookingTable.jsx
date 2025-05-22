import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const bookings = [
  { name: 'Buzz', mobile: '8053667426', time: '02:30', date: '23/11/2022', people: 3, tableSize: 4, status: 'Cancelled' },
  { name: 'Dustin', mobile: '8053667426', time: '12:30', date: '25/12/2022', people: 5, tableSize: 1, status: 'Active' },
  { name: 'Mark', mobile: '8053667426', time: '02:30', date: '23/11/2022', people: 7, tableSize: 4, status: 'Waiting' },
  { name: 'Dustin', mobile: '8053667426', time: '12:30', date: '25/12/2022', people: 1, tableSize: 5, status: 'Active' },
  { name: 'Cynthia', mobile: '8053667426', time: '02:30', date: '23/11/2022', people: 2, tableSize: 6, status: 'Waiting' },
];

const getStatusStyle = (status) => {
  switch (status) {
    case 'Cancelled':
      return { color: 'red' };
    case 'Active':
      return { color: 'green' };
    case 'Waiting':
      return { color: 'orange' };
    default:
      return {};
  }
};

const BookingTable = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Mobile No</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>People</TableCell>
            <TableCell>Table Size</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: index % 2 === 1 ? '#fef7f2' : 'inherit',
              }}
            >
              <TableCell padding="checkbox">
                <Checkbox />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.mobile}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.people}</TableCell>
              <TableCell>{row.tableSize}</TableCell>
              <TableCell>
                <Typography style={getStatusStyle(row.status)}>
                  {row.status}
                </Typography>
              </TableCell>
              <TableCell>
                <IconButton aria-label="delete" size="small">
                  <DeleteIcon color="error" />
                </IconButton>
                {row.status !== 'Cancelled' && (
                  <Typography
                    sx={{ cursor: 'pointer', textDecoration: 'underline', color: '#ff5722' }}
                  >
                    {row.status === 'Active' ? 'Guest' : 'See Profile'}
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default BookingTable;
