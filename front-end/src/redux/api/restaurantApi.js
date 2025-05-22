import { rootApi } from './rootApi';

export const restaurantApi = rootApi.injectEndpoints({
  reducerPath: 'restaurantApi',
  tagTypes: ['Restaurants'],
  endpoints: (builder) => ({
    searchRestaurants: builder.query({
      query: (name) => `/restaurants/search?name=${encodeURIComponent(name)}`,
      providesTags: ['Restaurants'],
    }),

    // Lấy tất cả nhà hàng
    getAllRestaurants: builder.query({
      query: () => '/restaurant',
      providesTags: ['Restaurants'],
    }),

    // Lấy nhà hàng theo trang
    fetchPaginateRestaurants: builder.query({
      query: (pageNumber) => `/restaurant/paginatedRestaurants?page=${pageNumber}`,
      providesTags: ['Restaurants'],
    }),

    // Thêm một nhà hàng
    addRestaurant: builder.mutation({
      query: (newRestaurant) => ({
        url: '/restaurant',
        method: 'POST',
        body: newRestaurant,
      }),
      invalidatesTags: ['Restaurants'],
    }),

    // Cập nhật nhà hàng
    updateRestaurant: builder.mutation({
      query: ({ id, updatedRestaurant }) => ({
        url: `restaurant/${id}`,
        method: 'PUT',
        body: updatedRestaurant,
      }),
      invalidatesTags: ['Restaurants'],
    }),

    // Xóa nhà hàng
    deleteRestaurant: builder.mutation({
      query: (id) => ({
        url: `restaurant/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Restaurants'],
    }),

  }),
});

export const {
  useGetAllRestaurantsQuery,
  useFetchPaginateRestaurantsQuery,
  useAddRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation
} = restaurantApi;
