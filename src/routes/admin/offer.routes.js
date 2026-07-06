const { Offer, OfferImage, User, sequelize } = require('../models');
const AppError = require( '../utils/app-error');


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
  limit
) => {

  const offset = (page - 1) * limit;

  const { count, rows } =
    await Offer.findAndCountAll({

      include: [
        {
          model: OfferImage,
          as: 'images',
        },
        {
          model: User,
          as: 'farmer'
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