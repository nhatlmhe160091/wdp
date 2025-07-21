const { BookingService } = require('../services/index');

class BookingController {
    /**
    * method: GET
    * router(/api/v1/booking)
    * author: XXX
    */
    getAllBookings = async (req, res, next) => {
        try {
            const bookings = await BookingService.getAllBookings();
            res.status(200).json({
                data: bookings,
            });
        } catch (error) {
            next(error);
        }
    }

  /**
    * method: GET
    * router(/api/v1/booking/details-booking/:bookingId)
    * author: XXX
    */
    getBookingById = async (req, res, next) => {
        const { bookingId } = req.params;
        try {
            const result = await BookingService.getBookingById(bookingId);
            if (result.error) {
                return res.status(404).json({
                    error: true,
                    message: result.message,
                });
            }
            res.status(200).json({
                message: 'Booking fetched successfully',
                data: result.data,
            });
        } catch (error) {
            next(error);
        }
    };
      /**
    * method: PUT
    * router(/api/v1/booking/update-booking/:bookingId)
    * author: XXX
    */
    updateBooking = async (req, res, next) => {
        const { bookingId } = req.params;
        const bookingData = req.body;
        try {
            const result = await BookingService.updateBookingFields(bookingId, bookingData);
            if (result.error) {
                return res.status(400).json({
                    error: true,
                    message: result.message
                });
            }
            res.status(200).json({
                message: result.message,
                data: result.data,
            });
        } catch (error) {
            next(error);
        }
    };
  /**
    * method: GET
    * router(/api/v1/booking/page-bookings)
    * author: XXX
    */
    getPaginatedBookings = async (req, res, next) => {
        try {
            // Extract query parameters
            const { page, limit, date, time, restaurant, search, status, sort } = req.query;

            // Call service with pagination, sorting, and filtering options
            const result = await BookingService.getPaginatedBookings({
                page: Number(page) || 1,
                limit: Number(limit) || 10,
                date,
                time,
                restaurant,
                search,
                status,
                sort
            });

            res.status(200).json({
                message: 'Bookings fetched successfully',
                ...result,
            });
        } catch (error) {
            next(error);
        }
    }
    /**
    * method: POST
    * router(/api/v1/booking)
    * author: XXX
    */
    insertBooking = async (req, res, next) => {
        try {
            const {
                bookingTime,
                customerId,
                guestId,
                note,
                adultsCount,
                childrenCount,
                restaurantId
            } = req.body;
            const data = await BookingService.insertBooking(
                bookingTime,
                customerId,
                guestId,
                note,
                adultsCount,
                childrenCount,
                restaurantId);
            res.status(200).json(data);
        } catch (error) {
            next(error);
        }
    }

    getBookingsByBookingTime = async (req, res, next) => {
        try {
            const { bookingTime, timeRange } = req.query;
            const range = parseInt(timeRange) || 120;

            const bookings = await BookingService.getBookingsByBookingTime(bookingTime, range);

            res.status(200).json({
                data: bookings,
                message: 'Success'
            });
        } catch (error) {
            next(error);
        }
    }
    updateReservationForBooking = async (req, res, next) => {
        const { bookingId } = req.params;
        const reservationData = req.body;

        try {
            const updatedBooking = await BookingService.updateReservationForBooking(bookingId, reservationData);

            if (!updatedBooking) {
                return res.status(404).json({
                    error: true,
                    message: 'Booking not found or reservation could not be updated',
                });
            }

            res.status(200).json({
                message: 'Reservation updated successfully',
                data: updatedBooking,
            });
        } catch (error) {
            if (error.message.includes('Missing required reservation data') || error.message.includes('do not exist')) {
                return res.status(400).json({
                    error: true,
                    message: error.message,
                });
            }
            next(error);
        }
    };

    /**
    * method: GET
    * router(/api/v1/booking/get-bookings-by-customerId/:customerId)
    * author: XXX
    */
    getBookingsByCustomerId = async (req, res) => {
        try {
            const { customerId } = req.params;
            const bookings = await BookingService.getBookingsByCustomerId(customerId);
            res.status(200).json(bookings);
        } catch (error) {
            next(error);
        }
    };

    /**
    * method: GET
    * router(/api/v1/booking/send-otp)
    * note: not done yet
    * author: XXX
    */
    sendOtp = async (req, res, next) => {
        try {
            const bookings = await BookingService.getAllBookings();
            res.status(200).json({
                data: bookings,
            });
        } catch (error) {
            next(error)
        }
    }

    /**
    * method: POST
    * router(/api/v1/booking/verify-otp)
    * note: not done yet
    * author: XXX
    */
    verifyOtp = async (req, res, next) => {
        try {
            const bookings = await BookingService.getAllBookings();
            res.status(200).json({
                data: bookings,
            });
        } catch (error) {
            next(error)
        }
    }
    getBookedTables = async (req, res, next) => {
        try {
            const bookedTables = await BookingService.getBookedTables();
            res.status(200).json(bookedTables);
        } catch (error) {
            next(error);
        }
    }
    getBookingsByTableId = async (req, res, next) => {
        const { tableId } = req.params;
        try {
            const bookings = await BookingService.getBookingsByTableId(tableId);
            res.status(200).json(bookings);
        } catch (error) {
            next(error);
        }
    }
    
    getBookingsByBookingTimeForTable = async (req, res, next) => {
        try {
            const { bookingTime, timeRange } = req.query;
            const range = parseInt(timeRange) || 120;

            const bookings = await BookingService.getBookingsByBookingTimeForTable(bookingTime, range);

            res.status(200).json({
                data: bookings,
                message: 'Success'
            });
        } catch (error) {
            next(error);
        }
    }
    updateReservationStatus = async (req, res, next) => {
        const { bookingId } = req.params;
        const { status } = req.body;

        try {
            const updatedBooking = await BookingService.updateReservationStatus(bookingId, status);
            res.status(200).json({
                message: 'Reservation status updated successfully',
                data: updatedBooking,
            });
        } catch (error) {
            next(error);
        }
    };

    getDashboardStats = async (req, res, next) => {
        try {
            const stats = await BookingService.getDashboardStats();
            res.status(200).json({
                message: 'Dashboard statistics fetched successfully',
                data: stats,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookingController;