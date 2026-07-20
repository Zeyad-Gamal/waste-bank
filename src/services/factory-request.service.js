const { where , Op, Sequelize  } = require('sequelize');
const {
  FactoryRequest, Factory , User
} = require('../models');
const AppError = require( '../utils/app-error');


exports.createFactoryRequest = async (data) => {

    const request =
      await FactoryRequest.create({

        factory_id: data.factory_id,

        category: data.category,

        quantity: data.quantity,

        quantity_gauge:
          data.quantity_gauge,

        max_price: data.max_price,

        status: 'open',

      });

    return request;

};



exports.getMyRequests = async (
  factoryId
) => {

  const requests =
    await FactoryRequest.findAll({

      where: {
        factory_id: factoryId,
      },

      order: [
        ['created_at', 'DESC']
      ],

    });

  return requests;

};


exports.updateFactoryRequest =  async (
    requestId,
    factoryId,
    data
  ) => {

    const request =
      await FactoryRequest.findOne({

        where: {
          id: requestId,
          factory_id: factoryId,
        },

      });

    if (!request) {
      throw new AppError(
        'Factory request not found',
        404
      );
    }

    if (request.status !== 'open') {

      throw new AppError(
        'Only open requests can be updated',
        400
      );

    }

    await request.update(data);

    return request;

};


exports.cancelFactoryRequest = async (
    requestId,
    factoryId
  ) => {

    const request =
      await FactoryRequest.findOne({

        where: {
          id: requestId,
          factory_id: factoryId,
        },

      });

    if (!request) {
      throw new AppError(
        'Factory request not found',
        404
      );
    }

     if (request.status !== 'open') {

      throw new AppError(
        'Only open requests can be cancelled',
        400
      );
    }

    request.status = 'cancelled';

    await request.save();

    return request;

};








exports.getAllRequests = async (
  page,
  limit,
  search,
  status
) => {



  const offset = (page - 1) * limit;

  const where = {};


  if (search) {
    where[Op.or] = [
      {
        category: {
          [Op.like]: `%${search}%`,
        },

        quantity: {
          [Op.like]: `%${search}%`,
        },
      },
      Sequelize.where(
        Sequelize.col('factory.user.name'),
        {
          [Op.like]: `%${search}%`,
        }
      ),
    ];
  }

   if (status) {
    where['status'] = status;
  }


  const requests =
    await FactoryRequest.findAll({

      where,

      include: [

      {
        model: Factory,
        as: 'factory',
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

      ],
      
      order: [
        ['created_at', 'DESC']
      ],

    });

  return requests;

};




exports.updateRequestStatus = async (
    requestId,
    status
  ) => {


    const request =
      await FactoryRequest.findOne({

        where: {
          id: requestId
        },

      });

          console.log(request.status)


    if (!request) {
      throw new AppError(
        'Factory request not found',
        404
      );
    }

     if (request.status !== 'pending') {

      throw new AppError(
        'Only pending or requests can be updated',
        400
      );
    }

    request.status = status ;

    await request.save();

    return request;

};






exports.adminCancelFactoryRequest = async (
    requestId
  ) => {

    const request =
      await FactoryRequest.findOne({

        where: {
          id: requestId,
        },

      });

    if (!request) {
      throw new AppError(
        'Factory request not found',
        404
      );
    }

     if (request.status !== 'pending' && request.status !== 'approved') {

      throw new AppError(
        'Only pending or approved requests can be cancelled',
        400
      );
    }

    request.status = 'cancelled';

    await request.save();

    return request;

};