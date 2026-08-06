const { where , Op, Sequelize  } = require('sequelize');

const {
  Sale,
  SaleItem,
  Inventory,
  Factory,
  FactoryRequest,
  Category,
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
          transaction,
          lock: transaction.LOCK.UPDATE
        }
      );

      if (!inventory) {
        throw new AppError('Inventory not found', 404);
      }

      if (inventory.remaining_quantity < item.quantity) {
        throw new AppError('Insufficient quantity', 400);
      }

      inventory.remaining_quantity -= item.quantity;

      await inventory.save({
        transaction
      });

      await SaleItem.create(
        {
          sale_id: sale.id,
          inventory_id: item.inventory_id,
          quantity: item.quantity,
          price:item.price
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

exports.getSales = async (
  page,
  limit,
  search,
) => {
 

  
  const offset = (page - 1) * limit;

  const where = {};
  
  
if (search) {
  where[Op.or] = [
    {
      id: {
        [Op.like]: `%${search}%`,
      },
    },
    {
      '$factory.user.name$': {
        [Op.like]: `%${search}%`,
      },
    },
    Sequelize.where(
      Sequelize.fn(
        'DATE_FORMAT',
        Sequelize.col('Sale.created_at'),
        '%Y-%m-%d'
      ),
      {
        [Op.like]: `%${search}%`,
      }
    ),
  ];
}


  return await Sale.findAndCountAll({
  attributes: {
    include: [
      [
        Sequelize.literal(`
          (
            SELECT COALESCE(SUM(price * quantity), 0)
            FROM sale_items
            WHERE sale_items.sale_id = Sale.id
          )
        `),
        "totalPrice",
      ],
    ],
  },

  where,
  subQuery: false,
  distinct: true,

  include: [
    {
      model: Factory,
      as: "factory",
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["password", "created_at", "updated_at", "id"],
          },
          required: true,
        },
      ],
    },
    {
      model: SaleItem,
      as: "items",
    },
  ],

  limit,
  offset,

  order: [["created_at", "DESC"]],
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


exports.updateSale = async (id, data) => {

  
  const { factory_id, request_id, items } = data;

  const transaction = await sequelize.transaction();

  try {
    const sale = await Sale.findByPk(id, {
      transaction
    });

    if (!sale) {
      throw new AppError('Sale not found', 404);
    }

    // تحديث بيانات البيع
    await sale.update(
      {
        factory_id: factory_id ?? sale.factory_id,
        request_id: request_id ?? sale.request_id
      },
      {
        transaction
      }
    );

    if (Array.isArray(items)) {
      // استرجاع العناصر القديمة
      const oldItems = await SaleItem.findAll({
        where: {
          sale_id: id
        },
        transaction
      });

      // إعادة الكميات للمخزن
      for (const oldItem of oldItems) {
        const inventory = await Inventory.findByPk(
          oldItem.inventory_id,
          {
            transaction,
            lock: transaction.LOCK.UPDATE
          }
        );

        if (!inventory) {
          throw new AppError('Inventory not found', 404);
        }

        inventory.remaining_quantity += oldItem.quantity;

        await inventory.save({
          transaction
        });
      }

      // حذف العناصر القديمة
      await SaleItem.destroy({
        where: {
          sale_id: id
        },
        transaction
      });

      // إضافة العناصر الجديدة وخصم الكميات
      for (const item of items) {

        const inventory = await Inventory.findByPk(
          item.inventory_id,
          {
            transaction,
            lock: transaction.LOCK.UPDATE
          }
        );

        if (!inventory) {
          throw new AppError('Inventory not found', 404);
        }

        if (inventory.remaining_quantity < item.quantity) {
          throw new AppError('Insufficient quantity', 400);
        }

                

        inventory.remaining_quantity -= item.quantity;

        await inventory.save({
          transaction
        });

        await SaleItem.create(
          {
            sale_id: id,
            inventory_id: item.inventory_id,
            quantity: item.quantity,
            price: item.price
          },
          {
            transaction
          }
        );
      }
    }

    await transaction.commit();

    return await Sale.findByPk(id, {
      include: [
        {
          model: Factory,
          as: 'factory'
        },
        {
          model: SaleItem,
          as: 'items'
        }
      ]
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};




exports.getSaleItems = async () => {

  
    return await SaleItem.findAndCountAll({

  subQuery: false,
  distinct: true,

  include: [
    {
      model: Inventory,
      as: "inventory",
      

      attributes: [
        'id'
      ],

      include: [
        {
          model: Category,
          as: 'category',

          attributes: [
        'name',
        'description'
      ],
        }
      ]
      
    },

    {
      model: Sale,
      as: "sale",

      attributes: [
        'id',
        'status'
      ],


      include: [
        {
          model: Factory,
          as: 'factory',

          attributes: [
            'id'
          ],

          include: [
        {
          model: User,
          as: 'user',

          attributes:[
            'name'
          ]
        }
      ]
        }
      ]
    }
    
  ],

  attributes: [
        'quantity',
        'price'
      ],


  order: [["created_at", "DESC"]],
});



};