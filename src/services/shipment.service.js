const { Op, Sequelize } = require('sequelize');

const {
  Shipment,
  Purchase,
  Offer,
  Sale,
  Factory,
} = require('../models');

const notificationService = require('./notification.service');

const NOTIFICATION_TYPES = require('../constants/notification-types');

const AppError = require('../utils/app-error');

const getShipmentRecipientId = async (shipment) => {

  if (shipment.related_type === 'purchase') {

    const purchase = await Purchase.findByPk(
      shipment.related_id
    );

    if (!purchase) {
      throw new AppError(
        'Purchase not found',
        404
      );
    }

    const offer = await Offer.findByPk(
      purchase.offer_id
    );

    if (!offer) {
      throw new AppError(
        'Offer not found',
        404
      );
    }

    // Offer.farmer_id = User.id
    return offer.farmer_id;
  }


  if (shipment.related_type === 'sale') {

    const sale = await Sale.findByPk(
      shipment.related_id
    );

    if (!sale) {
      throw new AppError(
        'Sale not found',
        404
      );
    }

    // Sale.factory_id = Factory.user_id
    return sale.factory_id;
  }


  throw new AppError(
    'Invalid shipment related type',
    400
  );
};

exports.createShipment = async (data) => {

  const shipment = await Shipment.create({
    type: data.type,

    related_type:
      data.related_type,

    related_id:
      data.related_id,

    driver_name:
      data.driver_name,

    driver_phone:
      data.driver_phone,

    vehicle_type:
      data.vehicle_type,

    plate_number:
      data.plate_number,

    status: 'pending',

    scheduled_date:
      data.scheduled_date,
  });


  try {

    const recipientId =
      await getShipmentRecipientId(
        shipment
      );


    await notificationService.createNotification({

      userId: recipientId,

      type:
        NOTIFICATION_TYPES.SHIPMENT_CREATED,

      title: 'Shipment Scheduled',

      message:
        'A new shipment has been scheduled.',

      data: {
        shipment_id: shipment.id,

        related_type:
          shipment.related_type,

        related_id:
          shipment.related_id,
      },

    });

  } catch (notificationError) {

    console.error(
      'Failed to create shipment notification:',
      notificationError
    );

  }


  return shipment;

  
};

exports.getShipments = async (
  page,
  limit,
  search,
  type,
  status
) => {

  console.log("page: " + page)
  console.log("limit: " + limit)
  console.log("search: " + search)
  console.log("type: " + type)
  console.log("status: " + status)

  const offset = (page - 1) * limit;

  const where = {};


  if (search) {
    where[Op.or] = [
      { driver_name: { [Op.like]: `%${search}%`, }, },
      { driver_phone: { [Op.like]: `%${search}%`, }, },
      { vehicle_type: { [Op.like]: `%${search}%`, }, },
      { plate_number: { [Op.like]: `%${search}%`, }, }
    ];
  }

  if (status) {
    where['status'] = status;
  }

  if (type) {
    where['type'] = type;
  }

  return await Shipment.findAll({

    where,
    order: [
      [
        'created_at',
        'DESC'
      ]
    ],
    offset
  });
};

exports.updateShipmentStatus = async (
  shipmentId,
  status
) => {

  const shipment =
    await Shipment.findByPk(
      shipmentId
    );


  if (!shipment) {

    throw new AppError(
      'Shipment not found',
      404
    );

  }


  shipment.status = status;


  if (status === 'completed') {

    shipment.completed_date =
      new Date();

  }


  await shipment.save();


  try {

    const recipientId =
      await getShipmentRecipientId(
        shipment
      );


    let notificationType;
    let title;
    let message;


    if (status === 'in_transit') {

      notificationType =
        NOTIFICATION_TYPES
          .SHIPMENT_IN_PROGRESS;

      title =
        'Shipment In Progress';

      message =
        'Your shipment is now in transit.';

    }


    else if (status === 'completed') {

      notificationType =
        NOTIFICATION_TYPES
          .SHIPMENT_COMPLETED;

      title =
        'Shipment Completed';

      message =
        'Your shipment has been completed.';

    }


    else if (status === 'cancelled') {

      notificationType =
        NOTIFICATION_TYPES
          .SHIPMENT_CANCELLED;

      title =
        'Shipment Cancelled';

      message =
        'Your shipment has been cancelled.';

    }


    if (notificationType) {

      await notificationService
        .createNotification({

          userId: recipientId,

          type: notificationType,

          title,

          message,

          data: {
            shipment_id:
              shipment.id,

            related_type:
              shipment.related_type,

            related_id:
              shipment.related_id,
          },

        });

    }

  } catch (notificationError) {

    console.error(
      'Failed to create shipment notification:',
      notificationError
    );

  }


  return shipment;
};



exports.getShipmentById = async (shipmentId) => {

  const shipment = await Shipment.findByPk(shipmentId);

  if (!shipment) {
    throw new AppError('Shipment not found', 404);
  }

  return shipment;

};
