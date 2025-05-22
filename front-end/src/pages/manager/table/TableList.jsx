import { useEffect, useState } from 'react';
import {
    Table as MuiTable, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Typography, IconButton, Button, Dialog,
    DialogActions, DialogContent, DialogTitle, TextField, FormControl,
    InputLabel, Select, MenuItem, Pagination, Grid, Box
} from '@mui/material';
import TableService from '../../../services/tableService';
import RestaurantService from '../../../services/restaurantService';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

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

const TableList = () => {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [tableToDelete, setTableToDelete] = useState(null);

    const [tableNumber, setTableNumber] = useState('');
    const [capacity, setCapacity] = useState('');
    const [restaurant, setRestaurant] = useState('');
    const [location, setLocation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [restaurants, setRestaurants] = useState([]);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState('');
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchTables();
        fetchRestaurants();
    }, [page, limit, search, restaurant]);

    const fetchTables = async () => {
        const data = await TableService.getPaginatedTables(page, limit, search, restaurant);
        setTables(data.data);
        setTotalPages(data.totalPages);
    };

    const fetchRestaurants = async () => {
        const data = await RestaurantService.getAllRestaurants();
        setRestaurants(data);
    };

    const handleOpenDialog = (table = null) => {
        setSelectedTable(table);
        setIsEditing(!!table);
        if (table) {
            setTableNumber(table.tableNumber);
            setCapacity(table.capacity);
            setRestaurant(table.restaurant._id); // Use restaurant ID
            setLocation(table.location);
        } else {
            setTableNumber('');
            setCapacity('');
            setRestaurant('');
            setLocation('');
        }
        setOpenDialog(true);
        setErrorMessage('');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedTable(null);
        setErrorMessage('');
    };

    const handleSubmit = async () => {
        const formData = { tableNumber, capacity, restaurant, location };
        try {
            if (isEditing && selectedTable) {
                await TableService.updateTable({ ...formData, _id: selectedTable._id });
            } else {
                await TableService.createTable(formData);
            }
            fetchTables();
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to submit form:', error);
            setErrorMessage(error.message || 'An unexpected error occurred');
        }
    };

    const handleOpenConfirmDialog = (tableId) => {
        setTableToDelete(tableId);
        setOpenConfirmDialog(true);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setTableToDelete(null);
    };

    const handleDelete = async () => {
        await TableService.deleteTable(tableToDelete);
        fetchTables();
        handleCloseConfirmDialog();
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleRestaurantChange = (event) => {
        setRestaurant(event.target.value);
    };

    return (
        <div>
            <Typography
                variant="h4"
                sx={{ textAlign: 'center', fontWeight: 'bold', color: '#3f51b5' }}
                gutterBottom
            >
                Quản lí Bàn ăn
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={10}>
                    <TextField
                        label="Tìm kiếm"
                        placeholder="Nhập số bàn tìm kiếm..."
                        value={search}
                        onChange={handleSearchChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Nhà Hàng</InputLabel>
                        <Select
                            value={restaurant}
                            onChange={handleRestaurantChange}
                        >
                            <MenuItem value="">
                                <em>Tất cả</em>
                            </MenuItem>
                            {restaurants.map((rest) => (
                                <MenuItem key={rest._id} value={rest._id}>
                                    {rest.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Thêm bàn
                </Button>
            </Box>
            <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                <MuiTable>
                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell>Số bàn</TableCell>
                            <TableCell>Sức chứa</TableCell>
                            <TableCell>Nhà hàng</TableCell>
                            <TableCell>Vị trí</TableCell>
                            <TableCell>Công cụ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tables.map((table) => (
                            <TableRow key={table._id}>
                                <TableCell>{table.tableNumber}</TableCell>
                                <TableCell>{table.capacity}</TableCell>
                                <TableCell>{table.restaurant?.name}</TableCell>
                                <TableCell>{getLocationInVietnamese(table.location)}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleOpenDialog(table)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleOpenConfirmDialog(table._id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </MuiTable>
            </TableContainer>
            <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}
            />

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{isEditing ? 'Chỉnh sửa bàn' : 'Thêm bàn mới'}</DialogTitle>
                <DialogContent>
                    <FormControl margin="dense" fullWidth>
                        <InputLabel>Nhà hàng</InputLabel>
                        <Select
                            value={restaurant}
                            onChange={(e) => setRestaurant(e.target.value)}
                        >
                            {restaurants.map((rest) => (
                                <MenuItem key={rest._id} value={rest._id}>
                                    {rest.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Số bàn"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        fullWidth
                        error={!!errorMessage}
                        helperText={errorMessage}
                    />
                    <TextField
                        margin="dense"
                        label="Sức chứa"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        fullWidth
                    />
                    <FormControl margin="dense" fullWidth>
                        <InputLabel id="location-label">Vị trí</InputLabel>
                        <Select
                            labelId="location-label"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            label="Location"
                        >
                            <MenuItem value="INDOOR">Trong nhà</MenuItem>
                            <MenuItem value="OUTDOOR">Ngoài trời</MenuItem>
                            <MenuItem value="BALCONY">Ban công</MenuItem>
                            <MenuItem value="UPSTAIR">Trên tầng</MenuItem>
                            <MenuItem value="OTHER">Khác</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <Typography>Bạn có chắc chắn muốn xóa bàn này không?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDialog} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TableList;