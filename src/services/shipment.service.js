const { Op, Sequelize } = require('sequelize');

const {
  Shipment
} = require('../models');
const AppError = require('../utils/app-error');

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

exports.updateShipmentStatus = async (shipmentId, status) => {
  const shipment = await Shipment.findByPk(shipmentId);

  if (!shipment) {
    throw new AppError('Shipment not found', 404);
  }

  shipment.status = status;

  if (status === 'completed') {
    shipment.completed_date = new Date();
  }

  await shipment.save();

  return shipment;
};



exports.getShipmentById = async (shipmentId) => {

  const shipment = await Shipment.findByPk(shipmentId);

  if (!shipment) {
    throw new AppError('Shipment not found', 404);
  }

  return shipment;

};
