// Nodemailer helpers — sends verification and password reset emails

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM = process.env.SMTP_FROM || process.env.SMTP_USER;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function sendVerificationEmail(
  email: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const verifyUrl = `${APP_URL}/verify-email?token=${token}`;

    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "Verify your email address",
      html: `<p>Click the link below to verify your email address:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p><p>This link expires in 15 minutes.</p>`,
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return {
      success: false,
      error: "We couldn't send the email. Please try again in a few minutes.",
    };
  }
}

export async function sendPasswordResetEmail(
  email: string,
  token: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const resetUrl = `${APP_URL}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: FROM,
      to: email,
      subject: "Reset your password",
      html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 1 hour. If you did not request this, you can safely ignore this email.</p>`,
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to send password reset email:", err);
    return {
      success: false,
      error: "We couldn't send the email. Please try again in a few minutes.",
    };
  }
}
