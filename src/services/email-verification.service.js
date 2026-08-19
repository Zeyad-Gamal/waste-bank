const crypto = require('crypto');

const {
  User,
  EmailVerificationToken,
} = require('../models');

const emailService = require('./email.service');
const AppError = require('../utils/app-error');
const ERROR_MESSAGES = require('../constants/error-messages');
const SUCCESS_MESSAGES = require('../constants/success-messages');

const TOKEN_EXPIRATION_HOURS = 24;

const RESEND_COOLDOWN_SECONDS = 60;


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
    throw new AppError(ERROR_MESSAGES.USER_NOT_FOUND, 404);
  }

  if (user.email_verified) {
    throw new AppError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED, 400);
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
    message: SUCCESS_MESSAGES.VERIFICATION_EMAIL_SENT,
  };
};


exports.verifyEmail = async (rawToken) => {

  if (!rawToken) {
    throw new AppError(
      ERROR_MESSAGES.VERIFICATION_TOKEN_REQUIRED,
      400
    );
  }

  const hashedToken = hashToken(rawToken);

  const transaction =
    await User.sequelize.transaction();

  try {

    const verificationToken =
      await EmailVerificationToken.findOne({
        where: {
          token: hashedToken,
          used_at: null,
        },

        transaction,

        lock: transaction.LOCK.UPDATE,
      });

    if (!verificationToken) {
      throw new AppError(
        ERROR_MESSAGES.INVALID_VERIFICATION_TOKEN,
        400
      );
    }

    if (
      new Date() >
      verificationToken.expires_at
    ) {

      await verificationToken.update(
        {
          used_at: new Date(),
        },
        { transaction }
      );

      throw new AppError(
        ERROR_MESSAGES.VERIFICATION_TOKEN_EXPIRED,
        400
      );
    }

    const user = await User.findByPk(
      verificationToken.user_id,
      {
        transaction,
        lock: transaction.LOCK.UPDATE,
      }
    );

    if (!user) {
      throw new AppError(
        ERROR_MESSAGES.USER_NOT_FOUND,
        404
      );
    }

    if (user.email_verified) {

      await verificationToken.update(
        {
          used_at: new Date(),
        },
        { transaction }
      );

      await transaction.commit();

      return {
        message: ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED,
      };
    }

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

    return {
      message: ERROR_MESSAGES.EMAIL_VERIFIED_SUCCESS,
    };

  } catch (error) {

    if (!transaction.finished) {
      await transaction.rollback();
    }

    throw error;
  }
};



exports.resendVerificationEmail = async (email) => {

  if (!email) {
    throw new AppError(ERROR_MESSAGES.EMAIL_REQUIRED, 400);
  }

  const user = await User.findOne({
    where: { email },
  });

  // Don't reveal whether the email exists
  if (!user) {
    return {
      message:
        SUCCESS_MESSAGES.VERIFICATION_EMAIL_SENT,
    };
  }

  if (user.email_verified) {
    throw new AppError(
      ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED,
      400
    );
  }

  const lastToken = await EmailVerificationToken.findOne({
    where: {
      user_id: user.id,
    },
    order: [
      ['created_at', 'DESC'],
    ],
  });

  if (lastToken) {

    const elapsed =
      Date.now() -
      new Date(lastToken.created_at).getTime();

    const cooldown =
      RESEND_COOLDOWN_SECONDS * 1000;

    if (elapsed < cooldown) {

      const remainingSeconds = Math.ceil(
        (cooldown - elapsed) / 1000
      );

      throw new AppError(
        `Please wait ${remainingSeconds} seconds before requesting another verification email`,
        429
      );
    }
  }

  await this.sendVerificationEmail(user.id);

  return {
    message:
      SUCCESS_MESSAGES.VERIFICATION_EMAIL_SENT,
  };
};