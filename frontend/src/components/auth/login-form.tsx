"use client";

import { useState, type FormEvent } from "react";
import { apiRequest } from "@/lib/api";
import { Icon } from "@/components/ui/icon";
import styles from "./auth.module.css";

type Field = "email" | "password";
type Errors = Partial<Record<Field, string>>;

export function LoginForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [requestError, setRequestError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setRequestError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const next: Errors = {};

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      next.email = "Enter a valid email address.";
    }
    if (!password) next.password = "Enter your password.";
    else if (password.length > 128) next.password = "Use no more than 128 characters.";

    setErrors(next);
    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLInputElement)?.focus();
      return;
    }
    setPending(true);
    try {
      await apiRequest("/auth/login", { email, password });
      window.location.replace("/dashboard");
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Please try again.");
      setPending(false);
    }
  }

  function clearFeedback(event: FormEvent<HTMLFormElement>) {
    setRequestError("");
    const field = (event.target as HTMLInputElement).name as Field;
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  return (
    <form className={styles.form} noValidate onSubmit={submit} onChange={clearFeedback}>
      <div className={styles.field}>
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email" name="email" type="email" autoComplete="email"
          placeholder="you@example.com" maxLength={254} required
          aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "login-email-error" : undefined}
        />
        {errors.email && <p id="login-email-error" className={styles.error}>{errors.email}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor="login-password">Password</label>
        <div className={styles.passwordInput}>
          <input
            id="login-password" name="password" type={showPassword ? "text" : "password"}
            autoComplete="current-password" placeholder="Enter your password" maxLength={128} required
            aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? "login-password-error" : undefined}
          />
          <button
            type="button" aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword} aria-controls="login-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        {errors.password && <p id="login-password-error" className={styles.error}>{errors.password}</p>}
      </div>
      <button type="submit" className={styles.submit} disabled={pending}>{pending ? "Logging in..." : "Log in"} <Icon name="arrow" /></button>
      <div role="status" aria-live="polite">
        {requestError && <p className={styles.error} role="alert">{requestError}</p>}
      </div>
    </form>
  );
}
