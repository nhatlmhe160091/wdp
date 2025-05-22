// src/redux/slice/filterSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categoryFilters: [],
  foodTagFilters: [],
  searchTerm: "",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setCategoryFilter: (state, action) => {
      const { name, checked } = action.payload;
      if (checked) {
        // Only add if not already in the array
        if (!state.categoryFilters.includes(name)) {
          state.categoryFilters.push(name);
        }
      } else {
        // Remove the category if unchecked
        state.categoryFilters = state.categoryFilters.filter(
          (cat) => cat !== name
        );
      }
    },
    setFoodTagFilter: (state, action) => {
      const { name, checked } = action.payload;
      if (checked) {
        // Only add if not already in the array
        if (!state.foodTagFilters.includes(name)) {
          state.foodTagFilters.push(name);
        }
      } else {
        // Remove the food tag if unchecked
        state.foodTagFilters = state.foodTagFilters.filter(
          (tag) => tag !== name
        );
      }
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});


export const { setCategoryFilter, setFoodTagFilter, setSearchTerm } = filterSlice.actions;
export default filterSlice.reducer;
