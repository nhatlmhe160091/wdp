import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Modal,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Pagination
} from "@mui/material";
import { styled } from "@mui/system";
import { FaChair, FaUserFriends, FaLocationArrow, FaClock } from "react-icons/fa";
import { BsCircleFill } from "react-icons/bs";
import BookingService from "../../../services/bookingService";
import ShowBookingTableModal from "../../../components/modals/ShowBookingTableModal";
import RestaurantService from "../../../services/restaurantService";

const StyledCard = styled(Card)(({ theme, status }) => ({
  minHeight: "200px",
  cursor: "pointer",
  transition: "transform 0.2s",
  backgroundColor: status === "Có sẵn" ? "#e8f5e9" :
    status === "Đã chiếm" ? "#ffebee" :
    status === "Đang dọn dẹp" ? "#fff3e0" :
    status === "Đã đặt trước" ? "#e3f2fd" :
    "#f5f5f5",
  "&:hover": {
    transform: "scale(1.02)"
  }
}));

const Legend = styled(Box)({
  display: "flex",
  gap: "16px",
  padding: "16px",
  justifyContent: "center",
  flexWrap: "wrap"
});
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
const DiningTableStatus = () => {
  const [tables, setTables] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("number");
  const [selectedTable, setSelectedTable] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [restaurant, setRestaurant] = useState('');
  const [restaurants, setRestaurants] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tablesPerPage = 9;

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await RestaurantService.getAllRestaurants();
      setRestaurants(data);
    };
    fetchRestaurants();
  }, []);

  useEffect(() => {
    fetchTables();
  }, [restaurant]);

  useEffect(() => {
    setCurrentPage(1); // Reset page when filter changes
  }, [statusFilter, locationFilter, sortBy, restaurant]);

  const fetchTables = async () => {
    const data = await BookingService.getBookedTables();
    const filteredTables = restaurant
      ? data.data.filter(table => table.table.restaurant === restaurant)
      : data.data;
    setTables(filteredTables);
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    if (!bookingId) {
      console.error('No bookingId provided');
      return;
    }
    try {
      await BookingService.updateReservationStatus(bookingId, newStatus);
      setTables(tables.map(table =>
        table.bookingId === bookingId ? { ...table, status: newStatus } : table
      ));
      alert('Câp nhật trạng thái thành công!');
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredAndSortedTables = tables
    .filter(table => statusFilter === "ALL" || table.status === statusFilter)
    .filter(table => locationFilter === "ALL" || table.table.location === locationFilter)
    .sort((a, b) => {
      if (sortBy === "number") return a.table.tableNumber - b.table.tableNumber;
      if (sortBy === "capacity") return a.table.capacity - b.table.capacity;
      return 0;
    });

  const pageCount = Math.ceil(filteredAndSortedTables.length / tablesPerPage);
  const paginatedTables = filteredAndSortedTables.slice(
    (currentPage - 1) * tablesPerPage,
    currentPage * tablesPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Có sẵn": return "#4caf50";
      case "Đã chiếm": return "#f44336";
      case "Đang dọn dẹp": return "#ff9800";
      case "Đã đặt trước": return "#2196f3";
      default: return "#9e9e9e";
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
            variant="h4"
            sx={{ textAlign: 'center', fontWeight: 'bold', color: '#3f51b5' }}
            gutterBottom
          >
        Tình trạng bàn hiện tại
      </Typography>

      <Legend>
        {["Có sẵn", "Đã chiếm", "Đang dọn dẹp", "Đã đóng","Đã đặt trước"].map((status) => (
          <Chip
            key={status}
            icon={<BsCircleFill color={getStatusColor(status)} />}
            label={status}
            variant="outlined"
          />
        ))}
      </Legend>

      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Nhà Hàng</InputLabel>
          <Select
            value={restaurant}
            onChange={(e) => setRestaurant(e.target.value)}
          >
            <MenuItem value="">Tất cả nhà hàng</MenuItem>
            {restaurants.map((rest) => (
              <MenuItem key={rest._id} value={rest._id}>
                {rest.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            <MenuItem value="AVAILABLE">Có sẵn</MenuItem>
            <MenuItem value="RESERVED">Đã đặt trước</MenuItem>
            <MenuItem value="OCCUPIED">Chiếm lĩnh</MenuItem>
            <MenuItem value="CLEANING">Đang dọn dẹp</MenuItem>
            <MenuItem value="CLOSED">Đã đóng</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Địa điểm</InputLabel>
          <Select
            value={locationFilter}
            label="Địa điểm"
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <MenuItem value="ALL">Tất cả</MenuItem>
            <MenuItem value="INDOOR">Trong nhà</MenuItem>
            <MenuItem value="OUTDOOR">Ngoài trời</MenuItem>
            <MenuItem value="BALCONY">Ban công</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Sắp xếp theo</InputLabel>
          <Select
            value={sortBy}
            label="Sắp xếp theo"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="number">Số bàn</MenuItem>
            <MenuItem value="capacity">Sức chứa</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {paginatedTables.map((table) => (
          <Grid item xs={12} sm={6} md={4} key={table.table._id}>
            <StyledCard
              status={table.status}
              onClick={() => {
                setSelectedTable(table);
                setModalOpen(true);
                setShowBookings(false);
              }}
              aria-label={`Table ${table.table.tableNumber} - ${table.status}`}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Bàn số {table.table.tableNumber}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FaUserFriends />
                    <Typography>Sức chứa: {table.table.capacity}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FaLocationArrow />
                    <Typography>Vị trí: {getLocationInVietnamese(table.table.location)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BsCircleFill color={getStatusColor(getStatusInVietnamese(table.status))} />
                    <Typography>Trạng thái: {getStatusInVietnamese(table.status)}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FaClock />
                    <Typography>Thời gian đặt bàn hiện tại: {new Date(table.bookingTime).toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FaLocationArrow />
                    <Typography>Nhà hàng: {restaurants.find(rest => rest._id === table.table.restaurant)?.name}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={currentPage}
            onChange={(_, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="table-status-modal"
      >
        <Box sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2
        }}>
          {selectedTable && (
            <>
              <Typography variant="h6" gutterBottom>
                Thông tin bàn số {selectedTable.table.tableNumber}
              </Typography>
              
              {!showBookings ? (
                <>
                  <Typography variant="subtitle1" gutterBottom>
                    Cập nhật trạng thái
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
                    {["AVAILABLE", "OCCUPIED", "CLEANING", "CLOSED","RESERVED"].map((status) => (
                      <Button
                        key={status}
                        variant={selectedTable?.status === status ? "contained" : "outlined"}
                        onClick={() => handleStatusChange(selectedTable?.bookingId, status)}
                      >
                        {getStatusInVietnamese(status)}
                      </Button>
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setBookingModalOpen(true)}
                  >
                    Xem đặt bàn
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outlined" onClick={() => setShowBookings(false)}>
                    Quay lại    
                  </Button>
                  <List>
                    {selectedTable.bookings.map((booking, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={`Booking Time: ${new Date(booking.bookingTime).toLocaleString()}`}
                            secondary={`Status: ${booking.status}`}
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    ))}
                  </List>
                </>
              )}
            </>
          )}
        </Box>
      </Modal>

      <ShowBookingTableModal
        tableId={selectedTable ? selectedTable.table._id : null}
        tableNumber={selectedTable ? selectedTable.table.tableNumber : null}
        open={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
      />
    </Box>
  );
};

export default DiningTableStatus;