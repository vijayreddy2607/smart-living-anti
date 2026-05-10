import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";

type Props = HTMLMotionProps<"div"> & { strong?: boolean };

export function GlassCard({ className, strong, ...props }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        strong ? "glass-strong" : "glass",
        "rounded-3xl p-6",
        className,
      )}
      {...props}
    />
  );
}
