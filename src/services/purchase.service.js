const {
  Purchase,
  Offer,
  User,
  Farmer,
  Inventory,
  Unit,
  Category,
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


    // const category = await Category.findByPk(data.category_id);

    // Create Purchase
    const purchase = await Purchase.create(
      {
        unit_id: offer.unit_id,
        offer_id: data.offer_id,
        quantity: data.quantity,
        price: data.price,
        status: "pending",
      },
      { transaction }
    );

    // Find Inventory by Category
    // let inventory = await Inventory.findOne({
    //   where: {
    //     category_id: offer.category_id,
    //   },
    //   transaction,
    // });

    // if (inventory) {
    //   // Update current stock
    //   inventory.total_quantity += data.quantity;
    //   inventory.remaining_quantity += data.quantity;

    //   await inventory.save({ transaction });
    // } else {
    //   // Create inventory for new category
    //   inventory = await Inventory.create(
    //     {
    //       purchase_id: purchase.id,
    //       category_id: offer.category_id,
    //       unit_id: offer.unit_id,
    //       total_quantity: data.quantity,
    //       remaining_quantity: data.quantity,
    //       status: "available",
    //     },
    //     { transaction }
    //   );
    // }

    // Optional: Mark offer as purchased
    // offer.status = "purchased";
    // await offer.save({ transaction });

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
    
    { created_at: { [Op.like]: `%${search}%` } },
    { '$offer.farmer.user.name$': { [Op.like]: `%${search}%` } },
    { '$offer.id$': { [Op.like]: `%${search}%` } },
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

            include: [
              
              {
       model: Farmer, as: 'farmer',
       include: [
        
        { model: User, 
          as: 'user' 
        }
        
        ]
     },
    
     {
      model: Category,
      as: 'category'
     }
    
    ]
          },


          {
            model: Unit,
            as: 'unit',
          }
        
        
        ],

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

exports.getMyPurchases = async (farmerId) => {

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

          {
            model: Unit,
            as: 'unit'
          }
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






exports.completePurchase = async (purchaseId) => {
  const transaction = await sequelize.transaction();

  try {
    const purchase = await Purchase.findByPk(purchaseId, {
      transaction,
    });

    if (!purchase) {
      throw new AppError("Purchase not found", 404);
    }

    const offer = await Offer.findByPk(purchase.offer_id, {
      transaction,
    });

    if (!offer) {
      throw new AppError("Offer not found", 404);
    }

    let inventory = await Inventory.findOne({
      where: {
        category_id: offer.category_id,
      },
      transaction,
    });

    if (inventory) {
      inventory.total_quantity += purchase.quantity;
      inventory.remaining_quantity += purchase.quantity;

      await inventory.save({ transaction });
    } else {
      inventory = await Inventory.create(
        {
          purchase_id: purchase.id,
          category_id: offer.category_id,
          unit_id: purchase.unit_id,
          total_quantity: purchase.quantity,
          remaining_quantity: purchase.quantity,
          status: "available",
        },
        { transaction }
      );
    }

    purchase.status = "completed";
    await purchase.save({ transaction });

    await transaction.commit();

    return purchase;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};