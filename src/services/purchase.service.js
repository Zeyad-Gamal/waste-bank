const {
  Purchase,
  Offer,
  User,
  Farmer,
  Inventory,
  sequelize,
} = require('../models');
const { Op, Sequelize } = require('sequelize');

const AppError = require( '../utils/app-error');

// exports.createPurchase = async (data) => {

//     const transaction =
//       await sequelize.transaction();

//     try {

//       const offer =
//         await Offer.findByPk(
//           data.offer_id
//         );

//       if (!offer) {

//         throw new AppError(
//           'Offer not found',
//           404
//         );

//       }

//       if (offer.status !== 'approved') {

//         throw new AppError(
//           'Only approved offers can be purchased',
//           400
//         );

//       }

//       const purchase =
//         await Purchase.create({

//           offer_id: data.offer_id,

//           quantity: data.quantity,

//           quantity_gauge: data.quantity_gauge,


//           price:
//             data.price,

//           status: 'pending',

//         }, { transaction });

//       let inventory =
//         await Inventory.findOne({

//           where: {
//             category:
//               offer.item_type,
//           },

//           transaction,

//         });

//       if (inventory) {

//         inventory.quantity +=
//           data.quantity;

//         await inventory.save({
//           transaction,
//         });

//       } else {

//         inventory =
//           await Inventory.create({

//             purchase_id: purchase.id,

//             category:
//               offer.item_type,

//             remaining_quantity:
//               data.quantity,

//             quantity_gauge:
//               offer.quantity_gauge,

              

//           }, { transaction });

//       }

//       // offer.status = 'purchased';

//       await offer.save({
//         transaction,
//       });

//       await transaction.commit();

//       return purchase;

//     } catch (error) {

//       await transaction.rollback();

//       throw error;

//     }

// };



exports.createPurchase = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    // Get Offer
    const offer = await Offer.findByPk(data.offer_id);

    if (!offer) {
      throw new AppError("Offer not found", 404);
    }

    if (offer.status !== "approved") {
      throw new AppError(
        "Only approved offers can be purchased",
        400
      );
    }

    // Create Purchase
    const purchase = await Purchase.create(
      {
        offer_id: data.offer_id,
        quantity: data.quantity,
        quantity_gauge: offer.quantity_gauge,
        price: data.price,
        status: "pending",
      },
      { transaction }
    );

    // Find Inventory by Category
    let inventory = await Inventory.findOne({
      where: {
        category: offer.item_type,
      },
      transaction,
    });

    if (inventory) {
      // Update current stock
      inventory.total_quantity += data.quantity;
      inventory.remaining_quantity += data.quantity;

      await inventory.save({ transaction });
    } else {
      // Create inventory for new category
      inventory = await Inventory.create(
        {
          category: offer.item_type,
          total_quantity: data.quantity,
          remaining_quantity: data.quantity,
          quantity_gauge: offer.quantity_gauge,
          status: "available",
        },
        { transaction }
      );
    }

    // Optional: Mark offer as purchased
    // offer.status = "purchased";
    await offer.save({ transaction });

    await transaction.commit();

    return purchase;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getAllPurchases = async (

  page,
  limit,
  search,
  status

) => {


    const offset = (page - 1) * limit;

  const purchaseWhere = {};



  if (search) {
  purchaseWhere[Op.or] = [
    sequelize.where(sequelize.cast(sequelize.col('Purchase.price'), 'char'), { [Op.like]: `%${search}%` }),
    { id: { [Op.like]: `%${search}%` } },
    sequelize.where(sequelize.cast(sequelize.col('Purchase.quantity'), 'char'), { [Op.like]: `%${search}%` }),
    { status: { [Op.like]: `%${search}%` } },
    { quantity_gauge: { [Op.like]: `%${search}%` } },
    { created_at: { [Op.like]: `%${search}%` } },
    { '$offer.farmer.user.name$': { [Op.like]: `%${search}%` } },
    { '$offer.id$': { [Op.like]: `%${search}%` } },
    { '$offer.item_type$': { [Op.like]: `%${search}%` } }
  ];
}


  if (status) {
    purchaseWhere['status'] = status;
  }
    const {rows , count} =
      await Purchase.findAndCountAll({

        where: purchaseWhere,

        include: [
          {
            model: Offer,
            as: 'offer',

            include: [{
       model: Farmer, as: 'farmer',
       include: [{ model: User, as: 'user' }]
     }]
          }],

        order: [
          ['created_at', 'DESC']
        ],

         limit,
    offset,
    distinct: true,

      });

      return {
    total: count,
    current_page: page,
    total_pages: Math.ceil(count / limit),
    purchases: rows,
  };


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

exports.updatePurchaseStatus = async (
    purchaseId,
    status
  ) => {

    const purchase =
      await Purchase.findByPk(
        purchaseId
      );

    if (!purchase) {

      throw new AppError(
        'Purchase not found',
        404
      );

    }

    purchase.status = status;

    await purchase.save();

    return purchase;

};









exports.approvePurchase = async (
    purchaseId
  ) => {

    const purchase =
      await Purchase.findByPk(
        purchaseId
      );

    if (!purchase) {

      throw new AppError(
        'Purchase not found',
        404
      );

    }

    purchase.status = "approved";

    await purchase.save();

    return purchase;

};


exports.rejectPurchase = async (
    purchaseId
  ) => {

    const purchase =
      await Purchase.findByPk(
        purchaseId
      );

    if (!purchase) {

      throw new AppError(
        'Purchase not found',
        404
      );

    }

    purchase.status = "rejected";

    await purchase.save();

    return purchase;

};






exports.completePurchase = async (
    purchaseId
  ) => {

    const purchase =
      await Purchase.findByPk(
        purchaseId
      );

    if (!purchase) {

      throw new AppError(
        'Purchase not found',
        404
      );

    }

    purchase.status = "completed";

    await purchase.save();

    return purchase;

};