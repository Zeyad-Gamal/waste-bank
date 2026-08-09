'use strict';

const {
  Op,
  fn,
  col,
  literal,
} = require('sequelize');

const {
  Sale,
  SaleItem,
  Purchase,
  Offer,
  Shipment,
  ProcessRating,
  Factory,
  Category,
} = require('../models');

const AppError = require('../utils/app-error');


// ======================================================
// Helpers
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


const getDateRange = (year, month) => {

  year = Number(year);

  if (!year || year < 2000) {
    throw new AppError(
      'Invalid year',
      400
    );
  }

  // Full year
  if (!month) {

    return {
      start: new Date(year, 0, 1),
      end: new Date(year + 1, 0, 1),
    };

  }

  month = Number(month);

  if (month < 1 || month > 12) {
    throw new AppError(
      'Invalid month',
      400
    );
  }

  return {
    start: new Date(year, month - 1, 1),
    end: new Date(year, month, 1),
  };

};


const getPreviousPeriod = (year, month) => {

  year = Number(year);

  if (!month) {

    return {
      start: new Date(year - 1, 0, 1),
      end: new Date(year, 0, 1),
    };

  }

  month = Number(month);

  return {
    start: new Date(year, month - 2, 1),
    end: new Date(year, month - 1, 1),
  };

};


const calculateChange = (
  current,
  previous
) => {

  if (!previous) {

    return current > 0
      ? 100
      : 0;

  }

  return Number(
    (
      ((current - previous) / previous) *
      100
    ).toFixed(1)
  );

};


// ======================================================
// TOTAL REVENUE
// ======================================================

const getRevenue = async (start, end) => {

  const result = await SaleItem.findOne({

    attributes: [

      [
        fn(
          'SUM',
          literal('quantity * price')
        ),
        'total',
      ],

    ],

    include: [
      {
        model: Sale,
        as: 'sale',
        required: true,

        attributes: [],

        where: {
          created_at: {
            [Op.gte]: start,
            [Op.lt]: end,
          },
        },
      },
    ],

    raw: true,

  });

  return Number(
    result?.total || 0
  );

};


// ======================================================
// SALES COUNT
// ======================================================

const getSalesCount = async (
  start,
  end
) => {

  return await Sale.count({

    where: {
      created_at: {
        [Op.gte]: start,
        [Op.lt]: end,
      },
    },

  });

};


// ======================================================
// AVERAGE SALE VALUE
// ======================================================

const getAverageSaleValue = async (
  start,
  end
) => {

  const revenue =
    await getRevenue(start, end);

  const sales =
    await getSalesCount(start, end);

  if (!sales) {
    return 0;
  }

  return Number(
    (revenue / sales).toFixed(2)
  );

};


// ======================================================
// OFFER ACCEPTANCE RATE
// ======================================================

const getOfferAcceptanceRate = async (
  start,
  end
) => {

  const total =
    await Offer.count({

      where: {
        created_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },
      },

    });

  if (!total) {
    return 0;
  }

  const accepted =
    await Offer.count({

      where: {

        created_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },

        status: {
          [Op.in]: [
            'partially_purchased',
            'fully_purchased',
          ],
        },

      },

    });

  return Number(
    ((accepted / total) * 100).toFixed(1)
  );

};


// ======================================================
// SHIPMENT ON-TIME RATE
// ======================================================

const getShipmentOnTimeRate = async (
  start,
  end
) => {

  const completed =
    await Shipment.findAll({

      attributes: [
        'scheduled_date',
        'completed_date',
      ],

      where: {

        created_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },

        status: 'completed',

        scheduled_date: {
          [Op.ne]: null,
        },

        completed_date: {
          [Op.ne]: null,
        },

      },

      raw: true,

    });

  if (!completed.length) {
    return 0;
  }

  const onTime =
    completed.filter(
      shipment =>
        new Date(
          shipment.completed_date
        ) <=
        new Date(
          shipment.scheduled_date
        )
    ).length;

  return Number(
    ((onTime / completed.length) * 100)
      .toFixed(1)
  );

};


// ======================================================
// AVERAGE RATING
// ======================================================

const getAverageRating = async (
  start,
  end
) => {

  const result =
    await ProcessRating.findOne({

      attributes: [

        [
          fn(
            'AVG',
            col('rating')
          ),
          'average',
        ],

      ],

      where: {

        created_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },

      },

      raw: true,

    });

  return Number(
    Number(
      result?.average || 0
    ).toFixed(2)
  );

};


// ======================================================
// KPIs
// ======================================================

const getKpis = async (
  current,
  previous
) => {

  const currentRevenue =
    await getRevenue(
      current.start,
      current.end
    );

  const previousRevenue =
    await getRevenue(
      previous.start,
      previous.end
    );


  const currentAvgSale =
    await getAverageSaleValue(
      current.start,
      current.end
    );

  const previousAvgSale =
    await getAverageSaleValue(
      previous.start,
      previous.end
    );


  const currentAcceptance =
    await getOfferAcceptanceRate(
      current.start,
      current.end
    );

  const previousAcceptance =
    await getOfferAcceptanceRate(
      previous.start,
      previous.end
    );


  const currentOnTime =
    await getShipmentOnTimeRate(
      current.start,
      current.end
    );

  const previousOnTime =
    await getShipmentOnTimeRate(
      previous.start,
      previous.end
    );


  const currentRating =
    await getAverageRating(
      current.start,
      current.end
    );

  const previousRating =
    await getAverageRating(
      previous.start,
      previous.end
    );


  return {

    total_revenue:
      currentRevenue,

    total_revenue_change_pct:
      calculateChange(
        currentRevenue,
        previousRevenue
      ),


    avg_sale_value:
      currentAvgSale,

    avg_sale_value_change_pct:
      calculateChange(
        currentAvgSale,
        previousAvgSale
      ),


    offer_acceptance_rate:
      currentAcceptance,

    offer_acceptance_change_pct:
      calculateChange(
        currentAcceptance,
        previousAcceptance
      ),


    shipment_on_time_rate:
      currentOnTime,

    shipment_on_time_change_pct:
      calculateChange(
        currentOnTime,
        previousOnTime
      ),


    avg_rating:
      currentRating,

    avg_rating_change_pct:
      calculateChange(
        currentRating,
        previousRating
      ),

  };

};


// ======================================================
// SALES VS PURCHASES
// ======================================================

const getSalesVsPurchases = async (
  year
) => {

  const sales = await Sale.findAll({

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
        [Op.gte]:
          new Date(year, 0, 1),

        [Op.lt]:
          new Date(year + 1, 0, 1),
      },

    },

    group: [
      fn(
        'MONTH',
        col('created_at')
      ),
    ],

    raw: true,

  });


  const purchases =
    await Purchase.findAll({

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
          [Op.gte]:
            new Date(year, 0, 1),

          [Op.lt]:
            new Date(year + 1, 0, 1),
        },

      },

      group: [
        fn(
          'MONTH',
          col('created_at')
        ),
      ],

      raw: true,

    });


  const salesMap = {};

  sales.forEach(item => {
    salesMap[item.month] =
      Number(item.count);
  });


  const purchasesMap = {};

  purchases.forEach(item => {
    purchasesMap[item.month] =
      Number(item.count);
  });


  return {

    labels: MONTH_LABELS,

    sales: MONTH_LABELS.map(
      (_, index) =>
        salesMap[index + 1] || 0
    ),

    purchases: MONTH_LABELS.map(
      (_, index) =>
        purchasesMap[index + 1] || 0
    ),

  };

};


// ======================================================
// MONTHLY OFFERS
// ======================================================

const getMonthlyOffers = async (
  year
) => {

  const offers =
    await Offer.findAll({

      attributes: [

        [
          fn(
            'MONTH',
            col('created_at')
          ),
          'month',
        ],

        'status',

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
          [Op.gte]:
            new Date(year, 0, 1),

          [Op.lt]:
            new Date(year + 1, 0, 1),
        },

      },

      group: [

        fn(
          'MONTH',
          col('created_at')
        ),

        'status',

      ],

      raw: true,

    });


  const submitted =
    Array(12).fill(0);

  const approved =
    Array(12).fill(0);


  offers.forEach(item => {

    const index =
      Number(item.month) - 1;

    submitted[index] +=
      Number(item.count);


    if (
      item.status ===
        'partially_purchased' ||
      item.status ===
        'fully_purchased'
    ) {

      approved[index] +=
        Number(item.count);

    }

  });


  return {

    labels: MONTH_LABELS,

    submitted,

    approved,

  };

};


// ======================================================
// SHIPMENT PERFORMANCE
// ======================================================

const getShipmentPerformance = async (
  start,
  end
) => {

  const shipments =
    await Shipment.findAll({

      attributes: [
        'status',
        'scheduled_date',
        'completed_date',
      ],

      where: {

        created_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },

      },

      raw: true,

    });


  let on_time = 0;
  let delayed = 0;
  let cancelled = 0;


  shipments.forEach(shipment => {

    if (shipment.status === 'completed') {

      if (
        shipment.scheduled_date &&
        shipment.completed_date &&
        new Date(
          shipment.completed_date
        ) <=
        new Date(
          shipment.scheduled_date
        )
      ) {

        on_time++;

      } else {

        delayed++;

      }

    }

    // Shipment model currently
    // has no cancelled status.

  });


  return {

    on_time,

    delayed,

    cancelled,

  };

};


// ======================================================
// WASTE CATEGORIES
// ======================================================

const getWasteCategories = async (
  start,
  end
) => {

  const result =
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

      where: {

        created_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },

      },

      include: [

        {
          model: Category,
          as: 'category',

          attributes: [
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


  return result.map(item => ({

    category:
      item.category.name,

    count:
      Number(
        item.get('count')
      ),

  }));

};


// ======================================================
// AVERAGE PRICES
// ======================================================

const getAveragePrices = async (
  start,
  end
) => {

  const result =
    await Purchase.findAll({

      attributes: [

        [
          fn('AVG', col('Purchase.price')),
          'avg_price',
        ],

      ],

      where: {

        created_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },

      },

      include: [

        {

          model: Offer,

          as: 'offer',

          attributes: [
            'category_id',
          ],

          include: [

            {

              model: Category,

              as: 'category',

              attributes: [
                'name',
              ],

            },

          ],

        },

      ],

      group: [

        'offer.category_id',
        'offer->category.id',
        'offer->category.name',

      ],

      raw: true,

    });


  return result.map(item => ({

    category:
      item['offer.category.name'],

    avg_price:
      Number(
        Number(
          item.avg_price
        ).toFixed(2)
      ),

  }));

};


// ======================================================
// TOP FACTORIES
// ======================================================

const getTopFactories = async (
  start,
  end
) => {

  const result =
    await Sale.findAll({

      attributes: [

        'factory_id',

        [
          fn(
            'COUNT',
            col('Sale.id')
          ),
          'total_sales',
        ],

      ],

      where: {

        created_at: {
          [Op.gte]: start,
          [Op.lt]: end,
        },

      },

      include: [

        {

          model: Factory,

          as: 'factory',

          attributes: [

            'factory_owner_name',

          ],

        },

      ],

      group: [

        'factory_id',

        'factory.id',

        'factory.factory_owner_name',

      ],

      order: [

        [
          literal('total_sales'),
          'DESC',
        ],

      ],

      limit: 5,

    });


  return result.map(item => ({

    name:
      item.factory.factory_owner_name,

    total_sales:
      Number(
        item.get('total_sales')
      ),

  }));

};


// ======================================================
// MAIN ANALYSIS
// ======================================================

exports.getAnalysis = async ({
  year,
  month,
}) => {

  year =
    Number(year) ||
    new Date().getFullYear();

  const current =
    getDateRange(
      year,
      month
    );

  const previous =
    getPreviousPeriod(
      year,
      month
    );


  const [

    kpis,

    sales_vs_purchases,

    monthly_offers,

    shipment_performance,

    waste_categories,

    avg_prices,

    top_factories,

  ] = await Promise.all([

    getKpis(
      current,
      previous
    ),

    getSalesVsPurchases(
      year
    ),

    getMonthlyOffers(
      year
    ),

    getShipmentPerformance(
      current.start,
      current.end
    ),

    getWasteCategories(
      current.start,
      current.end
    ),

    getAveragePrices(
      current.start,
      current.end
    ),

    getTopFactories(
      current.start,
      current.end
    ),

  ]);


  return {

    kpis,

    sales_vs_purchases,

    monthly_offers,

    shipment_performance,

    waste_categories,

    avg_prices,

    top_factories,

  };

};