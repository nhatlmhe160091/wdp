import api from './index';
import { handleApiCall } from '../utils/handleApi';

const BookingService = {
    getBookings: async () => {
        return handleApiCall(() => api.get("/booking"));
    },

    getReservationsByBookingTime: async (bookingTime, timeRange) => {
        return handleApiCall(() =>
            api.get("/booking/booking-by-time", {
                params: { bookingTime, timeRange }
            })
        );
    },

    getBookingById: async (bookingId) => {
        return handleApiCall(() => api.get(`/booking/details-booking/${bookingId}`));
    },

    updateReservation: async (bookingId, reservationData) => {
        return handleApiCall(() =>
            api.patch(`/booking/update-reservation/${bookingId}`, reservationData)
        );
    },

    getPaginatedBookings: async ({ page = 1, limit = 10, date, time, restaurant, search, status, sort }) => {
        return handleApiCall(() =>
            api.get("/booking/page-bookings", {
                params: {
                    page,
                    limit,
                    date,
                    time,
                    restaurant,
                    search,
                    status,
                    sort
                }
            })
        );
    },

    assignTable: async (bookingId, tableId) => {
        return handleApiCall(() =>
            api.post('/booking/assign-table', { bookingId, tableId })
        );
    },

    getBooking: async ({ page = 1, limit = 10, sort = 'bookingDate', order = 'asc', filter = {} }) => {
        return handleApiCall(() =>
            api.get("/booking", {
                params: {
                    page,
                    limit,
                    sort,
                    order,
                    ...filter,
                }
            })
        );
    },

    updateBooking: async (bookingId, booking) => {
        return handleApiCall(() =>
            api.put(`/booking/update-booking/${bookingId}`, booking)
        );
    },

    insertBooking: async (filter) => {
        const {
            bookingTime,
            customerId,
            guestId,
            note,
            adultsCount,
            childrenCount,
            restaurantId
        } = filter;
        return handleApiCall(() =>
            api.post('/booking/insert-booking', {
                bookingTime,
                customerId,
                guestId,
                note,
                adultsCount,
                childrenCount,
                restaurantId
            })
        );
    },

    getBookingsByCustomerId: async (customerId) => {
        return handleApiCall(() =>
            api.get(`/booking/get-bookings-by-customerId/${customerId}`)
        );
    },

    sendOtp: async (phoneNumber) => {
        return handleApiCall(() =>
            api.post(`/booking/send-otp`, { phoneNumber })
        );
    },

    verifyOtp: async (filter) => {
        const { phoneNumber, code: otp } = filter;
        return handleApiCall(() =>
            api.post(`/booking/verify-otp`, { phoneNumber, code: otp })
        );
    },
    getBookedTables: async () => {
        return handleApiCall(() => api.get("/booking/booked-tables"));
    },
    getBookingsByTableId: async (tableId) => {
        return handleApiCall(() => api.get(`/booking/bookings-by-table/${tableId}`));
    },
    
    getReservationsByBookingTimeForTable: async (bookingTime, timeRange) => {
        return handleApiCall(() =>
            api.get("/booking/booking-by-time-for-table", {
                params: { bookingTime, timeRange }
            })
        );
    },
    updateReservationStatus: async (bookingId, status) => {
        return handleApiCall(() =>
            api.patch(`/booking/update-reservation-status/${bookingId}`, { status })
        );
    }
}

export default BookingService;
