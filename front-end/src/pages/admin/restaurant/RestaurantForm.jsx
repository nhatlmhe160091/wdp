import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { app } from "../../../firebase/firebase";
import {
  useDeleteImageMutation,
  useGetImagesByEntityIdQuery,
  useUploadImageMutation,
} from "../../../redux/api/imageApi";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const RestaurantForm = ({ restaurant, onSubmit, onClose }) => {
  const [formData, setFormData] = useState(
    restaurant || { name: "", address: "", phoneNumber: "", description: "" }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Gọi callback onSubmit khi submit form
    onClose(); // Đóng modal sau khi submit
  };

  const [deleteImage] = useDeleteImageMutation();
  const [uploadImage] = useUploadImageMutation();

  const handleImageChange = async (e) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      try {
        const storage = getStorage(app);
        const storageRef = ref(storage, "images/" + file.name);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);

        // Upload new image data to backend
        await uploadImage({
          url: downloadURL,
          altText: formData.name,
          entityId: restaurant ? restaurant._id : null,
          entityType: "RESTAURANT",
        });
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }
  };

  const handleDeleteImage = async (imageId, imageText) => {
    try {
      window.confirm(`Are you sure to delete image "${imageText}"?`);
      await deleteImage(imageId).unwrap();
    } catch (error) {
      console.error("Failed to delete image", error);
    }
  };

  const { data: images } = useGetImagesByEntityIdQuery(restaurant?._id, {
    skip: !restaurant, // Bỏ qua gọi API nếu restaurant là null
  });

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {restaurant ? "Cập nhật thông tin nhà hàng" : "Thêm nhà hàng mới"}
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            {/* Tên nhà hàng */}
            <Grid item xs={12}>
              <TextField
                label="Tên nhà hàng"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>

            {/* Hình ảnh nhà hàng */}
            {restaurant && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Hình ảnh:</Typography>
                  <Grid container spacing={1}>
                    {images?.data?.map((image) => (
                      <Grid item key={image._id}>
                        <img
                          src={image.url}
                          alt={image.altText}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            marginBottom: "8px",
                          }}
                        />
                        <IconButton
                          onClick={() => handleDeleteImage(image._id, image.altText)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    ))}
                  </Grid>
                  <TextField
                    type="file"
                    fullWidth
                    onChange={handleImageChange}
                    variant="outlined"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
              </>
            )}

            {/* Địa chỉ */}
            <Grid item xs={12}>
              <TextField
                label="Địa chỉ"
                fullWidth
                variant="outlined"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </Grid>

            {/* Số điện thoại */}
            <Grid item xs={12}>
              <TextField
                label="Số điện thoại"
                fullWidth
                variant="outlined"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
              />
            </Grid>

            {/* Mô tả */}
            <Grid item xs={12}>
              <TextField
                label="Mô tả"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button type="submit" color="primary" variant="contained">
            {restaurant ? "Cập nhật nhà hàng" : "Thêm nhà hàng"}
          </Button>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Hủy
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RestaurantForm;
