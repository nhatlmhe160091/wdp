import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  images: [],
  entityId: null,
  pageNumber: 1,
};

export const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImages: (state, action) => {
      state.images = action.payload;
    },
    changePageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setEntityId: (state, action) => {
      state.entityId = action.payload;
    },
  },
});

export const { setImages, changePageNumber, setEntityId } = imageSlice.actions;
export default imageSlice.reducer;
