require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const assetRoutes = require('./src/routes/assets');
const authRoutes = require('./src/routes/auth');
const { initSocket } = require('./src/utils/broadcast');

const app = express();
const server = http.createServer(app); // server must be defined BEFORE using it

// initialize socket.io
initSocket(server);

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());
app.use(rateLimit({ windowMs: 60*1000, max: 120 }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);

const PORT = process.env.PORT || 5000;
const MONGO = process.env.MONGO_URI;

// Connect to MongoDB Atlas
mongoose.connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongo connected');
    server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  }).catch(err => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

// simple health check route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});
