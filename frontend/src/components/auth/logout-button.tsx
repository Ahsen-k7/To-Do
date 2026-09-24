"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import styles from "./auth.module.css";

export function LogoutButton() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function logout() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await apiRequest("/auth/logout", {});
      // A full navigation also discards the client router's cached user content.
      window.location.replace("/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not log out. Try again.");
      setPending(false);
    }
  }

  return (
    <div>
      <button type="button" className={styles.logout} disabled={pending} onClick={logout}>
        {pending ? "Logging out…" : "Log out"}
      </button>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}
