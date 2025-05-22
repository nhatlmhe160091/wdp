const express = require('express');
const router = express.Router();
const { BookingController } = require('../../../controllers/index');
const { AuthMiddleware } = require('../../../middlewares/index');


router.get('/', BookingController.getAllBookings);
router.get('/page-bookings', BookingController.getPaginatedBookings);
router.get('/booking-by-time', BookingController.getBookingsByBookingTime);
router.get('/details-booking/:bookingId', BookingController.getBookingById);
router.put('/update-booking/:bookingId', BookingController.updateBooking);
router.patch('/update-reservation/:bookingId', BookingController.updateReservationForBooking);

router.post('/insert-booking', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER']), BookingController.insertBooking);
router.get('/', AuthMiddleware.checkRoles(['ADMIN']), BookingController.getAllBookings);
router.get('/get-bookings-by-customerId/:customerId', AuthMiddleware.checkRoles(['CUSTOMER']), BookingController.getBookingsByCustomerId);
router.post('/send-otp', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), BookingController.sendOtp);
router.post('/verify-otp', AuthMiddleware.checkRoles(['GUEST', 'CUSTOMER', 'STAFF', 'MANAGER', 'ADMIN']), BookingController.verifyOtp);
router.get('/booked-tables', BookingController.getBookedTables);
router.get('/bookings-by-table/:tableId', BookingController.getBookingsByTableId);
router.get('/booking-by-time-for-table', BookingController.getBookingsByBookingTimeForTable);
router.patch('/update-reservation-status/:bookingId', BookingController.updateReservationStatus);
module.exports = router;
