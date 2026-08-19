import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

export async function hashPassword(plainPassword: string) {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword: string, passwordHash: string) {
  return await bcrypt.compare(plainPassword, passwordHash);
}

export async function hashToken(token: string) {
  return await bcrypt.hash(token, 10);
}

export async function verifyTokenHash(token: string, tokenHash: string) {
  return await bcrypt.compare(token, tokenHash);
}
