const { Table } = require('../models/index');

class TableService {
    /**
    * author: XXX
    */
    getAllTables = async () => {
        return await Table.find().populate('restaurant');
    }
  
    createTable = async (tableData) => {
        const { tableNumber, restaurant } = tableData;
        if (!restaurant) {
            throw new Error('Restaurant is required.');
        }
        // Check if table with same number already exists in the same restaurant
        const existingTable = await Table.findOne({ tableNumber, restaurant });
        if (existingTable) {
            throw new Error(`Table number ${tableNumber} already exists in the restaurant.`);
        }

        // If no duplicate found, create the new table
        return await Table.create(tableData);
    }
    updateTable = async (tableId, tableData) => {
        const { tableNumber, restaurant } = tableData;

        // Check if there's another table with the same number in the same restaurant (excluding the current table being updated)
        const existingTable = await Table.findOne({
            tableNumber,
            restaurant,
            _id: { $ne: tableId }  // Exclude the current table being updated
        });

        if (existingTable) {
            throw new Error(`Table number ${tableNumber} already exists in the restaurant.`);
        }

        // If no duplicate found, update the table
        return await Table.findByIdAndUpdate(
            tableId,
            tableData,
            { new: true }
        );
    }
    deleteTable = async (tableId) => {
        return await Table.findByIdAndDelete(tableId);
    }
    getTableById = async (tableId) => {
        return await Table.findById(tableId);
    }
    getPaginatedTables = async ({ page = 1, limit = 10, search = '', restaurant = '' }) => {
        const skip = (page - 1) * limit;
        const query = {};

        
    if (search) {
        // Check if the search term can be converted to a number
        const searchNumber = Number(search);
        if (!isNaN(searchNumber)) {
            query.tableNumber = searchNumber;
        } else {
            query.tableNumber = { $regex: search, $options: 'i' };
        }
    }

        if (restaurant) {
            query.restaurant = restaurant;
        }

        const tables = await Table.find(query)
            .populate('restaurant')
            .skip(skip)
            .limit(Number(limit));

        const totalTables = await Table.countDocuments(query);

        return {
            data: tables,
            total: totalTables,
            currentPage: page,
            totalPages: Math.ceil(totalTables / limit),
        };
    }

}
module.exports = new TableService;
