const pool = require('../Models/db');

exports.addTimeEntry = async (req, res) => {
  const { task_id, start_time, end_time } = req.body;
  const result = await pool.query(
    'INSERT INTO time_entries(task_id, user_id, start_time, end_time) VALUES($1, $2, $3, $4) RETURNING *',
    [task_id, req.user.id, start_time, end_time]
  );
  res.status(201).json(result.rows[0]);
};

exports.getTimeEntries = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM time_entries WHERE user_id = $1',
    [req.user.id]
  );
  res.json(result.rows);
};
