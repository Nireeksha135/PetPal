import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "@/components/Button";
import { getFirstName, getTimeBasedGreeting } from "@/utils/greeting";

interface WelcomeBannerProps {
  fullName: string | undefined;
  hasPets: boolean;
}

export default function WelcomeBanner({
  fullName,
  hasPets,
}: WelcomeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col justify-between gap-5 rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-7 text-primary-foreground shadow-elevated sm:flex-row sm:items-center"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {getTimeBasedGreeting()}, {getFirstName(fullName)} 👋
        </h1>
        <p className="mt-1.5 max-w-md text-sm text-primary-foreground/85">
          {hasPets
            ? "Here's what's happening with your pets today."
            : "Add your first pet to start tracking their health and care."}
        </p>
      </div>
      {!hasPets && (
        <Link to="/pets/new">
          <Button
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90"
          >
            <PawPrint size={16} />
            Add your first pet
          </Button>
        </Link>
      )}
    </motion.div>
  );
}
