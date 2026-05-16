const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const path = require('path');
const authRoutes = require('./routes/auth.routes');
const offerRoutes = require('./routes/offer.routes');
const factoryRequestRoutes = require('./routes/factory-request.routes');
const purchaseRoutes = require('./routes/purchase.routes');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/factory-requests', factoryRequestRoutes);

app.use('/api/purchases', purchaseRoutes);

app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

// Test route
app.get('/', (req, res) => {
  res.send('Waste Bank API is running...');
});



module.exports = app;