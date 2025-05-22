const express = require('express');
const router = express.Router();
const { TableController } = require('../../../controllers/index');
const { AuthMiddleware } = require('../../../middlewares/index');

/**
 * author: XXX
 */
router.get('/', TableController.getAllTables);
router.put('/update-table/:id', TableController.updateTable);
router.post('/create-table', TableController.createTable);
router.delete('/delete-table/:id', TableController.deleteTable);
router.get('/page-tables', TableController.getPageTables);
// router.get('/', AuthMiddleware.checkRoles(['ADMIN']), TableController.getAllTables);

module.exports = router;
