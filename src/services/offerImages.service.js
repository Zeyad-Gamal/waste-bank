const { Op, Sequelize } = require('sequelize');
const { Offer, OfferImage, User, Farmer, sequelize } = require('../models');
const AppError = require( '../utils/app-error');


exports.getAllOfferImages = async (
  
  page,
  limit,
  search
) => {

  const offset = (page - 1) * limit;

  const offerWhere = {};



  if (search) {
    offerWhere[Op.or] = [

      { '$offer.type$': { [Op.like]: `%${search}%` } },
      { '$offer.item_type$': { [Op.like]: `%${search}%` } },
      { '$offer.description$': { [Op.like]: `%${search}%` } },
      { '$offer.farmer.user.name$': { [Op.like]: `%${search}%` } }
    ];
  }



  const { count, rows } = await OfferImage.findAndCountAll({

    attributes: {
      exclude: ['created_at', 'updated_at']
    },

    where: offerWhere,

    include: [
  {
    model: Offer,
    as: 'offer',
    required: true,
    include: [
      {
        model: Farmer,
        as: 'farmer',
        required: true,
        include: [
          {
            model: User,
            as: 'user',
            attributes: {
              exclude: ['password', 'created_at', 'updated_at', 'id']
            },
            required: true
          }
        ]
      }
    ]
  }
],

    order: [
      ['created_at', 'DESC']
    ],

    limit,
    offset,

    distinct: true
  });


  return {
    total: count,
    current_page: page,
    total_pages: Math.ceil(count / limit),
    images: rows
  };
};


exports.deleteOfferImage = async (
  offerImgId,
) => {

   const offerImg = await OfferImage.findOne({

    where: {
      id: offerImgId,
    },

  });

  if (!offerImg) {
    throw new AppError('Image not found', 404);
  }



  await offerImg.destroy();

};
