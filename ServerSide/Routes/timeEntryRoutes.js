const express = require('express');
const auth = require('../Middlewares/authMiddleware');
const { body } = require('express-validator');
const validate = require('../Middlewares/validateRequest');
const { addTimeEntry, getTimeEntries } = require('../Controllers/timeEntryController');

const router = express.Router();
router.use(auth);

router.post('/', [
  body('task_id').isInt(),
  body('start_time').isISO8601(),
  body('end_time').isISO8601(),
], validate, addTimeEntry);

router.get('/', getTimeEntries);

module.exports = router;
