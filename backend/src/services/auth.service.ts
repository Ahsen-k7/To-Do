import { randomBytes } from "node:crypto";
import argon2 from "argon2";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { HttpError } from "../lib/http-error.js";
import { hashToken, SESSION_DURATION_MS } from "../lib/session.js";
import type { LoginInput, RegisterInput } from "../validators/auth.schema.js";

const publicUserSelect = {
  id: true, name: true, email: true, createdAt: true, updatedAt: true,
} as const;
const hashOptions = { type: argon2.argon2id, memoryCost: 19456, timeCost: 2, parallelism: 1 } as const;
// Unknown accounts still perform password verification to reduce timing differences.
let dummyHash: Promise<string> | undefined;

export async function register(input: RegisterInput) {
  const passwordHash = await argon2.hash(input.password, hashOptions);
  try {
    return await prisma.user.create({
      data: { name: input.name, email: input.email, passwordHash },
      select: publicUserSelect,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new HttpError(409, "An account with this email already exists.");
    }
    throw error;
  }
}

export async function login(input: LoginInput, previousToken?: string) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: { ...publicUserSelect, passwordHash: true },
  });
  dummyHash ??= argon2.hash(randomBytes(32).toString("hex"), hashOptions);
  const valid = await argon2.verify(user?.passwordHash ?? await dummyHash, input.password);
  if (!user || !valid) throw new HttpError(401, "Invalid email or password.");

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await prisma.$transaction(async (tx) => {
    // Rotate this browser's session; remove expired sessions for this user.
    await tx.session.deleteMany({
      where: { OR: [
        { userId: user.id, expiresAt: { lte: new Date() } },
        ...(previousToken ? [{ tokenHash: hashToken(previousToken) }] : []),
      ] },
    });
    await tx.session.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt } });
  });
  const { passwordHash: _, ...publicUser } = user;
  return { user: publicUser, token, expiresAt };
}

export async function getSessionUser(token: string) {
  const session = await prisma.session.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { expiresAt: true, user: { select: publicUserSelect } },
  });
  if (!session || session.expiresAt <= new Date()) return null;
  return session.user;
}

export async function logout(token?: string) {
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } });
}
