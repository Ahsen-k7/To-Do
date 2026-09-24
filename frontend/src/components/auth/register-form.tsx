"use client";

import { useState, type FormEvent } from "react";
import { apiRequest } from "@/lib/api";
import { Icon } from "@/components/ui/icon";
import styles from "./auth.module.css";

type Field = "name" | "email" | "password" | "confirmPassword";
type Errors = Partial<Record<Field, string>>;

export function RegisterForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pending, setPending] = useState(false);
  const [requestError, setRequestError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setRequestError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    const next: Errors = {};

    if (!name || name.length > 100) next.name = "Enter your name (1–100 characters).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) next.email = "Enter a valid email address.";
    if (password.length < 15 || password.length > 128) next.password = "Use between 15 and 128 characters.";
    if (!confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password) next.confirmPassword = "Your passwords don’t match.";

    setErrors(next);
    const firstInvalid = Object.keys(next)[0];
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLInputElement)?.focus();
      return;
    }
    setPending(true);
    try {
      await apiRequest("/auth/register", { name, email, password });
      window.location.replace("/login?registered=1");
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Please try again.");
      setPending(false);
    }
  }

  return (
    <form className={styles.form} noValidate onSubmit={submit} onChange={() => setRequestError("")}>
      <div className={styles.field}>
        <label htmlFor="name">Full name</label>
        <input id="name" name="name" autoComplete="name" placeholder="Your name" maxLength={100} required aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
        {errors.name && <p id="name-error" className={styles.error}>{errors.name}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor="email">Email address</label>
        <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />
        {errors.email && <p id="email-error" className={styles.error}>{errors.email}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor="password">Password</label>
        <div className={styles.passwordInput}>
          <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Create a password" minLength={15} maxLength={128} required aria-invalid={Boolean(errors.password)} aria-describedby={`password-hint${errors.password ? " password-error" : ""}`} />
          <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} aria-controls="password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button>
        </div>
        <p id="password-hint" className={styles.hint}>Use 15–128 characters. A memorable phrase works well.</p>
        {errors.password && <p id="password-error" className={styles.error}>{errors.password}</p>}
      </div>
      <div className={styles.field}>
        <label htmlFor="confirmPassword">Confirm password</label>
        <div className={styles.passwordInput}>
          <input id="confirmPassword" name="confirmPassword" type={showConfirmation ? "text" : "password"} autoComplete="new-password" placeholder="Enter your password again" maxLength={128} required aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? "confirm-error" : undefined} />
          <button type="button" aria-label={showConfirmation ? "Hide password confirmation" : "Show password confirmation"} aria-pressed={showConfirmation} aria-controls="confirmPassword" onClick={() => setShowConfirmation(!showConfirmation)}>{showConfirmation ? "Hide" : "Show"}</button>
        </div>
        {errors.confirmPassword && <p id="confirm-error" className={styles.error}>{errors.confirmPassword}</p>}
      </div>
      <button type="submit" className={styles.submit} disabled={pending}>{pending ? "Creating account..." : "Create account"} <Icon name="arrow" /></button>
      <div aria-live="polite" role="status">
        {requestError && <p className={styles.error} role="alert">{requestError}</p>}
      </div>
    </form>
  );
}
