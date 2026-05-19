const {
  Sale,
  SaleItem,
  Inventory,
  sequelize
} = require('../models');

const {
  Sale,
  SaleItem,
  Inventory,
  FactoryRequest,
  sequelize
} = require('../models');

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
      throw new Error('Request not found');
    }

    if (request.status === 'cancelled') {
      throw new Error('Request cancelled');
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
        throw new Error('Inventory not found');
      }

      if (inventory.quantity < item.quantity) {
        throw new Error('Insufficient quantity');
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
    throw new Error('Invalid status');
  }

  const sale = await Sale.findByPk(saleId);

  if (!sale) {
    throw new Error('Sale not found');
  }

  if (sale.status === 'completed') {
    throw new Error('Completed sale cannot be modified');
  }

  sale.status = status;

  await sale.save();

  return sale;
};