const { Op, Sequelize } = require('sequelize');
const { Offer, OfferImage, User, Farmer, Unit, Category, sequelize } = require('../models');
const AppError = require( '../utils/app-error');

exports.createOffer = async (data) => {

  const transaction = await sequelize.transaction();

  try {

    // const category_id =  

    const category_data = await Category.findByPk(data.category_id);


    const offer = await Offer.create({

      farmer_id: data.farmer_id,

      category_id: data.category_id,

      unit_id: category_data.default_unit_id,

      type: data.type,

      quantity: data.quantity,


      cultivated_area: data.cultivated_area,


      harvest_date: data.harvest_date,

      price: data.price,

      collection_location: data.collection_location,

      description: data.description,

      status: 'pending',

    }, { transaction });

    if (data.images && data.images.length > 0) {

      const imagesData = data.images.map(imagePath => ({

        offer_id: offer.id,

        image_url: imagePath,

      }));

      await OfferImage.bulkCreate(
        imagesData,
        { transaction }
      );

    }

    await transaction.commit();

    return offer;

  } catch (error) {

    await transaction.rollback();

    throw error;

  }

};

exports.updateOffer = async (
  offerId,
  farmerId,
  data
) => {

  const offer = await Offer.findOne({

    where: {
      id: offerId,
      farmer_id: farmerId,
    },

  });

  if (!offer) {
    throw new AppError('Offer not found', 404);
  }

  if (offer.status !== 'pending') {

    throw new AppError(
      'Only pending offers can be updated',
      400
    );

  }
  
  await offer.update(data);

  return offer;

};

exports.getMyOffers = async (farmerId) => {

  const offers = await Offer.findAll({

    where: {
      farmer_id: farmerId,
    },

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
      }

    ],

    order: [
      ['created_at', 'DESC']
    ],

  });

  return offers;

};


exports.deleteOffer = async (
  offerId,
  farmerId
) => {

   const offer = await Offer.findOne({

    where: {
      id: offerId,
      farmer_id: farmerId,
    },

  });

  if (!offer) {
    throw new AppError('Offer not found', 404);
  }

  if (offer.status !== 'pending') {

    throw new AppError(
      'Only pending offers can be deleted',
      400
    );

  }

  await offer.destroy();

};


exports.getOfferById = async (offerId) => {

  const offer = await Offer.findByPk(offerId, {

    include: [
      {
        model: OfferImage,
        as: 'images',
      },


      {
        model: Category,
        as: 'category',

        include:[
          {
            model: Unit,
            as: 'unit'
          }
        ]
      }
    ],

  });

  if (!offer) {
    throw new AppError('Offer not found', 404);
  }

  return offer;

};



exports.getApprovedOffers = async (
  page,
  limit
) => {

  const offset = (page - 1) * limit;

  const { count, rows } =
    await Offer.findAndCountAll({

      where: {
        status: 'approved',
      },

      include: [
        {
          model: OfferImage,
          as: 'images',
        },

        {
          model: Category,
          as: 'category',

          include:[
            {
              model: Unit,
              as: 'unit'
            }
          ]
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

    offers: rows,

  };

};



exports.approveOffer = async (offerId) => {

  const offer = await Offer.findByPk(offerId);

  if (!offer) {
    throw new AppError('Offer not found', 404);
  }

  offer.status = 'approved';

  await offer.save();

  return offer;

};



exports.rejectOffer = async (offerId) => {

  const offer = await Offer.findByPk(offerId);

  if (!offer) {
    throw new AppError('Offer not found', 404);
  }

  offer.status = 'rejected';

  await offer.save();

  return offer;

};







exports.getAllOffers = async (
  page,
  limit,
  search,
  status
) => {
  const offset = (page - 1) * limit;

  const where = {};

  if (status) {
    where.status = status;
  }

  if (search) {
    where[Op.or] = [
      {
        type: {
          [Op.like]: `%${search}%`,
        },
      },
      Sequelize.where(
        Sequelize.col('farmer.user.name'),
        {
          [Op.like]: `%${search}%`,
        }
      ),
    ];
  }

  const { count, rows } = await Offer.findAndCountAll({
    where,

    include: [
      {
        model: OfferImage,
        as: 'images',
      },
      {
        model: Farmer,
        as: 'farmer',
        required: true,
        include: [
          {
            model: User,
            as: 'user',
            required: true,
          },
        ],
      },
      {
          model: Category,
          as: 'category',

          include:[
            {
              model: Unit,
              as: 'defaultUnit'
            }
          ]
        }
    ],

    order: [['created_at', 'DESC']],

    limit,
    offset,
    distinct: true,
  });

  return {
    total: count,
    current_page: page,
    total_pages: Math.ceil(count / limit),
    offers: rows,
  };
};




