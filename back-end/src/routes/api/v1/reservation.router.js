const express = require('express');
const router = express.Router();
const { ReservationController } = require('../../../controllers/index');
const { AuthMiddleware } = require('../../../middlewares/index');

router.get('/reservations-by-time', ReservationController.getReservationsByBookingTime);
router.post('/create-reservation', ReservationController.createReservation);
module.exports = router;