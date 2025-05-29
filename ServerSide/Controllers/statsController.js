const pool = require('../Models/db');

exports.getStats = async (req, res) => {
  const totalTasks = await pool.query('SELECT COUNT(*) FROM tasks WHERE user_id = $1', [req.user.id]);
  const totalTime = await pool.query(`
    SELECT SUM(EXTRACT(EPOCH FROM (end_time - start_time))) AS total_seconds
    FROM time_entries WHERE user_id = $1`, [req.user.id]);
  res.json({
    totalTasks: parseInt(totalTasks.rows[0].count),
    totalTrackedHours: (totalTime.rows[0].total_seconds / 3600).toFixed(2)
  });
};
