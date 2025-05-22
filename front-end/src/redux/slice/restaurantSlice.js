import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  restaurant: [],
  pageNumber: 1
}

export const restaurantSlide = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    changePageNumber: (state, action) => {
      state.pageNumber = action.payload
    }
  }
})

export const { changePageNumber } = restaurantSlide.actions
export default restaurantSlide.reducer
