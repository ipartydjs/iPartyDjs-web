import { cn } from "./cn";
import type { ComponentPropsWithoutRef } from "react";

type ButtonNavigateProps = ComponentPropsWithoutRef<"button"> & {
    children: React.ReactNode;
};

export default function ButtonNavigate({
    children,
    className,
    ...props
}: ButtonNavigateProps) {
    return (
        <button
            {...props}
            className={cn(
                "border border-gold text-gold hover:bg-gold hover:text-surface!",
                "inline-flex items-center justify-center rounded-sm font-semibold uppercase tracking-[0.15em] transition-colors duration-300",
                "h-10 px-5 text-xs",
                className,
            )}
        >
            {children}
        </button>
    );
}
