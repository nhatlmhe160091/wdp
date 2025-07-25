const { Booking, Restaurant, Table, User, Guest } = require('../models/index');
const tableService = require('./table.service');
const admin = require('../configs/firebaseAdmin');

class BookingService {

    /**
     * author: XXX
     */
    getAllBookings = async () => {
        return await Booking.find()
            .populate('restaurant')
            .populate('customer')
            .populate('guest')
            .populate({
                path: 'reservation.table',
                model: 'Table'
            });
    }
    /**
      * author: XXX
      */
    getBookingById = async (bookingId) => {
        const booking = await Booking.findById(bookingId).select('bookingTime adultsCount childrenCount note status reservation');
        if (!booking) {
            return { error: true, message: 'Booking not found' };
        }
        return { error: false, data: booking };
    };
    /**
  * author: XXX
  */
    updateBookingFields = async (bookingId, bookingData) => {
        try {
            const allowedUpdates = {
                bookingTime: bookingData.bookingTime,
                adultsCount: bookingData.adultsCount,
                childrenCount: bookingData.childrenCount,
                note: bookingData.note,
                status: bookingData.status
            };
            // if (allowedUpdates.bookingTime) {
            //     const bookingTime = new Date(allowedUpdates.bookingTime);
            //     if (bookingTime <= Date.now()) {
            //         throw new Error('Thời gian đặt bàn phải ở tương lai.');
            //     }
            // }
            const updatedBooking = await Booking.findByIdAndUpdate(
                bookingId,
                { $set: allowedUpdates },
                { new: true, runValidators: true, context: 'query' }
            ).select('bookingTime adultsCount childrenCount note status');

            if (!updatedBooking) {
                return { error: true, message: 'Booking not found' };
            }

            return { error: false, message: 'Booking updated successfully', data: updatedBooking };
        } catch (error) {
            console.error('Error updating booking:', error);
            return { error: true, message: error.message || 'Internal Server Error' };
        }
    };
    /**
* author: XXX
*/
    getPaginatedBookings = async ({ page = 1, limit = 10, date, time, restaurant, search, status, sort }) => {
        const skip = (page - 1) * limit;
        const query = {};

        // Nếu truyền cả date và time thì lọc theo khoảng +-60 phút
        if (date && time) {
            const [hour, minute] = time.split(':').map(Number);
            const center = new Date(date);
            center.setHours(hour, minute, 0, 0); // Cộng thêm 7 giờ để chuyển sang UTC

            const startDate = new Date(center);
            startDate.setMinutes(startDate.getMinutes() - 60);
            const endDate = new Date(center);
            endDate.setMinutes(endDate.getMinutes() + 60);

            // console.log('Filter by date & time (+7h):');
            // console.log('center:', center);
            // console.log('startDate:', startDate);
            // console.log('endDate:', endDate);

            query.bookingTime = { $gte: startDate, $lt: endDate };
        } else if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(endDate.getDate() + 1);
            query.bookingTime = { $gte: startDate, $lt: endDate };
        } else if (time) {
            const [hour, minute] = time.split(':').map(Number);
            const now = new Date();
            now.setHours(hour, minute, 0, 0);
            const endDate = new Date(now);
            endDate.setHours(now.getHours() + 1);
            query.bookingTime = { $gte: now, $lt: endDate };
        }

        if (restaurant) {
            query.restaurant = restaurant;
        }

        if (search) {
            const userIds = await User.find({
                $or: [
                    { fname: { $regex: search, $options: 'i' } },
                    { lname: { $regex: search, $options: 'i' } },
                    { phoneNumber: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }, '_id');

            const guestIds = await Guest.find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { phoneNumber: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            }, '_id');

            query.$or = [
                { customer: { $in: userIds } },
                { guest: { $in: guestIds } }
            ];
        }

        if (status) {
            query.status = status;
        }
        const sortOptions = sort
            ? { "bookingTime": sort === 'bookingTime' ? 1 : -1 }
            : { bookingTime: -1 };
        const bookings = await Booking.find(query)
    .populate({
        path: 'restaurant',
        select: '_id name address'
    })
    .populate('customer')
    .populate('guest')
    .populate({
        path: 'reservation.table',
        model: 'Table'
    })
    .populate({
        path: 'dishes',
        select: '_id name price category'
    })
    .skip(skip)
    .limit(Number(limit))
    .sort(sortOptions)
    .lean();

        const customerPromises = bookings.map(async (booking) => {
            if (booking.customer && booking.customer.firebaseUID) {
                try {
                    const userRecord = await admin.auth().getUser(booking.customer.firebaseUID);
                    booking.customer.email = userRecord.email;
                } catch (error) {
                    throw error;
                }
            }
        });

        await Promise.all(customerPromises);

        const totalBookings = await Booking.countDocuments(query);

        return {
            data: bookings,
            total: totalBookings,
            currentPage: page,
            totalPages: Math.ceil(totalBookings / limit),
        };
    };
    /**
* author: XXX
*/
    getBookingsByBookingTime = async (bookingTime, timeRange) => {
        try {
            // console.log('Received bookingTime:', bookingTime);
            // console.log('Received timeRange:', timeRange);
            if (timeRange < 0) {
                throw new Error('Time range must be a positive number');
            }

            const bookingDateTime = new Date(bookingTime);
            // console.log('Parsed bookingDateTime:', bookingDateTime);

            if (isNaN(bookingDateTime.getTime())) {
                throw new Error('Booking time is invalid');
            }

            // Tính thời gian trước và sau bookingTime theo phút
            const startTime = new Date(bookingDateTime);
            startTime.setMinutes(startTime.getMinutes() - timeRange);
            // console.log('Calculated startTime:', startTime);

            const endTime = new Date(bookingDateTime);
            endTime.setMinutes(endTime.getMinutes() + timeRange);
            // console.log('Calculated endTime:', endTime);


            const bookings = await Booking.find();
            const filteredBookings = bookings.filter(booking => {
                const bookingDateTime = new Date(booking.bookingTime);
                return bookingDateTime >= startTime && bookingDateTime < endTime;
            }).map(booking => {
                booking.bookingTime = new Date(booking.bookingTime);
                return booking;
            });

            // console.log('Found filteredBookings:', filteredBookings);

            // tableed              
            const bookingTableIds = filteredBookings.flatMap(booking =>
                booking.reservation?.table?.map(t => t.toString()) || []
            );
            const tablesInBookings = await Table.find({
                _id: { $in: bookingTableIds }
            });
            const bookingsWithTables = filteredBookings.map(booking => {
                booking.reservation.table = booking.reservation.table.map(tableId =>
                    tablesInBookings.find(table => table._id.toString() === tableId.toString())
                );
                return booking;
            });
            //table not yet           
            const availableTables = await Table.find({
                _id: { $nin: bookingTableIds }
            });

            // console.log('Found availableTables:', availableTables);

            // Trả về danh sách bookings và các table không bị đặt trước             
            return {
                bookings: bookingsWithTables,
                availableTables
            };
        } catch (error) {
            console.error('Error getting bookings by booking time:', error);
            throw error;
        }
    };
    /**
* author: XXX
*/
    updateReservationForBooking = async (bookingId, reservationData) => {
        try {
            const { table, status } = reservationData;


            if (!table || !Array.isArray(table) || !table.length) {
                throw new Error('Missing required reservation data');
            }
            const tables = await Table.find({ _id: { $in: table } });
            if (tables.length !== table.length) {
                throw new Error('One or more table IDs do not exist');
            }

            const booking = await Booking.findById(bookingId);
            if (!booking) {
                throw new Error('Booking not found');
            }


            booking.reservation = {
                table: table.map(id => ({ _id: id })),
                status: status || 'RESERVED',
            };
            booking.status = 'TABLE_ASSIGNED';

            const updatedBooking = await booking.save();
            // console.log('Updated booking with reservation:', updatedBooking);

            return updatedBooking;
        } catch (error) {
            console.error('Error updating reservation for booking:', error);
            throw error;
        }
    };


   insertBooking = async (
        bookingTime,
        customerId,
        guestId,
        note,
        adultsCount = 1,
        childrenCount = 0,
        restaurantId,
        dishes = [] // Thêm tham số này
    ) => {
        if (!customerId && !guestId) {
            throw new Error('Lỗi không xác định được người đặt bàn');
        }
        bookingTime = new Date(bookingTime);
        if (bookingTime <= Date.now()) {
            throw new Error('Thời gian đặt bàn phải ở tương lai.');
        }
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            throw new Error('Không tìm thấy nhà hàng hợp lệ')
        }

        const newBooking = new Booking({
            bookingTime,
            customer: customerId || null,
            guest: guestId || null,
            note,
            adultsCount,
            childrenCount,
            restaurant: restaurantId,
            dishes // Lưu danh sách món ăn
        })
        const data = await newBooking.save();
        return {
            data
        }
    }


    getBookingsByCustomerId = async (customerId) => {
        const bookings = await Booking.find({ customer: customerId })
            .populate('restaurant')
            .exec();
        return {
            data: bookings
        };
    }
    getBookedTables = async () => {
        const bookings = await Booking.find()
            .populate('reservation.table');

        // Use a Map to store tables by their IDs and their closest booking time
        const tableMap = new Map();
        const currentTime = Date.now();

        bookings.forEach(booking => {
            booking.reservation?.table.forEach(table => {
                const tableId = table._id.toString();
                const existingEntry = tableMap.get(tableId);
                const bookingTime = booking.bookingTime;

                // If the table is not in the map or this booking time is closer to the current time, update it
                if (!existingEntry || Math.abs(bookingTime - currentTime) < Math.abs(existingEntry.bookingTime - currentTime)) {
                    tableMap.set(tableId, {
                        table,
                        bookingTime,
                        status: booking?.reservation?.status,
                        bookingId: booking._id
                    });
                }
            });
        });

        // Convert the Map values to an array
        const bookedTables = Array.from(tableMap.values());

        return {
            data: bookedTables
        };
    };


    getBookingsByTableId = async (tableId) => {
        const bookings = await Booking.find({ 'reservation.table': tableId })
            .populate('customer')
            .populate('guest')
            .populate({
                path: 'reservation.table',
                model: 'Table'
            });
        return {
            data: bookings
        };
    }
    getBookingsByBookingTimeForTable = async (bookingTime, timeRange) => {
        try {
            // console.log('Received bookingTime:', bookingTime);
            // console.log('Received timeRange:', timeRange);

            if (timeRange < 0) {
                throw new Error('Time range must be a positive number');
            }

            // Adjust bookingTime by subtracting 7 hours (420 minutes)
            const adjustedBookingTime = new Date(new Date(bookingTime).getTime() - 420 * 60000);
            // console.log('Adjusted bookingTime (-7 hours):', adjustedBookingTime);

            if (isNaN(adjustedBookingTime.getTime())) {
                throw new Error('Booking time is invalid');
            }

            // Calculate start and end times based on adjusted bookingTime and timeRange
            const startTime = new Date(adjustedBookingTime);
            startTime.setMinutes(startTime.getMinutes() - timeRange);
            // console.log('Calculated startTime:', startTime);

            const endTime = new Date(adjustedBookingTime);
            endTime.setMinutes(endTime.getMinutes() + timeRange);
            // console.log('Calculated endTime:', endTime);

            const bookings = await Booking.find();
            const filteredBookings = bookings.filter(booking => {
                const bookingDateTime = new Date(booking.bookingTime);
                return bookingDateTime >= startTime && bookingDateTime < endTime;
            }).map(booking => {
                booking.bookingTime = new Date(booking.bookingTime);
                return booking;
            });

            // console.log('Found filteredBookings:', filteredBookings);

            // Extract table IDs from filtered bookings
            const bookingTableIds = filteredBookings.flatMap(booking =>
                booking.reservation?.table?.map(t => t.toString()) || []
            );
            const tablesInBookings = await Table.find({
                _id: { $in: bookingTableIds }
            });
            const bookingsWithTables = filteredBookings.map(booking => {
                booking.reservation.table = booking.reservation.table.map(tableId =>
                    tablesInBookings.find(table => table._id.toString() === tableId.toString())
                );
                return booking;
            });

            // Find tables that are not in any bookings
            const availableTables = await Table.find({
                _id: { $nin: bookingTableIds }
            });

            // console.log('Found availableTables:', availableTables);

            // Return filtered bookings and available tables             
            return {
                bookings: bookingsWithTables,
                availableTables
            };
        } catch (error) {
            console.error('Error getting bookings by booking time:', error);
            throw error;
        }
    };
    updateReservationStatus = async (bookingId, status) => {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }

        if (!booking.reservation) {
            throw new Error('Reservation not found in booking');
        }

        booking.reservation.status = status;
        await booking.save();

        return booking;
    };
 
getDashboardStats = async (date) => {
    // Xác định ngày cần filter, mặc định là hôm nay nếu không truyền
    let filterDate = date ? new Date(date) : new Date();
    filterDate.setHours(0, 0, 0, 0);
    const nextDate = new Date(filterDate);
    nextDate.setDate(filterDate.getDate() + 1);

    // Lấy tất cả booking trong ngày
    const todayBookings = await Booking.find({
        bookingTime: { $gte: filterDate, $lt: nextDate }
    }).populate('reservation.table');

    // Tổng số bàn được đặt hôm nay
    const todayBookedTables = todayBookings.reduce((acc, booking) => {
        if (booking.reservation && booking.reservation.table) {
            acc += booking.reservation.table.length;
        }
        return acc;
    }, 0);

    // Đếm số lần mỗi bàn được đặt hôm nay
    const tableCountMap = {};
    todayBookings.forEach(booking => {
        if (booking.reservation && booking.reservation.table) {
            booking.reservation.table.forEach(table => {
                const tableId = table._id.toString();
                tableCountMap[tableId] = (tableCountMap[tableId] || 0) + 1;
            });
        }
    });

    // Lấy thông tin chi tiết các bàn
    const allTableIds = Object.keys(tableCountMap);
    const tables = await Table.find({ _id: { $in: allTableIds } });

    // Danh sách bàn đặt nhiều nhất và ít nhất hôm nay
    let mostBookedTable = null, leastBookedTable = null;
    if (tables.length > 0) {
        const sorted = tables
            .map(table => ({
                table,
                count: tableCountMap[table._id.toString()] || 0
            }))
            .sort((a, b) => b.count - a.count);

        mostBookedTable = sorted[0];
        leastBookedTable = sorted[sorted.length - 1];
    }

    // Các thống kê khác giữ nguyên
    const totalBookings = await Booking.countDocuments();
    const bookingStatusStats = await Booking.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const bookedTableStats = await Booking.aggregate([
        { $match: { status: { $in: ["TABLE_ASSIGNED", "COMPLETED"] } } },
        { $unwind: "$reservation.table" },
        { $group: { _id: null, count: { $sum: 1 } } }
    ]);
    const totalBookedTables = bookedTableStats[0]?.count || 0;
    const cancelledTableStats = await Booking.aggregate([
        { $match: { status: "CANCELLED" } },
        { $unwind: "$reservation.table" },
        { $group: { _id: null, count: { $sum: 1 } } }
    ]);
    const totalCancelledTables = cancelledTableStats[0]?.count || 0;
    const totalUsers = await User.countDocuments();
    const totalGuests = await Guest.countDocuments();
    const totalCustomers = totalUsers + totalGuests;
    const totalRestaurants = await Restaurant.countDocuments();
    const totalTables = await Table.countDocuments();
    const bookingsByMonth = await Booking.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$bookingTime" } },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);
    const topCustomers = await Booking.aggregate([
        { $match: { customer: { $ne: null } } },
        { $group: { _id: "$customer", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "customer"
            }
        },
        { $unwind: "$customer" },
        { $project: { _id: 0, customer: 1, count: 1 } }
    ]);
    const topRestaurants = await Booking.aggregate([
        { $group: { _id: "$restaurant", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
            $lookup: {
                from: "restaurants",
                localField: "_id",
                foreignField: "_id",
                as: "restaurant"
            }
        },
        { $unwind: "$restaurant" },
        { $project: { _id: 0, restaurant: 1, count: 1 } }
    ]);

    return {
        totalBookings,
        bookingStatusStats,
        totalBookedTables,
        totalCancelledTables,
        totalCustomers,
        totalRestaurants,
        totalTables,
        bookingsByMonth,
        topCustomers,
        topRestaurants,
        todayBookedTables,
        mostBookedTable, // { table, count }
        leastBookedTable // { table, count }
    };
}

}

module.exports = new BookingService;
