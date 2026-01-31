import * as Slot from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { cn } from "@/common/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "glass-panel rounded-full text-white shadow-[0_8px_24px_rgba(139,184,255,0.2)] hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(139,184,255,0.3)]",
        secondary:
          "glass-panel rounded-full text-[var(--text-muted)] hover:text-white",
        outline:
          "border border-[var(--glass-border)] bg-transparent text-white hover:bg-white/5",
        ghost: "text-[var(--text-muted)] hover:bg-white/5 hover:text-white",
        link: "text-[var(--accent)] underline-offset-4 hover:underline",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      },
      size: {
        default: "h-9 px-5 py-2.5",
        sm: "h-8 rounded-full px-4 text-xs",
        lg: "h-10 rounded-full px-6 text-base",
        icon: "h-9 w-9 rounded-full",
        "icon-sm": "h-8 w-8 rounded-full",
        "icon-lg": "h-10 w-10 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "button";
    return (
      <Comp
        ref={ref as React.Ref<HTMLButtonElement>}
        className={cn(buttonVariants({ variant, size, className }))}
        data-slot="button"
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
