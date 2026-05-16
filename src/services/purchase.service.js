const {
  Purchase,
  Offer,
  Inventory,
  sequelize,
} = require('../models');

exports.createPurchase =
  async (data) => {

    const transaction =
      await sequelize.transaction();

    try {

      const offer =
        await Offer.findByPk(
          data.offer_id
        );

      if (!offer) {

        throw new Error(
          'Offer not found'
        );

      }

      if (offer.status !== 'approved') {

        throw new Error(
          'Only approved offers can be purchased'
        );

      }

      const purchase =
        await Purchase.create({

          offer_id: data.offer_id,

          quantity: data.quantity,

          price:
            data.price,

          status: 'pending',

        }, { transaction });

      let inventory =
        await Inventory.findOne({

          where: {
            category:
              offer.item_type,
          },

          transaction,

        });

      if (inventory) {

        inventory.quantity +=
          data.quantity;

        await inventory.save({
          transaction,
        });

      } else {

        inventory =
          await Inventory.create({

            category:
              offer.item_type,

            quantity:
              data.quantity,

            quantity_gauge:
              offer.quantity_gauge,

          }, { transaction });

      }

      offer.status = 'purchased';

      await offer.save({
        transaction,
      });

      await transaction.commit();

      return purchase;

    } catch (error) {

      await transaction.rollback();

      throw error;

    }

};

exports.getAllPurchases =
  async () => {

    const purchases =
      await Purchase.findAll({

        include: [
          {
            model: Offer,
            as: 'offer',
          },
        ],

        order: [
          ['created_at', 'DESC']
        ],

      });

    return purchases;

};

exports.getMyPurchases =
  async (farmerId) => {

    const purchases =
      await Purchase.findAll({

        include: [
          {
            model: Offer,
            as: 'offer',

            where: {
              farmer_id: farmerId,
            },
          },
        ],

        order: [
          ['created_at', 'DESC']
        ],

      });

    return purchases;

};

exports.updatePurchaseStatus =
  async (
    purchaseId,
    status
  ) => {

    const purchase =
      await Purchase.findByPk(
        purchaseId
      );

    if (!purchase) {

      throw new Error(
        'Purchase not found'
      );

    }

    purchase.status = status;

    await purchase.save();

    return purchase;

};