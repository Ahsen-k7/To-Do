import "dotenv/config";

import app from "./app.js";
import { prisma } from "./lib/prisma.js";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    // A real query verifies the database is reachable, even with a lazy pool.
    await prisma.$queryRaw`SELECT 1`;
    console.log("PostgreSQL connection verified.");
  } catch {
    // Database errors can contain connection details; do not print raw errors.
    console.error(
      "Database connection failed. Check DATABASE_URL, credentials, database name, and that PostgreSQL is running.",
    );
    await prisma.$disconnect().catch(() => undefined);
    process.exitCode = 1;
    return;
  }

  const server = app.listen(PORT, () => {
    console.log(`TaskFlow API running at http://localhost:${PORT}`);
  });

  let shuttingDown = false;

  async function shutdown(exitCode = 0) {
    if (shuttingDown) return;
    shuttingDown = true;

    // Bound shutdown in case a request never finishes.
    const timeout = setTimeout(() => process.exit(1), 10_000);
    timeout.unref();

    try {
      // Stop accepting requests and finish active requests before closing the pool.
      if (server.listening) {
        await new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
        });
      }
      await prisma.$disconnect();
      console.log("HTTP server and database connection closed.");
      process.exitCode = exitCode;
    } catch {
      console.error("Server shutdown failed.");
      process.exit(1);
    } finally {
      clearTimeout(timeout);
    }
  }

  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());
 server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
  } else {
    console.error("HTTP server error:", error.message);
  }

  void shutdown(1);
});
}

void startServer();
