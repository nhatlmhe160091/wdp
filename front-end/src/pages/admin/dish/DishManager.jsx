import { useState } from "react";
import { Link } from "react-router-dom";
import PaginationDishBox from "../../../components/pagination/PaginationDishBox.jsx";
import {
  useFetchPaginateDishesQuery,
  useAddDishMutation,
  useUpdateDishMutation,
  useDeleteDishMutation,
  useGetAllDishesQuery,
} from "../../../redux/api/dishApi.js";
import DishItem from "./DishItem.jsx";
import { useSelector, useDispatch } from "react-redux";
import DishForm from "./DishForm.jsx";
import Modal from "react-modal";
import { useGetAllRestaurantsQuery } from "../../../redux/api/restaurantApi.js";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Paper,
  TableContainer,
  Box,
  Divider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  TextField,
} from "@mui/material";
import { useUploadImageMutation } from "../../../redux/api/imageApi.js";
import {
  setSearchTerm,
  setCategoryFilter,
  setFoodTagFilter,
} from "../../../redux/slice/filterSlice.js";
import { toast } from "react-toastify";

const categories = [
  "APPETIZER",
  "MAIN_COURSE",
  "DESSERT",
  "BEVERAGE",
  "SALAD",
  "SOUP",
];
const foodTags = ["HOT_SALE", "SEASONAL", "CHEF_SPECIAL"];

const categoryMap = {
  APPETIZER: "Khai Vị",
  MAIN_COURSE: "Món Chính",
  DESSERT: "Tráng Miệng",
  BEVERAGE: "Đồ Uống",
  SALAD: "Salad",
  SOUP: "Súp",
};

const foodTagMap = {
  HOT_SALE: "Bán Chạy",
  SEASONAL: "Theo Mùa",
  CHEF_SPECIAL: "Đặc Sản",
};

const DishManager = () => {
  const dispatch = useDispatch();
  const { pageNumber } = useSelector(
    (state) => state.dishes || { pageNumber: 1 }
  );
  const { data: allDishes } = useGetAllDishesQuery();

  const { data: restaurants } = useGetAllRestaurantsQuery();
  const {
    data: paginatedDishes,
    error,
    isLoading,
  } = useFetchPaginateDishesQuery(Number(pageNumber));

  const [addDish] = useAddDishMutation();
  const [updateDish] = useUpdateDishMutation();
  const [deleteDish] = useDeleteDishMutation();
  const [uploadImage] = useUploadImageMutation();

  const [showForm, setShowForm] = useState(false);
  const [selectedDish, setSelectedDish] = useState(null);

  const handleEdit = (dish) => {
    setSelectedDish(dish);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedDish(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedDish) {
        await updateDish({
          id: selectedDish._id,
          updatedDish: formData,
        }).unwrap();
        toast.success("Chỉnh sửa món ăn thành công!");
      } else {
        await addDish(formData).unwrap();
        toast.success("Thêm món ăn mới thành công!");
      }

      if (formData.image) {
        await uploadImage(formData.image).unwrap();
        toast.success("Hình ảnh đã được tải lên thành công!");
      }

      setShowForm(false);
    } catch (error) {
      toast.error(
        error?.data?.message || "Lỗi khi lưu món ăn. Vui lòng thử lại."
      );
      console.error("Error saving dish:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa món ăn này?")) {
      try {
        await deleteDish(id).unwrap();
        toast.success("Món ăn đã được xóa thành công!");
      } catch (error) {
        toast.error("Lỗi khi xóa món ăn. Vui lòng thử lại.");
      }
    }
  };

  // Lấy các bộ lọc từ Redux state
  const searchTerm = useSelector((state) => state.filters.searchTerm);
  const categoryFilters = useSelector((state) => state.filters.categoryFilters);
  const foodTagFilters = useSelector((state) => state.filters.foodTagFilters);

  const pageSize = 5; // Number of items per page

  // Lọc dữ liệu
  const filteredDishes = paginatedDishes?.data?.filter((dish) => {
    const matchesSearchTerm = dish.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilters.length === 0 || categoryFilters.includes(dish.category);
    const matchesFoodTag =
      foodTagFilters.length === 0 || foodTagFilters.includes(dish.foodTag);

    return matchesSearchTerm && matchesCategory && matchesFoodTag;
  });
  // Paginate the filtered dishes
  const paginatedFilteredDishes = filteredDishes?.slice(
    (pageNumber - 1) * pageSize,
    pageNumber * pageSize
  );
  // Xử lý sự kiện thay đổi bộ lọc
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleCategoryFilterChange = (e) => {
    const { checked, name } = e.target;
    dispatch(setCategoryFilter({ name, checked }));
  };

  const handleFoodTagFilterChange = (e) => {
    const { checked, name } = e.target;
    dispatch(setFoodTagFilter({ name, checked }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading dishes</div>;

  return (
    <Box display="flex">
      {/* Main Content */}
      <Box sx={{ flex: 1, p: 2 }}>
        {/* Breadcrumbs and Search Bar */}
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text.primary">Quản lý Món ăn</Typography>
        </Breadcrumbs>
        <Button variant="contained" onClick={handleAddNew}>
          Thêm món ăn mới
        </Button>
        
        <Box display="flex" alignItems="center" gap={2} mt={2} mb={2}>
          <TextField
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Box>

        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Tên Món Ăn</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Phân Loại Món Ăn</TableCell>
                <TableCell>Nhãn Món Ăn</TableCell>
                <TableCell>Mô Tả Chi Tiết</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedFilteredDishes?.map((item) => (
                <TableRow key={item._id}>
                  <DishItem
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

         <PaginationDishBox numberOfPage={Math.ceil(filteredDishes.length / pageSize)} />
      </Box>

      {/* Filter Sidebar */}
      <Box sx={{ width: 200, p: 2, borderRight: 1, borderColor: "divider" }}>
        <Typography variant="h6">Lọc theo Phân Loại Món Ăn</Typography>
        <Divider sx={{ my: 1 }} />
        <FormGroup>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox
                  name={category}
                  onChange={handleCategoryFilterChange}
                />
              }
              label={categoryMap[category] || category}
            />
          ))}
        </FormGroup>

        <Typography variant="h6" sx={{ mt: 2 }}>
          Lọc theo Nhãn Món Ăn
        </Typography>
        <Divider sx={{ my: 1 }} />
        <FormGroup>
          {foodTags.map((tag) => (
            <FormControlLabel
              key={tag}
              control={
                <Checkbox name={tag} onChange={handleFoodTagFilterChange} />
              }
              label={foodTagMap[tag] || tag}
            />
          ))}
        </FormGroup>
      </Box>
      {/* Dish Form Modal */}
      <Modal
        ariaHideApp={false}
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
        contentLabel="Restaurant Form"
      >
        <DishForm
          dish={selectedDish}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
          restaurants={restaurants}
        />
      </Modal>
    </Box>
  );
};

export default DishManager;
