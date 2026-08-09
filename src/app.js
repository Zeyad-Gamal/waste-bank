const express = require('express');
const cors = require('cors');
const morgan = require('morgan');


const path = require('path');
const authRoutes = require('./routes/auth.routes');
const offerRoutes = require('./routes/offer.routes');
const factoryRequestRoutes = require('./routes/factory-request.routes');
const purchaseRoutes = require('./routes/purchase.routes');
const inventoryRoutes = require('./routes/inventory.routes');
const saleRoutes = require('./routes/sale.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const processRatingRoutes = require('./routes/process_rating.routes');

const adminFarmerRoutes = require('./routes/admin/farmer.routes');
const adminFactoryRoutes = require('./routes/admin/factory.routes');
const adminOfferRoutes = require('./routes/admin/offer.routes');
const adminOfferImgsRoutes = require('./routes/admin/offerImages.routes');
const adminFactoryRequestsRoutes = require('./routes/admin/factory-request.routes');
const adminPurchasesRoutes = require('./routes/admin/purchase.routes');
const adminInventoryRoutes = require('./routes/admin/inventory.routes');
const adminUnitRoutes = require('./routes/admin/unit.routes');
const adminCategoryRoutes = require('./routes/admin/category.routes');
const adminSalesRoutes = require('./routes/admin/sale.routes');
const adminShipmentsRoutes = require('./routes/admin/shipment.routes');
const adminProcessRatingRoutes = require('./routes/admin/process_rating.routes');
const adminAnalysisRoutes = require('./routes/admin/analysis.routes');
const adminDashboardRoutes = require('./routes/admin/admin-dashboard.routes');


const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(
  express.urlencoded({
    extended: true
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/factory-requests', factoryRequestRoutes);

app.use('/api/purchases', purchaseRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/shipments',shipmentRoutes);
app.use('/api/process-rating',processRatingRoutes);
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);


app.use('/api/admin/farmers',adminFarmerRoutes);
app.use('/api/admin/factories',adminFactoryRoutes);
app.use('/api/admin/offers',adminOfferRoutes);
app.use('/api/admin/offer-images',adminOfferImgsRoutes);
app.use('/api/admin/requests',adminFactoryRequestsRoutes);
app.use('/api/admin/purchases',adminPurchasesRoutes);
app.use('/api/admin/inventory',adminInventoryRoutes);
app.use('/api/admin/units',adminUnitRoutes);
app.use('/api/admin/categories',adminCategoryRoutes);
app.use('/api/admin/sales',adminSalesRoutes);
app.use('/api/admin/shipments',adminShipmentsRoutes);
app.use('/api/admin/process-rating',adminProcessRatingRoutes);
app.use('/api/admin/analysis',adminAnalysisRoutes);
app.use('/api/admin/dashboard',adminDashboardRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('Waste Bank API is running...');
});



app.use(errorMiddleware);

module.exports = app;