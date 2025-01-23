require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const kostRoutes = require('./routes/kostRoutes');
// const chatRoutes = require('./routes/chatRoutes'); // jika Anda punya rute chat

// const errorHandler = require('./middleware/errorHandler'); // jika pakai error handler

const app = express();

// GLOBAL MIDDLEWARE
app.use(cors());
app.use(express.json());

// ROUTES
app.get('/', (req, res) => {
  res.send('MommyKost Backend Running...');
});

app.use('/auth', authRoutes);
app.use('/kost', kostRoutes);
// app.use('/chat', chatRoutes);

// app.use(errorHandler); // pakai global error handler jika perlu

module.exports = app;
