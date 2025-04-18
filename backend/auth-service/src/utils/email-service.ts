import nodemailer from "nodemailer"

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.example.com",
  port: Number.parseInt(process.env.EMAIL_PORT || "587"),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER || "user@example.com",
    pass: process.env.EMAIL_PASSWORD || "password",
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
    if (process.env.NODE_ENV === "development") {
      console.log(`Password reset link for ${email}: ${resetLink}`)
      return
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || "noreply@referralnetworkhub.com",
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
