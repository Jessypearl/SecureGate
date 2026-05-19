// Server Actions — signup, forgot-password, and reset-password handlers

"use server";

import { z } from "zod";
import { db } from "./db";
import { hashPassword } from "./password";
import {
  createVerificationToken,
  createPasswordResetToken,
  validateVerificationToken,
  validatePasswordResetToken,
} from "./tokens";
import { sendVerificationEmail, sendPasswordResetEmail } from "./email";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function signup(
  prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
    };
  }

  const { email, password } = parsed.data;

  try {
    const existing = await db.user.findUnique({ where: { email } });

    if (existing) {
      return {
        success: false,
        error: "An account with this email already exists.",
      };
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email,
        passwordHash,
      },
    });

    const rawToken = await createVerificationToken(user.id);

    const emailResult = await sendVerificationEmail(email, rawToken);

    if (!emailResult.success) {
      await db.user.delete({ where: { id: user.id } });
      return {
        success: false,
        error: emailResult.error ?? "Failed to send verification email.",
      };
    }

    return { success: true, data: undefined };
  } catch (err) {
    console.error("Signup error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function forgotPassword(
  prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
    };
  }

  const { email } = parsed.data;

  try {
    const user = await db.user.findUnique({ where: { email } });

    if (!user) {
      return { success: true, data: undefined };
    }

    const rawToken = await createPasswordResetToken(user.id);

    await sendPasswordResetEmail(email, rawToken);

    return { success: true, data: undefined };
  } catch (err) {
    console.error("Forgot password error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function resetPassword(
  prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors[0].message,
    };
  }

  const { token, password } = parsed.data;

  try {
    const userId = await validatePasswordResetToken(token);

    if (!userId) {
      return {
        success: false,
        error: "This reset link is invalid or has expired.",
      };
    }

    const passwordHash = await hashPassword(password);

    await db.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true, data: undefined };
  } catch (err) {
    console.error("Reset password error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function verifyEmail(
  prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const token = formData.get("token");
  if (typeof token !== "string" || !token) {
    return { success: false, error: "Invalid verification link." };
  }

  try {
    const userId = await validateVerificationToken(token);

    if (!userId) {
      return {
        success: false,
        error: "This verification link is invalid or has expired.",
      };
    }

    return { success: true, data: undefined };
  } catch (err) {
    console.error("Verify email error:", err);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
