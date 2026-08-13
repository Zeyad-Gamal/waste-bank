'use strict';

const {
  Op,
  fn,
  col,
  literal,
  where,
} = require('sequelize');

const {
  User,
  Farmer,
  Factory,
  Offer,
  Purchase,
  Sale,
  SaleItem,
  Inventory,
  Shipment,
  Category,
  Unit,
  FactoryRequest,
} = require('../models');


// ======================================================
// CONSTANTS
// ======================================================

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];


// ======================================================
// HELPERS
// ======================================================

const getYearRange = (year) => ({
  start: new Date(year, 0, 1),
  end: new Date(year + 1, 0, 1),
});


const calculateTrend = (current, previous) => {

  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }

  return Number(
    (
      ((current - previous) / previous) *
      100
    ).toFixed(1)
  );
};


// ======================================================
// STATS
// ======================================================

const getStats = async () => {

  const currentYear =
    new Date().getFullYear();

  const current =
    getYearRange(currentYear);

  const previous =
    getYearRange(currentYear - 1);


  const [

    totalUsers,
    totalFarmers,
    totalFactories,

    pendingOffers,
    approvedOffers,
    rejectedOffers,

    pendingRequests,

    approvedPurchases,

    inventoryStock,

    completedSales,

    scheduledShipments,
    completedShipments,

  ] = await Promise.all([

    User.count({
      where: {
        role: {
          [Op.in]: ['farmer', 'factory'],
        }
      }
    }),

    Farmer.count(),

    Factory.count(),


    Offer.count({
      where: {
        status: 'pending',
      },
    }),

    Offer.count({
      where: {
        status: 'approved',
      },
    }),

    Offer.count({
      where: {
        status: 'rejected',
      },
    }),


    FactoryRequest.count({
      where: {
        status: 'pending',
      },
    }),


    Purchase.count({
      where: {
        status: 'approved',
      },
    }),


    Inventory.sum(
      'remaining_quantity'
    ),


    Sale.count({
      where: {
        status: 'completed',
      },
    }),


    Shipment.count({
      where: {
        status: 'pending',
      },
    }),

    Shipment.count({
      where: {
        status: 'completed',
      },
    }),

  ]);


  // ====================================================
  // CURRENT YEAR
  // ====================================================

  const [

    currentUsers,
    currentFarmers,
    currentFactories,
    currentCompletedSales,

  ] = await Promise.all([

    User.count({
      where: {
        created_at: {
          [Op.gte]: current.start,
          [Op.lt]: current.end,
        },
      },
    }),

    Farmer.count({
      where: {
        created_at: {
          [Op.gte]: current.start,
          [Op.lt]: current.end,
        },
      },
    }),

    Factory.count({
      where: {
        created_at: {
          [Op.gte]: current.start,
          [Op.lt]: current.end,
        },
      },
    }),

    Sale.count({
      where: {
        status: 'completed',

        created_at: {
          [Op.gte]: current.start,
          [Op.lt]: current.end,
        },
      },
    }),

  ]);


  // ====================================================
  // PREVIOUS YEAR
  // ====================================================

  const [

    previousUsers,
    previousFarmers,
    previousFactories,
    previousCompletedSales,

  ] = await Promise.all([

    User.count({
      where: {
        created_at: {
          [Op.gte]: previous.start,
          [Op.lt]: previous.end,
        },
      },
    }),

    Farmer.count({
      where: {
        created_at: {
          [Op.gte]: previous.start,
          [Op.lt]: previous.end,
        },
      },
    }),

    Factory.count({
      where: {
        created_at: {
          [Op.gte]: previous.start,
          [Op.lt]: previous.end,
        },
      },
    }),

    Sale.count({
      where: {
        status: 'completed',

        created_at: {
          [Op.gte]: previous.start,
          [Op.lt]: previous.end,
        },
      },
    }),

  ]);


  return {

    total_users:
      totalUsers,

    total_farmers:
      totalFarmers,

    total_factories:
      totalFactories,


    pending_offers:
      pendingOffers,

    approved_offers:
      approvedOffers,

    rejected_offers:
      rejectedOffers,


    pending_requests:
      pendingRequests,

    approved_purchases:
      approvedPurchases,


    inventory_stock:
      Number(inventoryStock || 0),


    completed_sales:
      completedSales,


    scheduled_shipments:
      scheduledShipments,

    completed_shipments:
      completedShipments,


    total_users_trend_pct:
      calculateTrend(
        currentUsers,
        previousUsers
      ),

    total_farmers_trend_pct:
      calculateTrend(
        currentFarmers,
        previousFarmers
      ),

    total_factories_trend_pct:
      calculateTrend(
        currentFactories,
        previousFactories
      ),

    completed_sales_trend_pct:
      calculateTrend(
        currentCompletedSales,
        previousCompletedSales
      ),

  };

};


// ======================================================
// MONTHLY CHART
// ======================================================

const getMonthlyChart = async () => {

  const year =
    new Date().getFullYear();

  const { start, end } =
    getYearRange(year);


  const [

    offers,
    sales,

  ] = await Promise.all([

    Offer.findAll({

      attributes: [

        [
          fn(
            'MONTH',
            col('created_at')
          ),
          'month',
        ],

        [
          fn(
            'COUNT',
            col('id')
          ),
          'count',
        ],

      ],

      where: {

        created_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },

      },

      group: [
        fn(
          'MONTH',
          col('created_at')
        ),
      ],

      raw: true,

    }),


    Sale.findAll({

      attributes: [

        [
          fn(
            'MONTH',
            col('created_at')
          ),
          'month',
        ],

        [
          fn(
            'COUNT',
            col('id')
          ),
          'count',
        ],

      ],

      where: {

        created_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },

      },

      group: [
        fn(
          'MONTH',
          col('created_at')
        ),
      ],

      raw: true,

    }),

  ]);


  const offerMap = {};
  const saleMap = {};


  offers.forEach(item => {

    offerMap[
      Number(item.month)
    ] = Number(item.count);

  });


  sales.forEach(item => {

    saleMap[
      Number(item.month)
    ] = Number(item.count);

  });


  return {

    labels: MONTH_LABELS,

    offers: MONTH_LABELS.map(
      (_, index) =>
        offerMap[index + 1] || 0
    ),

    sales: MONTH_LABELS.map(
      (_, index) =>
        saleMap[index + 1] || 0
    ),

  };

};


// ======================================================
// SHIPMENT STATUS
// ======================================================

const getShipmentStatus = async () => {

  const rows =
    await Shipment.findAll({

      attributes: [

        'status',

        [
          fn(
            'COUNT',
            col('id')
          ),
          'count',
        ],

      ],

      group: [
        'status',
      ],

      raw: true,

    });


  const map = {};


  rows.forEach(row => {

    map[row.status] =
      Number(row.count);

  });


  return {

    scheduled:
      map.pending || 0,

    in_progress:
      map.in_transit || 0,

    completed:
      map.completed || 0,

    cancelled:
      map.cancelled || 0,

  };

};


// ======================================================
// INVENTORY DISTRIBUTION
// ======================================================

const getInventoryDistribution =
async () => {

  const rows =
    await Inventory.findAll({

      attributes: [

        'category_id',

        [
          fn(
            'SUM',
            col('remaining_quantity')
          ),
          'quantity',
        ],

      ],

      include: [

        {

          model: Category,

          as: 'category',

          attributes: [
            'id',
            'name',
          ],

          required: true,

        },

      ],

      group: [

        'category_id',

        'category.id',

        'category.name',

      ],

      order: [

        [
          literal('quantity'),
          'DESC',
        ],

      ],

    });


  return rows.map(row => ({

    category:
      row.category.name,

    quantity:
      Number(
        row.get('quantity') || 0
      ),

  }));

};


// ======================================================
// TOP WASTE TYPES
// ======================================================

const getTopWasteTypes =
async () => {

  const rows =
    await Offer.findAll({

      attributes: [

        'category_id',

        [
          fn(
            'COUNT',
            col('Offer.id')
          ),
          'count',
        ],

      ],

      include: [

        {

          model: Category,

          as: 'category',

          attributes: [
            'id',
            'name',
          ],

          required: true,

        },

      ],

      group: [

        'category_id',

        'category.id',

        'category.name',

      ],

      order: [

        [
          literal('count'),
          'DESC',
        ],

      ],

      limit: 5,

    });


  return rows.map(row => ({

    category:
      row.category.name,

    count:
      Number(
        row.get('count') || 0
      ),

  }));

};


// ======================================================
// TOP FACTORIES
// ======================================================

const getTopFactories = async () => {

  const rows = await SaleItem.findAll({

    attributes: [
      [
        fn(
          'SUM',
          col('SaleItem.quantity')
        ),
        'total_purchases',
      ],

      [
        col('sale.factory_id'),
        'factory_id',
      ],

      [
        col('sale->factory->user.name'),
        'factory_name',
      ],
    ],

    include: [

      {
        model: Sale,
        as: 'sale',

        attributes: [],

        required: true,

        include: [

          {
            model: Factory,
            as: 'factory',

            attributes: [],

            required: true,

            include: [

              {
                model: User,
                as: 'user',

                attributes: [],

                required: true,
              },

            ],

          },

        ],

      },

    ],

    group: [

      col('sale.factory_id'),

      col('sale->factory->user.name'),

    ],

    order: [

      [
        literal('total_purchases'),
        'DESC',
      ],

    ],

    limit: 5,

    raw: true,

  });


  return rows.map(row => ({

    name:
      row.factory_name ||
      'Unknown Factory',

    total_purchases:
      Number(
        row.total_purchases || 0
      ),

  }));

};


// ======================================================
// RECENT ACTIVITIES
// ======================================================

const getRecentActivities =
async () => {

  const [

    offers,
    shipments,

  ] = await Promise.all([


    // ------------------------------
    // OFFERS
    // ------------------------------

    Offer.findAll({

      attributes: [

        'id',

        'quantity',

        'created_at',

      ],

      include: [

        {

          model: Farmer,

          as: 'farmer',

          attributes: [
            'user_id',
          ],

          include: [

            {

              model: User,

              as: 'user',

              attributes: [
                'name',
              ],

            },

          ],

        },

        {

          model: Category,

          as: 'category',

          attributes: [
            'name',
          ],

        },

        {

          model: Unit,

          as: 'unit',

          attributes: [
            'name',
            'symbol',
          ],

        },

      ],

      order: [
        ['created_at', 'DESC'],
      ],

      limit: 5,

    }),


    // ------------------------------
    // SHIPMENTS
    // ------------------------------

    Shipment.findAll({

      attributes: [

        'id',

        'type',

        'driver_name',

        'status',

        'created_at',

      ],

      order: [
        ['created_at', 'DESC'],
      ],

      limit: 5,

    }),

  ]);


  const activities = [];


  offers.forEach(offer => {

    const farmerName =
      offer.farmer?.user?.name ||
      'Unknown Farmer';

    const category =
      offer.category?.name ||
      'waste';

    const quantity =
      offer.quantity;

    const unit =
      offer.unit?.symbol ||
      offer.unit?.name ||
      '';


    activities.push({

      type: 'offer',

      message:
        `Farmer ${farmerName} submitted a new offer for ${category} (${quantity} ${unit})`,

      created_at:
        offer.created_at,

    });

  });


  shipments.forEach(shipment => {

    activities.push({

      type: 'shipment',

      message:
        `Shipment ${shipment.type || ''} handled by ${shipment.driver_name || 'Unknown Driver'} is ${shipment.status}`,

      created_at:
        shipment.created_at,

    });

  });


  activities.sort(
    (a, b) =>
      new Date(b.created_at) -
      new Date(a.created_at)
  );


  return activities.slice(0, 10);

};


// ======================================================
// LATEST OFFERS
// ======================================================

const getLatestOffers =
async () => {

  const rows =
    await Offer.findAll({

      attributes: [

        'id',

        'quantity',

        'status',

        'created_at',

      ],

      include: [

        {

          model: Farmer,

          as: 'farmer',

          attributes: [
            'user_id',
          ],

          include: [

            {

              model: User,

              as: 'user',

              attributes: [
                'name',
              ],

            },

          ],

        },

        {

          model: Category,

          as: 'category',

          attributes: [
            'name',
          ],

        },

        {

          model: Unit,

          as: 'unit',

          attributes: [
            'name',
            'symbol',
          ],

        },

      ],

      order: [

        ['created_at', 'DESC'],

      ],

      limit: 10,

    });


  return rows.map(row => ({

    id:
      row.id,

    farmer_name:
      row.farmer?.user?.name ||
      'Unknown Farmer',

    waste_type:
      row.category?.name ||
      null,

    quantity:
      row.quantity,

    unit:
      row.unit?.symbol ||
      row.unit?.name ||
      null,

    status:
      row.status,

  }));

};


// ======================================================
// LATEST SHIPMENTS
// ======================================================

const getLatestShipments =
async () => {

  const rows =
    await Shipment.findAll({

      attributes: [

        'id',

        'type',

        'driver_name',

        'status',

        'created_at',

      ],

      order: [

        ['created_at', 'DESC'],

      ],

      limit: 10,

    });


  return rows.map(row => ({

    id:
      row.id,

    type:
      row.type,

    driver_name:
      row.driver_name,

    status:
      row.status,

  }));

};


// ======================================================
// MAIN DASHBOARD SERVICE
// ======================================================

exports.getDashboard =
async () => {

  const [

    stats,

    monthly_chart,

    shipment_status,

    inventory_distribution,

    top_waste_types,

    top_factories,

    recent_activities,

    latest_offers,

    latest_shipments,

  ] = await Promise.all([

    getStats(),

    getMonthlyChart(),

    getShipmentStatus(),

    getInventoryDistribution(),

    getTopWasteTypes(),

    getTopFactories(),

    getRecentActivities(),

    getLatestOffers(),

    getLatestShipments(),

  ]);


  return {

    stats,

    monthly_chart,

    shipment_status,

    inventory_distribution,

    top_waste_types,

    top_factories,

    recent_activities,

    latest_offers,

    latest_shipments,

  };

};