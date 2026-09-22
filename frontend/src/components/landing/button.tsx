import type { ComponentPropsWithoutRef } from "react";
import { Icon } from "@/components/ui/icon";
import styles from "./landing.module.css";
type ButtonProps=ComponentPropsWithoutRef<"button">&{
  variant?: "primary"|"light"|"text";
  size?: "default"|"large";
  arrow?: boolean;
};

export function Button({ children,variant="primary",size="default",arrow=false,className="",type="button",...props }: ButtonProps) {
  const classes=[
    variant==="text"? styles.login:styles.button,
    variant==="light"? styles.lightButton:"",
    size==="large"? styles.largeButton:"",
    className,
  ].filter(Boolean).join(" ");
  return (
    <button type={type} className={classes} {...props}>
      {children}
      {arrow&&<Icon name="arrow" />}
    </button>
  );
}
