import { useState } from "react";
import {
  IconButton,
  TableCell,
  Tooltip,
  Modal,
  Box,
  Button,
} from "@mui/material";
import { Visibility, Edit, Delete } from "@mui/icons-material";
import { useGetImagesByEntityIdQuery } from "../../../redux/api/imageApi";
/* eslint-disable react/prop-types */

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

const DishItem = ({ item, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const { data: images } = useGetImagesByEntityIdQuery(item._id);

  const handleDelete = async () => {
    await onDelete(item._id);
  };

  return (
    <>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.price}</TableCell>
      <TableCell>{categoryMap[item.category]}</TableCell>
      <TableCell>{foodTagMap[item.foodTag]}</TableCell>
      <TableCell>
        {item.description.length > 30
          ? `${item.description.slice(0, 30)}...`
          : item.description}
      </TableCell>
      <TableCell>
        {/* View Button */}
        <Tooltip title="View">
          <IconButton onClick={() => setShowModal(true)} color="primary">
            <Visibility fontSize={"small"} />
          </IconButton>
        </Tooltip>

        {/* Edit Button */}
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit(item)} color="secondary">
            <Edit fontSize={"small"} />
          </IconButton>
        </Tooltip>

        {/* Delete Button */}
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete} color="error">
            <Delete fontSize={"small"} />
          </IconButton>
        </Tooltip>
      </TableCell>

      {/* Modal for viewing dish details */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="dish-details-modal"
        aria-describedby="modal-to-view-dish-details"
      >
        <Box
          sx={{
            width: "80%",
            maxWidth: "800px",
            margin: "auto",
            marginTop: "50px",
            padding: "20px",
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: 24,
          }}
        >
          <h2 id="dish-details-modal">Chi Tiết Món Ăn</h2>
          <p>
            <strong>Tên Món Ăn:</strong> {item.name}
          </p>

          <div>
            <strong>Hình Ảnh:</strong>
            <div
              style={{ display: "flex", flexWrap: "nowrap", overflowX: "auto" }}
            >
              {images?.data?.map((image) => (
                <img
                  key={image._id}
                  src={image.url}
                  alt={image.altText}
                  style={{
                    width: "200px",
                    height: "200px",
                    margin: "5px",
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
          </div>

          <p>
            <strong>Giá:</strong> {item.price}
          </p>
          <p>
            <strong>Phân Loại:</strong>{" "}
            {categoryMap[item.category] || item.category}
          </p>
          <p>
            <strong>Nhãn:</strong> {foodTagMap[item.foodTag] || item.foodTag}
          </p>
          <p>
            <strong>Thông Tin Chi Tiết:</strong> {item.description}
          </p>

          {/* Section for restaurants offering the dish */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Có sẵn tại các cửa hàng:</h3>
            <ul>
              {item.restaurants?.map((restaurant) => (
                <li key={restaurant._id}>{restaurant.name}</li>
              ))}
            </ul>
          </div>

          {/* Close Button */}
          <Button
            onClick={() => setShowModal(false)}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Đóng
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default DishItem;
