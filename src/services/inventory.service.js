const {
  Inventory,
} = require('../models');

exports.getInventory =
  async () => {

    const inventory =
      await Inventory.findAll({

        order: [
          ['created_at', 'DESC']
        ],

      });

    return inventory;

};

exports.getInventoryItem =
  async (inventoryId) => {

    const item =
      await Inventory.findByPk(
        inventoryId
      );

    if (!item) {

      throw new Error(
        'Inventory item not found'
      );

    }

    return item;

};

exports.updateInventory =
  async (
    inventoryId,
    data
  ) => {

    const item =
      await Inventory.findByPk(
        inventoryId
      );

    if (!item) {

      throw new Error(
        'Inventory item not found'
      );

    }

    await item.update(data);

    return item;

};