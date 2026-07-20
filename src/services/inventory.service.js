const {
  Inventory,
} = require('../models');
const AppError = require( '../utils/app-error');

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
    order: [['created_at', 'DESC']],
  });

  return inventory.map(item => ({
    id: item.id,
    purchase_id: item.purchase_id,
    category: item.category,

    total_quantity: item.quantity,
    remaining_quantity: item.remaining_quantity,

    quantity_gauge: item.quantity_gauge,
    status: item.status,

    created_at: item.created_at,
    updated_at: item.updated_at,
  }));
};

exports.getInventoryItem = async (inventoryId) => {

    const item =
      await Inventory.findByPk(
        inventoryId
      );

    if (!item) {

      throw new AppError(
        'Inventory item not found',
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
        'Inventory item not found',
        404
      );

    }

    await item.update(data);

    return item;

};