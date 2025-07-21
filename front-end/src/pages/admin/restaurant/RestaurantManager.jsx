import {
  useFetchPaginateRestaurantsQuery,
  useAddRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
} from "../../../redux/api/restaurantApi.js";
import RestaurantItem from "./RestaurantItem.jsx";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import RestaurantForm from "./RestaurantForm.jsx";
import Modal from "react-modal";
import PaginationResBox from "../../../components/pagination/PaginationResBox.jsx";
import { Link } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { setSearchTerm } from "../../../redux/slice/filterSlice.js";
import { toast } from "react-toastify";

const RestaurantManager = () => {
  const dispatch = useDispatch();
  const { pageNumber } = useSelector((state) => state.restaurants || 1);
  const {
    data: paginatedRestaurants,
    error,
    isLoading,
  } = useFetchPaginateRestaurantsQuery(Number(pageNumber));

  const [addRestaurant] = useAddRestaurantMutation();
  const [updateRestaurant] = useUpdateRestaurantMutation();
  const [deleteRestaurant] = useDeleteRestaurantMutation();

  const [showForm, setShowForm] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const handleEdit = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setSelectedRestaurant(null);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (selectedRestaurant) {
        await updateRestaurant({
          id: selectedRestaurant._id,
          updatedRestaurant: formData,
        }).unwrap();
        toast.success("Cập nhật nhà hàng thành công!");
      } else {
        await addRestaurant(formData).unwrap();
        toast.success("Nhà hàng mới đã được thêm thành công!");
      }
      setShowForm(false);
    } catch (error) {
      toast.error(
        error?.data?.message || "Lỗi khi lưu nhà hàng. Vui lòng thử lại."
      );
      console.error("Error saving restaurant:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhà hàng này?")) {
      try {
        await deleteRestaurant(id).unwrap();
        toast.success("Nhà hàng đã được xóa thành công!");
      } catch (error) {
        toast.error(
          error?.data?.message || "Lỗi khi xóa nhà hàng. Vui lòng thử lại."
        );
        console.error("Error deleting restaurant:", error);
      }
    }
  };

  const searchTerm = useSelector((state) => state.filters.searchTerm);

  // Filter restaurants based on the search term
  const filteredRestaurants = paginatedRestaurants?.data?.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  if (isLoading) return <div>Đang tải nhà hàng...</div>;
  if (error) return <div>Lỗi khi tải nhà hàng: {error.message}</div>;

  return (
    <>
      <Container maxWidth="lg">
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
          <Typography sx={{ color: "text.primary" }}>
            Quản lý Nhà hàng
          </Typography>
        </Breadcrumbs>
  <Box sx={{ display: "flex", gap: 2, alignItems: "center", marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddNew}
        >
          Thêm nhà hàng mới
        </Button>
        <TextField
          variant="outlined"
          label="Tìm kiếm"
          placeholder="Nhập tên nhà hàng..."
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
      </Box>
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên Nhà Hàng</TableCell>
                <TableCell>Số Điện Thoại</TableCell>
                <TableCell>Mô Tả Chi Tiết</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRestaurants?.map((item) => (
                <TableRow key={item._id}>
                  <RestaurantItem
                    key={item._id}
                    item={item}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <PaginationResBox numberOfPage={paginatedRestaurants?.numberOfPage} />
      </Container>

      <Modal
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
        contentLabel="Restaurant Form"
      >
        <RestaurantForm
          restaurant={selectedRestaurant}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      </Modal>
    </>
  );
};

export default RestaurantManager;
