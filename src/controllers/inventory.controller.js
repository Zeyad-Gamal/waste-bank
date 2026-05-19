const service =
  require('../services/inventory.service');

exports.getInventory =
  async (req, res) => {

    try {

      const result =
        await service.getInventory();

      res.status(200).json({
        success: true,
        data: result,
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message: error.message,
      });

    }

};

exports.getInventoryItem =
  async (req, res) => {

    try {

      const result =
        await service.getInventoryItem(
          req.params.id
        );

      res.status(200).json({
        success: true,
        data: result,
      });

    } catch (error) {

      res.status(404).json({
        success: false,
        message: error.message,
      });

    }

};

exports.updateInventory =
  async (req, res) => {

    try {

      const result =
        await service.updateInventory(

          req.params.id,

          req.body

        );

      res.status(200).json({
        success: true,
        message:
          'Inventory updated successfully',
        data: result,
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message: error.message,
      });

    }

};