const {
  FactoryRequest,
} = require('../models');

exports.createFactoryRequest =
  async (data) => {

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


exports.updateFactoryRequest =
  async (
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
      throw new Error(
        'Factory request not found'
      );
    }

    if (request.status !== 'open') {

      throw new Error(
        'Only open requests can be updated'
      );

    }

    await request.update(data);

    return request;

};


exports.cancelFactoryRequest =
  async (
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
      throw new Error(
        'Factory request not found'
      );
    }

     if (request.status !== 'open') {

      throw new Error(
        'Only open requests can be cancelled'
      );
    }

    request.status = 'cancelled';

    await request.save();

    return request;

};