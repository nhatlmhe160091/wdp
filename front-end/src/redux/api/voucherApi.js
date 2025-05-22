import { rootApi } from './rootApi';

export const voucherApi = rootApi.injectEndpoints({
  reducerPath: 'voucherApi',
  tagTypes: ['Vouchers'],
  endpoints: (builder) => ({

    // Get all vouchers
    getAllVouchers: builder.query({
      query: () => '/voucher',
      providesTags: ['Vouchers'],
    }),

    // Get paginated vouchers
    fetchPaginateVouchers: builder.query({
      query: (pageNumber) => `/voucher/paginatedVouchers?page=${pageNumber}`,
      providesTags: ['Vouchers'],
    }),

    // Add a voucher
    addVoucher: builder.mutation({
      query: (newVoucher) => ({
        url: '/voucher',
        method: 'POST',
        body: newVoucher,
      }),
      invalidatesTags: ['Vouchers'],
    }),

    // Update a voucher
    updateVoucher: builder.mutation({
      query: ({ id, updatedVoucher }) => ({
        url: `voucher/${id}`,
        method: 'PUT',
        body: updatedVoucher,
      }),
      invalidatesTags: ['Vouchers'],
    }),

    // Delete a voucher
    deleteVoucher: builder.mutation({
      query: (id) => ({
        url: `voucher/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vouchers'],
    }),

  }),
});

export const {
  useGetAllVouchersQuery,
  useFetchPaginateVouchersQuery,
  useAddVoucherMutation,
  useUpdateVoucherMutation,
  useDeleteVoucherMutation
} = voucherApi;
