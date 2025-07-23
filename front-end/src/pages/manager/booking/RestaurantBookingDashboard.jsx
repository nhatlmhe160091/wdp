import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardContent, Typography, IconButton, ThemeProvider, createTheme, CssBaseline, CircularProgress, TextField } from "@mui/material";
import { styled } from "@mui/system";
import { FaUsers, FaUtensils, FaChair, FaBookmark } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import BookingService from '../../../services/bookingService';

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  transition: "transform 0.3s",
  "&:hover": {
    transform: "translateY(-5px)"
  }
}));
const statusMap = {
  TABLE_ASSIGNED: "Đã xếp bàn",
  CANCELLED: "Đã hủy",
  PENDING: "Đang chờ",
};

const getStatusInVietnamese = (status) => statusMap[status] || status;
const DashboardCard = ({ title, value, icon: Icon, color }) => (
  <StyledCard>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography variant="h6" color="textSecondary">{title}</Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box sx={{ color: color }}>
          <Icon size={32} />
        </Box>
      </Box>
    </CardContent>
  </StyledCard>
);

const RestaurantBookingDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState('');

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#1976d2"
      }
    }
  });

  const fetchDashboard = async (date) => {
    setLoading(true);
    const res = await BookingService.getDashboardStats(date);
    setDashboard(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard(dateFilter);
    // eslint-disable-next-line
  }, [dateFilter]);

  // Xử lý dữ liệu cho biểu đồ
  const bookingData = dashboard?.bookingsByMonth?.map(item => ({
    month: item._id,
    bookings: item.count
  })) || [];

  const statusData = dashboard?.bookingStatusStats?.map(item => {
    let color = "#1976d2";
    if (item._id === "TABLE_ASSIGNED") color = "#4CAF50";
    if (item._id === "CANCELLED") color = "#F44336";
    if (item._id === "PENDING") color = "#FFC107";
    return {
      name: getStatusInVietnamese(item._id),
      value: item.count,
      color,
      raw: item._id
    };
  }) || [];

  const topCustomers = dashboard?.topCustomers?.map(c => ({
    name: `${c.customer.fname} ${c.customer.lname}`,
    bookings: c.count
  })) || [];

  const topRestaurants = dashboard?.topRestaurants?.map(r => ({
    name: r.restaurant.name,
    location: r.restaurant.address,
    bookings: r.count,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
  })) || [];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" mb={4} alignItems="center">
          <Typography variant="h4" component="h1">Bảng điều khiển đặt bàn nhà hàng</Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <TextField
              label="Lọc theo ngày"
              type="date"
              size="small"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: "#fff", borderRadius: 1 }}
            />
            <IconButton onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? <MdLightMode /> : <MdDarkMode />}
            </IconButton>
          </Box>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Tổng lượt đặt bàn" value={dashboard?.totalBookings} icon={FaBookmark} color="#1976d2" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Tổng số nhà hàng" value={dashboard?.totalRestaurants} icon={FaUtensils} color="#4CAF50" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Tổng số khách hàng" value={dashboard?.totalCustomers} icon={FaUsers} color="#FFC107" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard title="Tổng số bàn" value={dashboard?.totalTables} icon={FaChair} color="#F44336" />
            </Grid>

            {/* Thống kê hôm nay */}
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="textSecondary">Số bàn được đặt hôm nay</Typography>
                  <Typography variant="h4">{dashboard?.todayBookedTables || 0}</Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="textSecondary">Bàn đặt nhiều nhất hôm nay</Typography>
                  {dashboard?.mostBookedTable?.table ? (
                    <>
                      <Typography variant="h5" fontWeight="bold">
                        Bàn số {dashboard.mostBookedTable.table.tableNumber}
                      </Typography>
                      <Typography>Số lượt đặt: {dashboard.mostBookedTable.count}</Typography>
                    </>
                  ) : (
                    <Typography>Không có dữ liệu</Typography>
                  )}
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" color="textSecondary">Bàn đặt ít nhất hôm nay</Typography>
                  {dashboard?.leastBookedTable?.table ? (
                    <>
                      <Typography variant="h5" fontWeight="bold">
                        Bàn số {dashboard.leastBookedTable.table.tableNumber}
                      </Typography>
                      <Typography>Số lượt đặt: {dashboard.leastBookedTable.count}</Typography>
                    </>
                  ) : (
                    <Typography>Không có dữ liệu</Typography>
                  )}
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={8}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" mb={2}>Xu hướng đặt bàn</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bookingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="bookings" stroke="#1976d2" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" mb={2}>Trạng thái đặt bàn</Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend dưới biểu đồ */}
                  <Box mt={2} display="flex" flexDirection="row" alignItems="center">
                    {statusData.map((entry, idx) => (
                      <Box key={idx} display="flex" alignItems="center" mr={3}>
                        <Box sx={{ width: 16, height: 16, bgcolor: entry.color, borderRadius: '50%', mr: 1 }} />
                        <Typography variant="body2">{entry.name}</Typography>
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" mb={2}>Khách hàng tiềm năng</Typography>
                  {topCustomers.map((customer, index) => (
                    <Box key={index} display="flex" justifyContent="space-between" mb={2}>
                      <Typography>{customer.name}</Typography>
                      <Typography color="primary">{customer.bookings} lượt đặt</Typography>
                    </Box>
                  ))}
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={6}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" mb={2}>Nhà hàng nổi bật</Typography>
                  {topRestaurants.map((restaurant, index) => (
                    <Box key={index} display="flex" alignItems="center" mb={2}>
                      <Box
                        component="img"
                        src={restaurant.image}
                        alt={restaurant.name}
                        sx={{ width: 50, height: 50, borderRadius: 1, mr: 2 }}
                      />
                      <Box flex={1}>
                        <Typography variant="subtitle1">{restaurant.name}</Typography>
                        <Typography variant="body2" color="textSecondary">{restaurant.location}</Typography>
                      </Box>
                      <Typography color="primary">{restaurant.bookings} lượt đặt</Typography>
                    </Box>
                  ))}
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default RestaurantBookingDashboard;