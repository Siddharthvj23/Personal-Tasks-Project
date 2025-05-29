const express = require('express');
const auth = require('../Middlewares/authMiddleware');
const { getStats } = require('../Controllers/statsController');

const router = express.Router();
router.use(auth);
router.get('/', getStats);

module.exports = router;
