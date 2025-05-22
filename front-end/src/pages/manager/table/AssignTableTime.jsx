import React, { useState, useEffect } from "react";
import {
  Box, Card, CardContent, Typography, Grid, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import { styled } from "@mui/system";
import { FaUserFriends, FaLocationArrow } from "react-icons/fa";
import RestaurantService from "../../../services/restaurantService";
import BookingService from "../../../services/bookingService";
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import BookingDialog from '../../../components/dialogs/bookingDialog';

const StyledCard = styled(Card)(({ isBooked }) => ({
  minHeight: "200px",
  cursor: "pointer",
  transition: "transform 0.2s",
  backgroundColor: isBooked ? "#ffebee" : "#e8f5e9", 
  "&:hover": {
    transform: "scale(1.02)",
  },
}));
const locationMapping = {
  INDOOR: 'Trong nhà',
  OUTDOOR: 'Ngoài trời',
  BALCONY: 'Ban công',
  UPSTAIR: 'Trên tầng',
  OTHER: 'Khác'
};
const getLocationInVietnamese = (location) => {
  return locationMapping[location] || location;
};
const statusMapping = {
  AVAILABLE: 'Có sẵn',
  OCCUPIED: 'Đã chiếm',
  CLEANING: 'Đang dọn dẹp',
  CLOSED: 'Đã đóng',
  RESERVED: 'Đã đặt trước'
};
const getStatusInVietnamese = (status) => {
  return statusMapping[status] || status;
};

const AssignTableTime = () => {
  const [tables, setTables] = useState([]);
  const [selectedTabled, setSelectedTabled] = useState([]);
  const [combinedTables, setCombinedTables] = useState([]);
  const [bookingTime, setBookingTime] = useState(dayjs());
  const [timeRange, setTimeRange] = useState(parseInt(localStorage.getItem("timeRange")) || 60);
  const [restaurant, setRestaurant] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null); // Bàn được chọn

  const formattedBookingTime = `${bookingTime.format("YYYY-MM-DDTHH:mm:ss")}Z`;

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await RestaurantService.getAllRestaurants();
      setRestaurants(data);
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchReservationsAndTableAvailable = async () => {
      try {
        const data = await BookingService.getReservationsByBookingTimeForTable(
          formattedBookingTime,
          timeRange
        );

        const filteredTables = restaurant
          ? data.data.availableTables.filter((table) => table.restaurant === restaurant._id)
          : data.data.availableTables;

        const bookedTables = data.data.bookings
          .map((booking) => booking?.reservation?.table)
          .flat()
          .map((table) => ({ ...table }));

        setTables(filteredTables);
        setSelectedTabled(bookedTables);

        const combined = [
          ...filteredTables.map((table) => ({ ...table, isBooked: false })),
          ...bookedTables.map((table) => ({ ...table, isBooked: true }))
        ];

        setCombinedTables(combined);
      } catch (error) {
        console.error(error);
      }
    };

    fetchReservationsAndTableAvailable();
  }, [restaurant, bookingTime, timeRange]);

  const handleTableClick = (table) => {
    if (!table.isBooked) { 
      setSelectedTable(table);
      setOpenBookingDialog(true);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#1976d2', fontWeight: 'bold' }}>
        Đặt bàn & Tình trạng sẵn có
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#ffebee', border: '1px solid #ccc' }} />
          <Typography>Bàn đặt rồi</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 20, height: 20, backgroundColor: '#e8f5e9', border: '1px solid #ccc' }} />
          <Typography>Bàn chưa đặt</Typography>
        </Box>
      </Box>
      <Box sx={{ mb: 4, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
        <Grid container spacing={4} alignItems="center">
          {/* Restaurant Selection */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Nhà hàng</InputLabel>
              <Select
                value={restaurant?._id || ""}
                onChange={(e) => setRestaurant(restaurants.find(r => r._id === e.target.value))}
                label="Chọn nhà hàng"
                aria-label="Chọn nhà hàng"
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 }}
              >
                <MenuItem value="">Tất cả nhà hàng</MenuItem>
                {restaurants.map((rest) => (
                  <MenuItem key={rest._id} value={rest._id}>
                    {rest.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Date Picker */}
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Ngày đặt bàn"
                value={bookingTime}
                onChange={(newValue) => setBookingTime(newValue)}
                minDate={dayjs().startOf('month')}
                maxDate={dayjs().add(1, 'month').endOf('month')}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { backgroundColor: '#ffffff', borderRadius: 1 },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>

          {/* Time Picker */}
          <Grid item xs={12} md={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <TimePicker
                label="Giờ đặt bàn"
                value={bookingTime}
                onChange={(newValue) => setBookingTime(newValue)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { backgroundColor: '#ffffff', borderRadius: 1 },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {combinedTables.map((table) => (
          <Grid item xs={12} sm={6} md={4} key={table.id}>
            <StyledCard
              isBooked={table.isBooked}
              onClick={() => handleTableClick(table)} // Gọi hàm xử lý khi click
              aria-label={`Table ${table.number} - ${table.isBooked ? "Booked" : "Available"}`}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Bàn số {table.tableNumber}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FaUserFriends />
                    <Typography>Sức chứa: {table.capacity}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FaLocationArrow />
                    <Typography>Địa điểm: {getLocationInVietnamese(table.location)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography>Trạng thái: {table.isBooked ? "Đã Đặt" : "Sẵn sàng"}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* BookingDialog */}
      {selectedTable && (
        <BookingDialog
          open={openBookingDialog}
          setOpen={setOpenBookingDialog}
          adultsCount={0}
          setAdultsCount={() => {}} 
          childrenCount={0}
          setChildrenCount={() => {}}
          bookingTime={bookingTime}
          setBookingTime={setBookingTime}
          restaurant={restaurant}
          table={selectedTable} 
        />
      )}
    </Box>
  );
};

export default AssignTableTime;