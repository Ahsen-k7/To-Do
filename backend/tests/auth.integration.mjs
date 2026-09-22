import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import argon2 from "argon2";
import app from "../dist/app.js";
import { prisma } from "../dist/lib/prisma.js";

// Uses the configured database; creates and removes only this run's unique user.
const email = `auth-test-${randomUUID()}@example.com`;
const password = "A long test passphrase 123!";
const origin = new URL(process.env.FRONTEND_URL).origin;
const server = app.listen(0, "127.0.0.1");
await new Promise(resolve => server.once("listening", resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const hash = token => createHash("sha256").update(token).digest("hex");

async function request(path, { method = "GET", body, cookie, csrf = true, requestOrigin = origin } = {}) {
  const response = await fetch(`${base}/api${path}`, {
    method,
    headers: {
      Origin: requestOrigin,
      ...(csrf ? { "X-TaskFlow-CSRF": "1" } : {}),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  assert.ok(!JSON.stringify(data).includes("passwordHash"));
  assert.ok(!JSON.stringify(data).includes("tokenHash"));
  return { status: response.status, headers: response.headers, data };
}
const login = () => request("/auth/login", { method: "POST", body: { email, password } });
const cookieOf = result => result.headers.get("set-cookie").split(";")[0];

try {
  assert.equal((await request("/health")).status, 200);
  assert.equal((await request("/auth/me")).status, 401);
  assert.equal((await request("/auth/register", { method: "POST", csrf: false, body: {} })).status, 403);
  assert.equal((await request("/auth/register", { method: "POST", requestOrigin: "https://untrusted.example", body: {} })).status, 403);
  assert.equal((await request("/auth/register", { method: "POST", body: { name: "", email: "bad", password: "short" } })).status, 400);
  const registered = await request("/auth/register", { method: "POST", body: { name: " Test User ", email: email.toUpperCase(), password } });
  assert.equal(registered.status, 201);
  assert.equal(registered.data.user.email, email);
  assert.equal(registered.data.user.name, "Test User");
  const storedUser = await prisma.user.findUniqueOrThrow({ where: { email } });
  assert.notEqual(storedUser.passwordHash, password);
  assert.ok(await argon2.verify(storedUser.passwordHash, password));
  assert.equal((await request("/auth/register", { method: "POST", body: { name: "Duplicate", email, password } })).status, 409);
  const wrong = await request("/auth/login", { method: "POST", body: { email, password: "wrong" } });
  const unknown = await request("/auth/login", { method: "POST", body: { email: `missing-${email}`, password } });
  assert.equal(wrong.status, 401);
  assert.equal(unknown.status, 401);
  assert.deepEqual(wrong.data, unknown.data);

  const loggedIn = await login();
  assert.equal(loggedIn.status, 200);
  assert.equal(loggedIn.headers.get("cache-control"), "no-store");
  assert.equal(loggedIn.headers.get("access-control-allow-origin"), origin);
  assert.equal(loggedIn.headers.get("access-control-allow-credentials"), "true");
  const setCookie = loggedIn.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /SameSite=Lax/i);
  assert.match(setCookie, /Max-Age=86400/i);
  assert.equal(/; Secure/i.test(setCookie), process.env.NODE_ENV === "production");
  const cookie = cookieOf(loggedIn);
  const token = cookie.split("=")[1];
  const session = await prisma.session.findUniqueOrThrow({ where: { tokenHash: hash(token) } });
  assert.notEqual(session.tokenHash, token);
  assert.ok(Math.abs(session.expiresAt.getTime() - Date.now() - 86_400_000) < 5000);
  assert.equal((await request("/auth/me", { cookie })).data.user.id, storedUser.id);
  assert.equal((await request("/auth/me", { cookie: "taskflow_session=malformed" })).status, 401);
  const rotated = await request("/auth/login", { method: "POST", body: { email, password }, cookie });
  assert.equal(rotated.status, 200);
  assert.equal((await request("/auth/me", { cookie })).status, 401);
  const rotatedCookie = cookieOf(rotated);
  await prisma.session.updateMany({ where: { userId: storedUser.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
  assert.equal((await request("/auth/me", { cookie: rotatedCookie })).status, 401);
  const freshCookie = cookieOf(await login());
  assert.equal((await request("/auth/logout", { method: "POST", cookie: freshCookie, csrf: false })).status, 403);
  assert.equal((await request("/auth/me", { cookie: freshCookie })).status, 200);
  const loggedOut = await request("/auth/logout", { method: "POST", cookie: freshCookie });
  assert.equal(loggedOut.status, 200);
  assert.match(loggedOut.headers.get("set-cookie"), /Expires=Thu, 01 Jan 1970/i);
  assert.equal((await request("/auth/me", { cookie: freshCookie })).status, 401);
  assert.equal(await prisma.session.count({ where: { userId: storedUser.id } }), 0);
  assert.equal((await request("/auth/logout", { method: "POST" })).status, 200);
  let limited = false;
  for (let i = 0; i < 21; i++) {
    if ((await request("/auth/login", { method: "POST", body: {} })).status === 429) { limited = true; break; }
  }
  assert.ok(limited, "Authentication attempts must be rate limited");
  console.log("PASS: registration, hashing, duplicate emails, login, cookies, session rotation, expiry, logout, CSRF, CORS, safe responses, and rate limiting.");
} finally {
  await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  await prisma.user.deleteMany({ where: { email } });
  await prisma.$disconnect();
}
