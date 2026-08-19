const { where , Op, Sequelize  } = require('sequelize');
const {
  FactoryRequest, Factory , User , Category , Unit
} = require('../models');
const AppError = require( '../utils/app-error');

const notificationService = require('./notification.service');

const NOTIFICATION_TYPES = require('../constants/notification-types');



const ERROR_MESSAGES = require('../constants/error-messages');

const SUCCESS_MESSAGES = require('../constants/success-messages');



exports.createFactoryRequest = async (data) => {

    const request =
      await FactoryRequest.create({

        factory_id: data.factory_id,

        category_id: data.category_id,

        quantity: data.quantity,

        max_price: data.max_price,

        status: 'pending',

      });

      try {

    await notificationService.notifyAdmins({

      type: NOTIFICATION_TYPES.NEW_REQUEST,

      title: 'New Factory Request',

      message:
        'A new factory request has been submitted.',

      data: {
        request_id: request.id,
        factory_id: request.factory_id,
        category_id: request.category_id,
        quantity: request.quantity,
        max_price: request.max_price,
      },

    });

  } catch (notificationError) {

    console.error(
      'Failed to create factory request notification:',
      notificationError
    );

  }

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

      include: [

        {
          model: Category,
          as: 'category',

          include: [
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
        ERROR_MESSAGES.FACTORY_REQUEST_NOT_FOUND,
        404
      );
    }

    if (request.status !== 'pending') {

      throw new AppError(
        ERROR_MESSAGES.INVALID_FACTORY_REQUEST_STATUS,
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
        ERROR_MESSAGES.FACTORY_REQUEST_NOT_FOUND,
        404
      );
    }

     if (request.status !== 'pending') {

      throw new AppError(
        ERROR_MESSAGES.INVALID_FACTORY_REQUEST_STATUS,
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

        id: {
          [Op.like]: `%${search}%`,
        },
      },

      {

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

      Sequelize.where(
        Sequelize.col('category.name'),
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
      ,
        {
          model: Category,
          as: 'category',

          include: [
            {
            model: Unit,
            as: 'defaultUnit'
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



    if (!request) {
      throw new AppError(
        ERROR_MESSAGES.FACTORY_REQUEST_NOT_FOUND,
        404
      );
    }

     if (request.status !== 'pending') {

      throw new AppError(
        ERROR_MESSAGES.INVALID_FACTORY_REQUEST_STATUS,
        400
      );
    }

    request.status = status ;

    await request.save();


    try {

  if (status === 'approved') {

    await notificationService.createNotification({

      userId: request.factory_id,

      type:
        NOTIFICATION_TYPES.REQUEST_APPROVED,

      title: 'Factory Request Approved',

      message:
        'Your factory request has been approved.',

      data: {
        request_id: request.id,
      },

    });

  }


  if (status === 'rejected') {

    await notificationService.createNotification({

      userId: request.factory_id,

      type:
        NOTIFICATION_TYPES.REQUEST_REJECTED,

      title: 'Factory Request Rejected',

      message:
        'Your factory request has been rejected.',

      data: {
        request_id: request.id,
      },

    });

  }

} catch (notificationError) {

  console.error(
    'Failed to create request notification:',
    notificationError
  );

}

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
        ERROR_MESSAGES.FACTORY_REQUEST_NOT_FOUND,
        404
      );
    }

     if (request.status !== 'pending' && request.status !== 'approved') {

      throw new AppError(
        ERROR_MESSAGES.INVALID_FACTORY_REQUEST_STATUS,
        400
      );
    }

    request.status = 'cancelled';

    await request.save();

    try {

  await notificationService.createNotification({

    userId: request.factory_id,

    type:
      NOTIFICATION_TYPES.REQUEST_CANCELLED,

    title: 'Factory Request Cancelled',

    message:
      'Your factory request has been cancelled.',

    data: {
      request_id: request.id,
    },

  });

} catch (notificationError) {

  console.error(
    'Failed to create request cancellation notification:',
    notificationError
  );

}

    return request;

};