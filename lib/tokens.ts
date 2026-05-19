// Token generation and validation — SHA-256 hash before storage, raw token in email link

import crypto from "crypto";
import { db } from "./db";

function generateRawToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

function hashToken(rawToken: string): string {
  return crypto.createHash("sha256").update(rawToken).digest("hex");
}

export async function createVerificationToken(userId: string) {
  const rawToken = generateRawToken();
  const hashedToken = hashToken(rawToken);

  await db.verificationToken.create({
    data: {
      token: hashedToken,
      userId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  return rawToken;
}

export async function createPasswordResetToken(userId: string) {
  const rawToken = generateRawToken();
  const hashedToken = hashToken(rawToken);

  await db.passwordResetToken.create({
    data: {
      token: hashedToken,
      userId,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    },
  });

  return rawToken;
}

export async function validateVerificationToken(rawToken: string) {
  const hashedToken = hashToken(rawToken);

  const record = await db.verificationToken.findUnique({
    where: { token: hashedToken },
  });

  if (!record || record.expiresAt < new Date()) {
    return null;
  }

  await db.user.update({
    where: { id: record.userId },
    data: { emailVerified: true },
  });

  await db.verificationToken.delete({ where: { id: record.id } });

  return record.userId;
}

export async function validatePasswordResetToken(rawToken: string) {
  const hashedToken = hashToken(rawToken);

  const record = await db.passwordResetToken.findUnique({
    where: { token: hashedToken },
  });

  if (!record || record.expiresAt < new Date()) {
    return null;
  }

  await db.passwordResetToken.delete({ where: { id: record.id } });

  return record.userId;
}
