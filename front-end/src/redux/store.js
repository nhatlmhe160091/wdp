import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { dishApi } from './api/dishApi';
import dishSlice from './slice/dishSlice';
import { restaurantApi } from './api/restaurantApi';
import restaurantSlice from './slice/restaurantSlice';
import { voucherApi } from './api/voucherApi';
import voucherSlice from './slice/voucherSlice';
import { imageApi } from './api/imageApi';
import imageSlice from './slice/imageSlice';
import filterSlice from './slice/filterSlice';

export const store = configureStore({
  reducer: {
    [dishApi.reducerPath]: dishApi.reducer,
    [restaurantApi.reducerPath]: restaurantApi.reducer,
    [voucherApi.reducerPath]: voucherApi.reducer,
    [imageApi.reducerPath]: imageApi.reducer,
    dishes: dishSlice,
    restaurants: restaurantSlice,
    voucher: voucherSlice,
    images: imageSlice,
    filters: filterSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dishApi.middleware)
      .concat(restaurantApi.middleware)
      .concat(voucherApi.middleware)
      .concat(imageApi.middleware),
});

setupListeners(store.dispatch);