import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  dish: [],
  pageNumber: 1
}

export const dishSlide = createSlice({
  name: "dish",
  initialState,
  reducers: {
    changePageNumber: (state, action) => {
      state.pageNumber = action.payload
    }
  }
})

export const { changePageNumber } = dishSlide.actions
export default dishSlide.reducer
