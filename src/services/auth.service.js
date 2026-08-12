const bcrypt = require('bcryptjs');

const { User, Farmer, Factory, sequelize } = require('../models');

const emailVerificationService = require('./email-verification.service');

const { generateToken } = require('../utils/jwt');

const AppError = require('../utils/app-error');

exports.registerFarmer = async (data) => {

  const transaction = await sequelize.transaction();

  try {

    const existingUser = await User.findOne({
      where: {
        phone: data.phone,
      },
    });

    if (existingUser) {
      throw new AppError('Phone already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await User.create(
      {
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
        role: 'farmer',
        is_active: 'active',
        email: null,
        email_verified: true
      },
      { transaction }
    );

    const farmer = await Farmer.create(
      {
        user_id: user.id,

        national_id: data.national_id,
        national_id_image: data.national_id_image,

        birthdate: data.birthdate,

        land_size: data.land_size,
        land_type: data.land_type,
        crops_type: data.crops_type,

        harvest_location: data.harvest_location,

        proof_image: data.proof_image,

        address_governrate: data.address_governrate,
        address_city: data.address_city,
        address_village: data.address_village,
        address_street: data.address_street,
      },
      { transaction }
    );

    await transaction.commit();

    const token = generateToken({
      id: user.id,
      role: user.role,
    });

    return {
      token,

      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        email_verified: user.email_verified,
      },

      farmer,
    };

  } catch (error) {

    await transaction.rollback();

    throw error;
  }

 };



 
exports.registerFactory = async (data) => {
  const transaction = await sequelize.transaction();

  try {
    const existingUser = await User.findOne({
      where: {
        phone: data.phone,
      },
      transaction,
    });

    if (existingUser) {
      throw new AppError(
        'Phone already exists',
        400
      );
    }

    const existingFactory = await Factory.findOne({
      where: {
        email: data.email,
      },
      transaction,
    });

    if (existingFactory) {
      throw new AppError(
        'Factory email already exists',
        400
      );
    }

    const existingRegistrationNumber =
      await Factory.findOne({
        where: {
          industrial_registration_number:
            data.industrial_registration_number,
        },
        transaction,
      });

    if (existingRegistrationNumber) {
      throw new AppError(
        'Industrial registration number already exists',
        400
      );
    }

    const hashedPassword =
      await bcrypt.hash(data.password, 10);

    const user = await User.create(
      {
        name: data.name,
        phone: data.phone,
        password: hashedPassword,
        role: 'factory',
        is_active: 'inactive',
        email: data.email,
        email_verified: false,
      },
      { transaction }
    );

    const factory = await Factory.create(
      {
        user_id: user.id,
        email: data.email,
        factory_owner_name:
          data.factory_owner_name,

        address_governrate:
          data.address_governrate,

        address_city:
          data.address_city,

        address_village:
          data.address_village,

        address_street:
          data.address_street,

        industrial_registration_number:
          data.industrial_registration_number,

        industry_type:
          data.industry_type,

        factory_image:
          data.factory_image,
      },
      { transaction }
    );

    // Commit database changes
    await transaction.commit();

    // Send verification email AFTER successful commit
    try {
      await emailVerificationService
        .sendVerificationEmail(user.id);
    } catch (emailError) {

      console.error(
        'Verification email failed:',
        emailError
      );

      // Don't rollback.
      // User has already been created successfully.
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
        email_verified:
          user.email_verified,
      },

      factory,
    };

  } catch (error) {

    // Rollback only if transaction is still active
    if (!transaction.finished) {
      await transaction.rollback();
    }

    throw error;
  }
};



exports.login = async (data) => {

  const user = await User.findOne({
    where: {
      phone: data.phone,
    },
  });

  if (!user) {
    throw new AppError('Invalid phone or password', 400);
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError('Invalid phone or password', 400);
  }

  if (!user.email_verified) {
  throw new AppError(
    'Please verify your email before logging in',
    403
  );
}


if (user.is_active !== 'active') {
  throw new AppError(
    'Your account is not active',
    403
  );
}

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return {
  token,

  user: {
    id: user.id,
    name: user.name,
    phone: user.phone,
    role: user.role,
    email_verified: user.email_verified,
    is_active: user.is_active,
  },
};

};




exports.adminLogin = async (data) => {

  const user = await User.findOne({
    where: {
      name: data.name,
    },
  });

  if (!user) {
    throw new AppError('Invalid name or password', 400);
  }
  

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError('Invalid phone or password', 400);
  }

  const token = generateToken({
    id: user.id,
    role: user.role,
  });

  return {

    token,

    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },

  };

};




exports.me = async (id) => {

  const user = await User.findByPk(id);

  return user;

};

