// backend/utils/emailHelpers.js
const sendEmail = require('./sendEmail');

const BRAND = 'Dbuian Fashion';
const BRAND_COLOR = '#06b6d4'; // cyan-500

/**
 * Send email verification email.
 * @param {Object} user  - Mongoose user document
 * @param {string} rawToken - Raw (un-hashed) verification token
 */
const sendVerificationEmail = async (user, rawToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verifyUrl = `${frontendUrl}/verify-email/${rawToken}`;

  const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Verify Your Email — ${BRAND}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;background-color:#0f172a;">
        <tr>
          <td align="center" style="padding:40px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
              <!-- Header -->
              <tr>
                <td align="center" style="padding-bottom:32px;">
                  <div style="display:inline-block;width:72px;height:72px;background:linear-gradient(135deg,${BRAND_COLOR},#a855f7,#ec4899);border-radius:16px;line-height:72px;text-align:center;">
                    <span style="color:#fff;font-size:32px;font-weight:700;">D</span>
                  </div>
                  <h1 style="color:#fff;font-size:24px;font-weight:700;margin:16px 0 0;">${BRAND}</h1>
                </td>
              </tr>
              <!-- Card -->
              <tr>
                <td style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:40px;">
                  <h2 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 12px;">Verify your email address</h2>
                  <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
                    Hi <strong style="color:#e2e8f0;">${user.name}</strong>, thanks for joining ${BRAND}!
                    Please click the button below to verify your email address and activate your account.
                  </p>
                  <div style="text-align:center;margin:32px 0;">
                    <a href="${verifyUrl}"
                       style="display:inline-block;background:linear-gradient(135deg,${BRAND_COLOR},#3b82f6);color:#fff;text-decoration:none;font-size:16px;font-weight:600;padding:14px 36px;border-radius:12px;letter-spacing:0.3px;">
                      ✉️ Verify Email Address
                    </a>
                  </div>
                  <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 8px;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="color:${BRAND_COLOR};font-size:12px;word-break:break-all;margin:0 0 24px;">
                    ${verifyUrl}
                  </p>
                  <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
                  <p style="color:#64748b;font-size:12px;line-height:1.6;margin:0;">
                    ⏰ This link expires in <strong>24 hours</strong>.<br/>
                    If you did not create an account with ${BRAND}, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top:24px;">
                  <p style="color:#475569;font-size:12px;margin:0;">
                    © ${new Date().getFullYear()} ${BRAND} · Debre Berhan University
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: `Verify your email — ${BRAND}`,
    message,
  });
};

/**
 * Send password reset email.
 * @param {Object} user  - Mongoose user document
 * @param {string} rawToken - Raw (un-hashed) reset token
 */
const sendPasswordResetEmail = async (user, rawToken) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const resetUrl = `${frontendUrl}/reset-password/${rawToken}`;

  const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Reset Your Password — ${BRAND}</title>
    </head>
    <body style="margin:0;padding:0;background-color:#0f172a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;background-color:#0f172a;">
        <tr>
          <td align="center" style="padding:40px 16px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
              <!-- Header -->
              <tr>
                <td align="center" style="padding-bottom:32px;">
                  <div style="display:inline-block;width:72px;height:72px;background:linear-gradient(135deg,${BRAND_COLOR},#a855f7,#ec4899);border-radius:16px;line-height:72px;text-align:center;">
                    <span style="color:#fff;font-size:32px;font-weight:700;">D</span>
                  </div>
                  <h1 style="color:#fff;font-size:24px;font-weight:700;margin:16px 0 0;">${BRAND}</h1>
                </td>
              </tr>
              <!-- Card -->
              <tr>
                <td style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:40px;">
                  <h2 style="color:#fff;font-size:22px;font-weight:700;margin:0 0 12px;">Reset your password</h2>
                  <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 24px;">
                    Hi <strong style="color:#e2e8f0;">${user.name}</strong>, we received a request to reset the password
                    for your ${BRAND} account. Click the button below to choose a new password.
                  </p>
                  <div style="text-align:center;margin:32px 0;">
                    <a href="${resetUrl}"
                       style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;text-decoration:none;font-size:16px;font-weight:600;padding:14px 36px;border-radius:12px;letter-spacing:0.3px;">
                      🔑 Reset Password
                    </a>
                  </div>
                  <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0 0 8px;">
                    Or copy and paste this link into your browser:
                  </p>
                  <p style="color:${BRAND_COLOR};font-size:12px;word-break:break-all;margin:0 0 24px;">
                    ${resetUrl}
                  </p>
                  <hr style="border:none;border-top:1px solid rgba(255,255,255,0.08);margin:24px 0;" />
                  <p style="color:#64748b;font-size:12px;line-height:1.6;margin:0;">
                    ⏰ This link expires in <strong>15 minutes</strong>.<br/>
                    If you did not request a password reset, you can safely ignore this email.
                    Your password will not change.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="padding-top:24px;">
                  <p style="color:#475569;font-size:12px;margin:0;">
                    © ${new Date().getFullYear()} ${BRAND} · Debre Berhan University
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: `Reset your password — ${BRAND}`,
    message,
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
