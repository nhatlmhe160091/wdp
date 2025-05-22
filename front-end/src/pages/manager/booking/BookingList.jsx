import { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  IconButton,
  Tooltip,
  Box,
  Select,
  InputLabel,
  FormControl,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import BookingService from '../../../services/bookingService';
import Pagination from '@mui/material/Pagination';
import EditBookingModal from '../../../components/modals/EditBookingModal';
import CustomerDialog from './CustomerDialog';
import GuestDialog from './GuestDialog';
import AssignTableDialog from './AssignTableDialog';
import TableBookingDialog from './TableBookingDialog';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import RestaurantService from '../../../services/restaurantService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { formatDate, formatTime } from '../../../utils/handleFormat';

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
const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [openAssignTableDialog, setOpenAssignTableDialog] = useState(false);
  const [openEditBookingDialog, setOpenEditBookingDialog] = useState(false);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [timeFilter, setTimeFilter] = useState('');
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  useEffect(() => {
    fetchBookings();
  }, [page, limit, statusFilter, dateFilter, timeFilter, search, order, selectedRestaurantId]);
  useEffect(() => {
    fetchRestaurants();
  }, []);
  const fetchBookings = async () => {

    const data = await BookingService.getPaginatedBookings({
      page,
      limit,
      date: dateFilter,
      time: timeFilter,
      restaurant: selectedRestaurantId,
      search,
      status: statusFilter,
      sort: order,
    });
    setBookings(data.data);
    setTotalPages(data.totalPages);
  };
  const fetchRestaurants = async () => {

    const data = await RestaurantService.getAllRestaurants();
    setRestaurants(data);
  };
  const handleAssignTable = (bookingId) => {
    const booking = bookings.find(b => b._id === bookingId);
    if (booking) {
      setSelectedRestaurantId(booking.restaurant._id);
      setSelectedBooking(booking);
      setOpenAssignTableDialog(true);
    }
  };

  // const handleDeleteBooking = async (bookingId) => {
  //   
  //   await BookingService.deleteBooking( bookingId);
  //   fetchBookings();
  // };

  // const handleSort = () => {
  //   setOrder(order === 'bookingTime' ? 'NotBookingTime' : 'bookingTime');
  // };
  const handleSort = () => {
    if (order === 'bookingTime') {
      setOrder('NotBookingTime');
    } else if (order === 'NotBookingTime') {
      setOrder('');
    } else {
      setOrder('bookingTime');
    }
  };
  const handleFilterChange = (event) => {
    setStatusFilter(event.target.value === "All" ? "" : event.target.value);
  };
  const handleRestaurantChange = (event) => {
    setSelectedRestaurantId(event.target.value === "All" ? "" : event.target.value);
  };
  const handleDateChange = (event) => {
    setDateFilter(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTimeFilter(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEditBooking = async (bookingId) => {
    try {

      const bookingDetails = await BookingService.getBookingById(bookingId);
      setSelectedBooking(bookingDetails.data);
      setOpenEditBookingDialog(true);
    } catch (error) {
      console.error('Failed to fetch booking details:', error);
    }
  };

  const handleCloseModal = () => {
    setOpenEditBookingDialog(false);
    setOpenAssignTableDialog(false);
    setSelectedBooking(null);
  };

  return (
    <>
      <Grid container spacing={3} >
        {/* Title */}
        <Grid item xs={12}>
          <Typography
            variant="h4"
            sx={{ textAlign: 'center', fontWeight: 'bold', color: '#3f51b5' }}
            gutterBottom
          >
            Quản lý Đặt bàn
          </Typography>
        </Grid>

        {/* Filters */}
        <Grid container item xs={12} spacing={2} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Status Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ backgroundColor: '#fff', borderRadius: '4px' }}>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                value={statusFilter}
                onChange={handleFilterChange}
                displayEmpty
                label="Status"
              >
                <MenuItem value="All">Tất cả</MenuItem>
                <MenuItem value="PENDING">Đang xử lí</MenuItem>
                <MenuItem value="CONFIRMED">Đã xác nhận</MenuItem>
                <MenuItem value="TABLE_ASSIGNED">Đã xếp bàn</MenuItem>
                <MenuItem value="CANCELLED">{getStatusInVietnamese('CANCELLED')}</MenuItem>
                <MenuItem value="COMPLETED">Đã hoàn thành</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Restaurant Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth sx={{ backgroundColor: '#fff', borderRadius: '4px' }}>
              <InputLabel>Nhà hàng</InputLabel>
              <Select
                value={selectedRestaurantId}
                onChange={handleRestaurantChange}
                displayEmpty
                label="Restaurant"
              >
                <MenuItem value="All">Tất cả nhà hàng</MenuItem>
                {restaurants.map((restaurant) => (
                  <MenuItem key={restaurant._id} value={restaurant._id}>
                    {restaurant.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Date Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Ngày"
              type="date"
              value={dateFilter}
              onChange={handleDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
            />
          </Grid>

          {/* Time Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Thời gian"
              type="time"
              value={timeFilter}
              onChange={handleTimeChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
            />
          </Grid>


        </Grid>
        {/* Search */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            label="Tìm kiếm"
            value={search}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
            sx={{ backgroundColor: '#fff', borderRadius: '4px' }}
          />
        </Grid>
      </Grid>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Ngày đặt bàn</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
                Thời gian đặt bàn
                <IconButton onClick={handleSort}>
                  {/* {order === 'bookingTime' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />} */}
                  {order === 'bookingTime' ? <ArrowUpwardIcon /> : order === 'NotBookingTime' ? <ArrowDownwardIcon /> : <SwapVertIcon />}
                </IconButton>
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Khách hàng</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Khách lạ</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Người lớn</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Trẻ em</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Bàn</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#3f51b5' }}>Công cụ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id}>
                <TableCell>{formatDate(booking?.bookingTime)}</TableCell>
                <TableCell>{formatTime(booking?.bookingTime)}</TableCell>
                <TableCell>
                  {booking?.customer ? <CustomerDialog customer={booking.customer} /> : 'N/A'}
                </TableCell>
                <TableCell>
                  {booking?.guest ? <GuestDialog guest={booking.guest} /> : 'N/A'}
                </TableCell>
                <TableCell>{booking.adultsCount}</TableCell>
                <TableCell>{booking.childrenCount}</TableCell>
                <TableCell>
                  <Typography sx={{ color: booking.status === 'TABLE_ASSIGNED' ? 'green' : 'red', fontWeight: 'bold' }}>
                    {getStatusInVietnamese(booking.status)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {booking?.reservation?.table.length > 0 ? <TableBookingDialog table={booking?.reservation?.table} /> : 'N/A'}
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Tooltip title="Assign Table">
                      <IconButton color="primary" onClick={() => handleAssignTable(booking._id)}>
                        {booking?.reservation?.table.length > 0 ? <CheckCircleIcon /> : <TableRestaurantIcon />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Booking">
                      <IconButton color="primary" onClick={() => handleEditBooking(booking._id)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {/* <Tooltip title="Delete Booking">
                        <IconButton
                          color="secondary"
                          onClick={() => handleDeleteBooking(booking._id)}
                          sx={{ marginLeft: '10px' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip> */}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
        />
      </Box>

      <AssignTableDialog
        open={openAssignTableDialog}
        onClose={handleCloseModal}
        bookingTime={selectedBooking?.bookingTime}
        restaurantId={selectedRestaurantId}
        bookingData={selectedBooking}
        fetchBookings={fetchBookings}
      />
      <EditBookingModal
        open={openEditBookingDialog}
        onClose={handleCloseModal}
        bookingData={selectedBooking}
        fetchBookings={fetchBookings}
      />
    </>
  );
};

export default BookingList;