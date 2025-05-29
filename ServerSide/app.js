const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes');
const taskRoutes = require('./Routes/taskRoutes');
const timeEntryRoutes = require('./Routes/timeEntryRoutes');
const statsRoutes = require('./Routes/statsRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/time', timeEntryRoutes);
app.use('/api/stats', statsRoutes);

module.exports = app;
