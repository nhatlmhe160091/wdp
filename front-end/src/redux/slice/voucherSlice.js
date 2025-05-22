import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  voucher: [],
  pageNumber: 1
}

export const voucherSlide = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    changePageNumber: (state, action) => {
      state.pageNumber = action.payload
    }
  }
})

export const { changePageNumber } = voucherSlide.actions
export default voucherSlide.reducer
