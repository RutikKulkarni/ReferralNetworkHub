import nodemailer from "nodemailer"
import config from "../config"

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.secure,
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
})

/**
 * Sends a password reset email with a secure link
 * @param email Recipient email address
 * @param resetLink Password reset link
 */
export const sendPasswordResetEmail = async (email: string, resetLink: string): Promise<void> => {
  try {
    // For development/testing, log the reset link instead of sending an email
    if (config.nodeEnv === "development") {
      console.log(`Password reset link for ${email}: ${resetLink}`)
      return
    }

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Reset Your Password - Referral Network Hub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password</h2>
          <p>You requested a password reset for your Referral Network Hub account.</p>
          <p>Click the button below to reset your password. This link will expire in 10 minutes.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          <p>For security reasons, this link will expire in 10 minutes.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">Referral Network Hub</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error("Error sending password reset email:", error)
    throw new Error("Failed to send password reset email")
  }
}

/**
 * Sends a welcome email to new users
 * @param email Recipient email address
 * @param firstName User's first name
 */
export const sendWelcomeEmail = async (email: string, firstName: string): Promise<void> => {
  try {
    // For development/testing, log instead of sending an email
    if (config.nodeEnv === "development") {
      console.log(`Welcome email would be sent to ${email}`)
      return
    }

    const mailOptions = {
      from: config.email.from,
      to: email,
      subject: "Welcome to Referral Network Hub",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Referral Network Hub, ${firstName}!</h2>
          <p>Thank you for joining our platform. We're excited to help you connect with opportunities and grow your professional network.</p>
          <p>To get started, complete your profile and explore available jobs and referrers.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${config.clientUrl}/dashboard" style="background-color: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Go to Dashboard</a>
          </div>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #777;">Referral Network Hub</p>
        </div>
      `,
    }

    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error("Error sending welcome email:", error)
    // Don't throw here, as welcome email is not critical
  }
}
