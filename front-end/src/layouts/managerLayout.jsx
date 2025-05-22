import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import {
  Box, Container, CssBaseline, Toolbar, Drawer, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import { TableChart, Book, List as ListIcon, People, RestaurantMenu,TableRestaurant } from '@mui/icons-material';
import ManagerHeader from '../components/headers/ManagerHeader';

const drawerWidth = 240;

const ManagerLayout = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />

      <ManagerHeader></ManagerHeader>

      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List> 
          <ListItem disablePadding>
              <ListItemButton component={Link} to="manager/booking-table">
                <ListItemIcon><RestaurantMenu /></ListItemIcon>
                <ListItemText primary="Đặt bàn ăn" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="manager/table-status">
                <ListItemIcon><TableChart /></ListItemIcon>
                <ListItemText primary="Bàn ăn hiện thời" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="manager/booking-list">
                <ListItemIcon><Book /></ListItemIcon>
                <ListItemText primary="Quản lí Đặt bàn" />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton component={Link} to="manager/table-list">
                <ListItemIcon><TableRestaurant /></ListItemIcon>
                <ListItemText primary="Quản lí Bàn ăn" />
              </ListItemButton>
            </ListItem>
            {/* <ListItem disablePadding>
              <ListItemButton component={Link} to="manager/user-list">
                <ListItemIcon><People /></ListItemIcon>
                <ListItemText primary="Quản lí Tài Khoản" />
              </ListItemButton>
            </ListItem> */}
          </List>
          <Divider />
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container>
          <Outlet />
        </Container>
      </Box>

    </Box>
  );
};

export default ManagerLayout;
