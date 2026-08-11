const crypto = require('crypto');

const {
  User,
  EmailVerificationToken,
} = require('../models');

const emailService = require('./email.service');
const AppError = require('../utils/app-error');

const TOKEN_EXPIRATION_HOURS = 24;

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const hashToken = (token) => {
  return crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');
};

exports.sendVerificationEmail = async (userId) => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.email_verified) {
    throw new AppError('Email is already verified', 400);
  }

  // Invalidate old unused tokens
  await EmailVerificationToken.update(
    {
      used_at: new Date(),
    },
    {
      where: {
        user_id: userId,
        used_at: null,
      },
    }
  );

  const rawToken = generateVerificationToken();
  const hashedToken = hashToken(rawToken);

  const expiresAt = new Date(
    Date.now() + TOKEN_EXPIRATION_HOURS * 60 * 60 * 1000
  );

  await EmailVerificationToken.create({
    user_id: userId,
    token: hashedToken,
    expires_at: expiresAt,
  });

  const verificationUrl =
    `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

  await emailService.sendEmail({
    to: user.email,
    subject: 'Verify your Waste Bank email',
    html: `
      <h2>Welcome to Waste Bank</h2>

      <p>Hello ${user.name},</p>

      <p>
        Please verify your email address by clicking the button below:
      </p>

      <a
        href="${verificationUrl}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background: #198754;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
        "
      >
        Verify Email
      </a>

      <p>
        This link will expire in 24 hours.
      </p>
    `,
  });

  return {
    message: 'Verification email sent successfully',
  };
};


exports.verifyEmail = async (rawToken) => {
  if (!rawToken) {
    throw new AppError(
      'Verification token is required',
      400
    );
  }

  const hashedToken = hashToken(rawToken);

  const verificationToken =
    await EmailVerificationToken.findOne({
      where: {
        token: hashedToken,
        used_at: null,
      },
    });

  if (!verificationToken) {
    throw new AppError(
      'Invalid or already used verification token',
      400
    );
  }

  if (new Date() > verificationToken.expires_at) {
    await verificationToken.update({
      used_at: new Date(),
    });

    throw new AppError(
      'Verification token has expired',
      400
    );
  }

  const user = await User.findByPk(
    verificationToken.user_id
  );

  if (!user) {
    throw new AppError(
      'User not found',
      404
    );
  }

  if (user.email_verified) {
    await verificationToken.update({
      used_at: new Date(),
    });

    return {
      message: 'Email is already verified',
    };
  }

  const transaction =
    await User.sequelize.transaction();

  try {

    await user.update(
      {
        email_verified: true,
      },
      { transaction }
    );

    await verificationToken.update(
      {
        used_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

  } catch (error) {

    await transaction.rollback();
    throw error;

  }

  return {
    message: 'Email verified successfully',
  };
};