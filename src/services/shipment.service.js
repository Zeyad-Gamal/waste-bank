const {
  Shipment
} = require('../models');

exports.createShipment = async (data) => {
  return await Shipment.create({
    type: data.type,
    related_type: data.related_type,
    related_id: data.related_id,
    driver_name: data.driver_name,
    driver_phone: data.driver_phone,
    vehicle_type: data.vehicle_type,
    plate_number: data.plate_number,
    status: 'scheduled',
    scheduled_date: data.scheduled_date
  });
};

exports.getShipments = async () => {
  return await Shipment.findAll({
    order: [
      [
        'created_at',
        'DESC'
      ]
    ]
  });
};

exports.updateShipmentStatus = async (shipmentId, status) => {
  const shipment = await Shipment.findByPk(shipmentId);

  if (!shipment) {
    throw new Error('Shipment not found');
  }

  shipment.status = status;

  if (status === 'completed') {
    shipment.completed_date = new Date();
  }

  await shipment.save();

  return shipment;
};