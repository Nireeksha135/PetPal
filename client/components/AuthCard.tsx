import { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-card p-8 shadow-elevated"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
            P
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
        {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
      </motion.div>
    </div>
  );
}
