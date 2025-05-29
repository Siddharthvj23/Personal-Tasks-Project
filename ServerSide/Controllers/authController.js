const pool = require('../Models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await pool.query('INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *', [name, email, hash]);
  res.status(201).json(user.rows[0]);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (!user.rows.length || !(await bcrypt.compare(password, user.rows[0].password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};
