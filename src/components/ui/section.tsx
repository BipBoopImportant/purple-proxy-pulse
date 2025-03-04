
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const Section = ({
  title,
  description,
  children,
  className,
  action,
}: SectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("mb-8", className)}
    >
      {(title || description) && (
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 md:mb-6">
          <div>
            {title && <h2 className="text-2xl font-medium tracking-tight">{title}</h2>}
            {description && <p className="mt-1 text-muted-foreground text-sm">{description}</p>}
          </div>
          {action && <div className="mt-2 md:mt-0">{action}</div>}
        </div>
      )}
      <div className="w-full">{children}</div>
    </motion.section>
  );
};

export default Section;
