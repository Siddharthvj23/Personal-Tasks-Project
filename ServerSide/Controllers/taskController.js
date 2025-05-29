const pool = require('../Models/db');

exports.createTask = async (req, res) => {
  const { title, description, status } = req.body;
  const result = await pool.query(
    'INSERT INTO tasks(user_id, title, description, status) VALUES($1, $2, $3, $4) RETURNING *',
    [req.user.id, title, description, status]
  );
  res.status(201).json(result.rows[0]);
};

exports.getTasks = async (req, res) => {
  const result = await pool.query('SELECT * FROM tasks WHERE user_id = $1', [req.user.id]);
  res.json(result.rows);
};

exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const result = await pool.query(
    'UPDATE tasks SET title=$1, description=$2, status=$3 WHERE id=$4 AND user_id=$5 RETURNING *',
    [title, description, status, id, req.user.id]
  );
  res.json(result.rows[0]);
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM tasks WHERE id=$1 AND user_id=$2', [id, req.user.id]);
  res.status(204).end();
};
