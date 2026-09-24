import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { Icon } from "@/components/ui/icon";
import styles from "./landing.module.css";

type Appearance = {
  variant?: "primary" | "light" | "text";
  size?: "default" | "large";
  arrow?: boolean;
};
type ButtonProps = Appearance & (
  | (ComponentPropsWithoutRef<"button"> & { href?: never })
  | (ComponentPropsWithoutRef<typeof Link> & { href: string })
);

export function Button({ variant = "primary", size = "default", arrow = false, className = "", children, ...props }: ButtonProps) {
  const classes = [
    variant === "text" ? styles.login : styles.button,
    variant === "light" ? styles.lightButton : "",
    size === "large" ? styles.largeButton : "",
    className,
  ].filter(Boolean).join(" ");
  const content = <>{children}{arrow && <Icon name="arrow" />}</>;
  if (props.href !== undefined) {
    return <Link className={classes} {...props}>{content}</Link>;
  }
  return <button type="button" className={classes} {...props}>{content}</button>;
}
