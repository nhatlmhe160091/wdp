import { rootApi } from './rootApi';
export const dishApi = rootApi.injectEndpoints({
  reducerPath: 'dishApi',
  tagTypes: ['Dishs'],
  endpoints: (builder) => ({

    // get all dishes
    getAllDishes: builder.query({
      query: () => '/dish',
      providesTags: ['Dishs'],
    }),

    // get paginated dishes
    fetchPaginateDishes: builder.query({
      query: (pageNumber) => `/dish/paginatedDishes?page=${pageNumber}`,
      providesTags: ['Dishs'],
    }),

    // add a dish
    addDish: builder.mutation({
      query: (newDish) => ({
        url: '/dish',
        method: 'POST',
        body: newDish,
      }),
      invalidatesTags: ['Dishs'],
    }),

    // update a dish
    updateDish: builder.mutation({
      query: ({ id, updatedDish }) => ({
        url: `dish/${id}`,
        method: 'PUT',
        body: updatedDish,
      }),
      invalidatesTags: ['Dishs'],
    }),

    // Delete a dish
    deleteDish: builder.mutation({
      query: (id) => ({
        url: `dish/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Dishs'],
    }),

  }),
});


export const {
  useGetAllDishesQuery,
  useFetchPaginateDishesQuery,
  useAddDishMutation,
  useUpdateDishMutation,
  useDeleteDishMutation
} = dishApi;
