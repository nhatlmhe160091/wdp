const { TableService } = require('../services/index');

class TableController {
     /**
    * method: GET
    * router(/api/v1/table)
    * author: XXX
    */
    getAllTables = async (req, res, next) => {
        try {
            const tables = await TableService.getAllTables();
            res.status(200).json({
                data: tables,

            });
        } catch (error) {
            next(error);
        }
    }

       /**
    * method: PUT
    * router(/api/v1/table/update-table/:id)
    * author: XXX
    */
    updateTable = async (req, res, next) => {
        const { id } = req.params;
        const tableData = req.body;
        try {
            const updatedTable = await TableService.updateTable(id, tableData);
            if (!updatedTable) {
                return res.status(404).json({ message: 'Table not found' });
            }
            res.status(200).json({
                message: 'Table updated successfully',
                data: updatedTable,
            });
        } catch (error) {
            if (error.message.includes('already exists')) {
                return res.status(400).json({ message: error.message });
            }
            next(error);
        }
    }
         /**
    * method: POST
    * router(/api/v1/table/create-table)
    * author: XXX
    */
    createTable = async (req, res, next) => {
        const tableData = req.body;
        try {
            const table = await TableService.createTable(tableData);
            res.status(201).json({
                message: 'Table created successfully',
                data: table,
            });
        } catch (error) {
            if (error.message.includes('already exists')) {
                return res.status(400).json({ message: error.message });
            }
            next(error);
        }
    }
            /**
             * method: DELETE
             * router(/api/v1/table/delete-table/:id)
             * author: XXX
             * */
    deleteTable = async (req, res, next) => {
        const { id } = req.params;
        try {
            const deletedTable = await TableService.deleteTable(id);
            if (!deletedTable) {
                return res.status(404).json({ message: 'Table not found' });
            }
            res.status(200).json({
                message: 'Table deleted successfully',
                data: deletedTable,
            });
        } catch (error) {
            next(error);
        }
    }
    /**
     * method: GET
     * router(/api/v1/table/page-tables)
     * author: XXX
     * */
    getPageTables = async (req, res, next) => {
        const { page, limit, search, restaurant } = req.query;
        try {
            const tables = await TableService.getPaginatedTables({ page, limit, search, restaurant });
            res.status(200).json( tables);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TableController;
