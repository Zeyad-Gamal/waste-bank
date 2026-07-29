
const {
  Sale,
  SaleItem,
  Inventory,
  Factory,
  FactoryRequest,
  User,
  sequelize
} = require('../models');
const AppError = require( '../utils/app-error');

exports.createSale = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const request = await FactoryRequest.findByPk(
      data.request_id,
      {
        transaction
      }
    );

    if (!request) {
      throw new AppError('Request not found', 404);
    }

    if (request.status === 'cancelled') {
      throw new AppError('Request cancelled', 400);
    }

    const sale = await Sale.create(
      {
        factory_id: data.factory_id,
        request_id: data.request_id,
        status: 'pending'
      },
      {
        transaction
      }
    );

    for (const item of data.items) {
      const inventory = await Inventory.findByPk(
        item.inventory_id,
        {
          transaction
        }
      );

      if (!inventory) {
        throw new AppError('Inventory not found', 404);
      }

      if (inventory.quantity < item.quantity) {
        throw new AppError('Insufficient quantity', 400);
      }

      inventory.quantity -= item.quantity;

      await inventory.save({
        transaction
      });

      await SaleItem.create(
        {
          sale_id: sale.id,
          inventory_id: item.inventory_id,
          quantity: item.quantity
        },
        {
          transaction
        }
      );
    }

    request.status = 'fulfilled';

    await request.save({
      transaction
    });

    await transaction.commit();

    return sale;
  } catch (error) {
    await transaction.rollback();

    throw error;
  }
};

exports.getSales = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;




  return await Sale.findAndCountAll({

    include:[
      {
        model: Factory,
        as: 'factory',

        include: [
          {
            model: User,
          as: 'user'
          }
        ]
      },
      {
        model: SaleItem,
        as: 'items'
      }
    ],

    limit,
    offset,

    order: [
      [
        'created_at',
        'DESC'
      ]
    ]
  });
};

exports.getFactorySales = async (factoryId) => {
  return await Sale.findAll({
    where: {
      factory_id: factoryId
    },

    include: [
      {
        model: SaleItem,
        as: 'items',

        include: [
          {
            model: Inventory,
            as: 'inventory'
          }
        ]
      }
    ]
  });
};

exports.updateStatus = async (saleId, status) => {
  const allowed = [
    'pending',
    'approved',
    'completed',
    'cancelled'
  ];

  if (!allowed.includes(status)) {
    throw new AppError('Invalid status', 400);
  }

  const sale = await Sale.findByPk(saleId);

  if (!sale) {
    throw new AppError('Sale not found', 404);
  }

  if (sale.status === 'completed') {
    throw new AppError('Completed sale cannot be modified', 400);
  }

  sale.status = status;

  await sale.save();

  return sale;
};