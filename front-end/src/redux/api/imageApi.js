import { rootApi } from './rootApi';

export const imageApi = rootApi.injectEndpoints({
  reducerPath: 'imageApi',
  tagTypes: ['Images'],
  endpoints: (builder) => ({

    // upload a new image
    uploadImage: builder.mutation({
      query: (newImage) => ({
        url: '/image/upload-image',
        method: 'POST',
        body: newImage,
      }),
      invalidatesTags: ['Images'],
    }),

    // get images by entityId
    getImagesByEntityId: builder.query({
      query: (entityId) => `/image/get-image/${entityId}`,
      providesTags: ['Images'],
    }),

    // delete an image
    deleteImage: builder.mutation({
      query: (imageId) => ({
        url: `/image/delete-image/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Images'],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useGetImagesByEntityIdQuery,
  useDeleteImageMutation
} = imageApi;
