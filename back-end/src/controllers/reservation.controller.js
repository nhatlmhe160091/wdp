const {ReservationService} = require('../services/index');
class ReservationController {
    getReservationsByBookingTime = async (req, res, next) => {
        try {
            const { bookingTime, timeRange } = req.query; // Lấy thông tin từ query params
            const range = parseInt(timeRange) || 120; // Nếu không có timeRange, mặc định là 2 giờ

            const reservations = await ReservationService.getReservationsByBookingTime(bookingTime, range);

            res.status(200).json({
                data: reservations,
                message: 'Success'
            });
        } catch (error) {
            next(error);
        }
    }
    createReservation = async (req, res, next) => {
        try {
            const reservationData = req.body;
            const reservation = await ReservationService.createReservation(reservationData);
            res.status(200).json({
                data: reservation,
                message: 'Reservation created successfully'
            });
        } catch (error) {
            if (error.message.includes('already been assigned')) {
                return res.status(400).json({ message: error.message });
            }
            next(error);
        }
    }
}
module.exports = new ReservationController;
