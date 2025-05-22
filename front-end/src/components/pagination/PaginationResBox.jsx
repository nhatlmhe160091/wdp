import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { changePageNumber } from "../../redux/slice/restaurantSlice";

const PaginationResBox = ({ numberOfPage }) => {
  const dispatch = useDispatch();
  const currentPage = useSelector((state) => state.restaurants.pageNumber); // Lấy trang hiện tại từ Redux store

  const handlePageChange = (event, value) => {
    dispatch(changePageNumber(value));
  };

  return (
    <Stack spacing={2} direction="row" justifyContent="center" alignItems="center">
      <Pagination
        count={numberOfPage}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined"
        color="primary"
        shape="rounded"
      />
    </Stack>
  );
};

export default PaginationResBox;
