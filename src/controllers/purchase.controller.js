const service =
  require('../services/purchase.service');

exports.createPurchase =
  async (req, res) => {

    try {

      const result =
        await service.createPurchase(
          req.body
        );

      res.status(201).json({
        success: true,
        message:
          'Purchase created successfully',
        data: result,
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message: error.message,
      });

    }

};

exports.getAllPurchases =
  async (req, res) => {

    try {

      const result =
        await service.getAllPurchases();

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

exports.getMyPurchases =
  async (req, res) => {

    try {

      const result =
        await service.getMyPurchases(
          req.user.id
        );

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

exports.updatePurchaseStatus =
  async (req, res) => {

    try {

      const result =
        await service.updatePurchaseStatus(

          req.params.id,

          req.body.status

        );

      res.status(200).json({
        success: true,
        message:
          'Purchase status updated successfully',
        data: result,
      });

    } catch (error) {

      res.status(400).json({
        success: false,
        message: error.message,
      });

    }

};