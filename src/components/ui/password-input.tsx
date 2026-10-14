"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A password field with an eye button that toggles the typed value between
 * hidden and visible, so people can check it before submitting.
 */
export function PasswordInput({
  className,
  wrapperClassName,
  showLabel = "Show password",
  hideLabel = "Hide password",
  ...props
}: Omit<React.ComponentProps<"input">, "type"> & {
  wrapperClassName?: string;
  showLabel?: string;
  hideLabel?: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={cn("relative", wrapperClassName)}>
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={cn(className, "pr-10")}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? hideLabel : showLabel}
        aria-pressed={visible}
        title={visible ? hideLabel : showLabel}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-gray-500 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        {visible ? (
          <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
