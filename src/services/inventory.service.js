const {
  Inventory,
  Unit,
  Category
} = require('../models');
const AppError = require( '../utils/app-error');

const ERROR_MESSAGES = require('../constants/error-messages');

const SUCCESS_MESSAGES = require('../constants/success-messages');


// exports.getInventory = async () => {

//     const inventory =
//       await Inventory.findAll({

//         order: [
//           ['created_at', 'DESC']
//         ],

//       });

//     return inventory;

// };


exports.getInventory = async () => {
  const inventory = await Inventory.findAll({
    include: [
      {
        model: Unit,
        as: "unit",
      },
      {
        model: Category,
        as: "category",
        attributes: ["id", "name"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  const data = inventory.map((item) => ({
    id: item.id,
    purchase_id: item.purchase_id,
    category: item.category.name,
    total_quantity: item.total_quantity,
    remaining_quantity: item.remaining_quantity,
    quantity_unit: item.unit.name,
    status: item.status,
    created_at: item.created_at,
    updated_at: item.updated_at,
  }));

  // عدد الـ Categories المختلفة
  const total_types = new Set(
    inventory.map((item) => item.category.id)
  ).size;

  return {
    total_types,
    data,
  };
};

exports.getInventoryItem = async (inventoryId) => {

    const item =
      await Inventory.findByPk( inventoryId,{
        include:[
          {
            model: Category,
            as: 'category',

            include:[
              {
                model: Unit,
                as: 'unit'
              }
            ]
          },
        ]
      });

    if (!item) {

      throw new AppError(
        ERROR_MESSAGES.INVENTORY_NOT_FOUND,
        404
      );

    }

    return item;

};

exports.updateInventory = async (
    inventoryId,
    data
  ) => {

    const item =
      await Inventory.findByPk(
        inventoryId
      );

    if (!item) {

      throw new AppError(
        ERROR_MESSAGES.INVENTORY_NOT_FOUND,
        404
      );

    }

    await item.update(data);

    return item;

};