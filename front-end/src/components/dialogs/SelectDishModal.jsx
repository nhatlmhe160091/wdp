import React, { useEffect, useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Checkbox, Grid, Card, CardContent, Typography, Avatar, CircularProgress, Box, TextField, CardMedia, InputAdornment
} from "@mui/material";
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import SearchIcon from '@mui/icons-material/Search';
import DishService from "../../services/dishService";
import ImageService from "../../services/imageService";

export default function SelectDishModal({ open, onClose, restaurantId, selectedDishes, setSelectedDishes }) {
    const [dishes, setDishes] = useState([]);
    const [dishImages, setDishImages] = useState({});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchDishesAndImages() {
            if (open && restaurantId) {
                setLoading(true);
                try {
                    const res = await DishService.getDishes({ restaurantId });
                    const dishList = res.data || [];
                    setDishes(dishList);

                    // Lấy ảnh cho từng dish
                    const imagesObj = {};
                    await Promise.all(
                        dishList.map(async (dish) => {
                            try {
                                // console.log("Fetching image for dish:", dish._id);
                                const imgRes = await ImageService.getImage(dish._id);
                                // console.log("Image response for dish:", dish._id, imgRes);
                                if (imgRes.data && imgRes.data.length > 0) {
                                    imagesObj[dish._id] = imgRes.data[0].url;
                                }
                                // console.log("Image URL for dish:", dish._id, imagesObj[dish._id]);
                            } catch (e) { /* Bỏ qua lỗi */ }
                        })
                    );
                    // console.log("Fetched dish images:", imagesObj);
                    setDishImages(imagesObj);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchDishesAndImages();
    }, [open, restaurantId]);

    const handleToggle = (dishId) => {
        setSelectedDishes(prev =>
            prev.includes(dishId)
                ? prev.filter(id => id !== dishId)
                : [...prev, dishId]
        );
    };

    // Lọc theo tên món ăn
    const filteredDishes = dishes.filter(dish =>
        dish.name.toLowerCase().includes(search.toLowerCase())
    );
// console.log("url images", dishImages);
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Chọn món ăn cho đặt bàn</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Tìm kiếm món ăn..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="action" />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={2}>
                        {filteredDishes.map(dish => (
                            <Grid item xs={12} sm={6} md={4} key={dish._id}>
                                <Card
                                    variant={selectedDishes.includes(dish._id) ? "outlined" : "elevation"}
                                    sx={{
                                        borderColor: selectedDishes.includes(dish._id) ? "#d02028" : "#e0e0e0",
                                        boxShadow: selectedDishes.includes(dish._id) ? 4 : 1,
                                        cursor: "pointer",
                                        transition: "0.2s",
                                        "&:hover": { boxShadow: 6, borderColor: "#d02028" }
                                    }}
                                    onClick={() => handleToggle(dish._id)}
                                >
                                    {dishImages[dish._id] ? (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={dishImages[dish._id]}
                                            alt={dish.name}
                                            sx={{ objectFit: "cover" }}
                                        />
                                    ) : (
                                        <Box sx={{ height: 140, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#f5f5f5" }}>
                                            <Avatar sx={{ bgcolor: "#d02028", width: 56, height: 56 }}>
                                                <RestaurantMenuIcon fontSize="large" />
                                            </Avatar>
                                        </Box>
                                    )}
                                    <CardContent sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                        <Checkbox
                                            checked={selectedDishes.includes(dish._id)}
                                            color="primary"
                                            sx={{ mr: 1, mt: 0.5 }}
                                            onClick={e => { e.stopPropagation(); handleToggle(dish._id); }}
                                        />
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">{dish.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {dish.price?.toLocaleString()} VNĐ
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                {dish.description}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                        {filteredDishes.length === 0 && (
                            <Grid item xs={12}>
                                <Typography align="center" color="text.secondary">Không tìm thấy món ăn phù hợp.</Typography>
                            </Grid>
                        )}
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained" color="primary">Xong</Button>
            </DialogActions>
        </Dialog>
    );
}