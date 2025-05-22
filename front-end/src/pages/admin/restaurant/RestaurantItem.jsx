import { useState } from "react";
import Modal from "react-modal";
import { useGetImagesByEntityIdQuery } from "../../../redux/api/imageApi";
import {
  Button,
  IconButton,
  Typography,
  Box,
  Grid,
  Paper,
  TableCell,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Visibility,
  Edit,
  Delete,
} from "@mui/icons-material";

/* eslint-disable react/prop-types */
const RestaurantItem = ({ item, onEdit, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const handleDelete = async () => {
    await onDelete(item._id);
  };

  const truncateDescription = (description, length = 30) => {
    return description.length > length
      ? `${description.substring(0, length)}...`
      : description;
  };

  const { data: images } = useGetImagesByEntityIdQuery(item._id);

  return (
    <>
      <TableCell>{item.name}</TableCell>

      {/* Phone Number Column */}
      <TableCell>{item.phoneNumber}</TableCell>

      {/* Description Column */}
      <TableCell>
        {item.description.length > 30
          ? `${item.description.slice(0, 30)}...`
          : item.description}
      </TableCell>

      {/* Actions Column */}
      <TableCell>
        {/* View Button */}
        <Tooltip title="View">
          <IconButton onClick={() => setShowModal(true)} color="primary">
            <Visibility />
          </IconButton>
        </Tooltip>

        {/* Edit Button */}
        <Tooltip title="Edit">
          <IconButton onClick={() => onEdit(item)} color="secondary">
            <Edit />
          </IconButton>
        </Tooltip>

        {/* Delete Button */}
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDelete(item._id)} color="error">
            <Delete />
          </IconButton>
        </Tooltip>
      </TableCell>

      {/* Modal for viewing restaurant details */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        contentLabel="Restaurant Details"
        style={{
          content: {
            width: "800px",
            maxWidth: "90%",
            margin: "auto",
            marginTop: "50px",
            padding: "20px",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          },
        }}
      >
        <div className="flex flex-col">
          <Typography variant="Name" >
            <strong>Tên cửa hàng:</strong> {item.name}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <strong>Hình ảnh:</strong>
          </Typography>
          <Box sx={{ display: "flex", overflowX: "auto", marginTop: 1 }}>
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
          </Box>
          <Typography variant="body1" sx={{ marginTop: 2 }}>
            <strong>Vị trí:</strong> {item.address}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            <strong>Số điện thoại:</strong> {item.phoneNumber}
          </Typography>
          <Typography variant="body1" sx={{ marginTop: 1 }}>
            <strong>Thông tin chi tiết:</strong> {item.description}
          </Typography>
          <Button
            onClick={() => setShowModal(false)}
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Đóng
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default RestaurantItem;
