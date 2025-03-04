
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const statCardVariants = cva(
  "transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-card hover:shadow-lg hover:shadow-purple-500/5",
        glass: "glass-morphism hover:bg-white/10",
        outline: "border border-purple-500/20 hover:border-purple-500/40",
      },
    },
    defaultVariants: {
      variant: "glass",
    },
  }
);

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  chartData?: Array<{ value: number; timestamp: string }>;
  variant?: "default" | "glass" | "outline";
  valueColor?: string;
  lineColor?: string;
  action?: React.ReactNode;
  className?: string;
}

const StatCard = ({
  title,
  value,
  description,
  icon,
  chartData,
  variant = "glass",
  valueColor = "text-purple-400",
  lineColor = "#9333ea",
  action,
  className,
}: StatCardProps) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={cn(statCardVariants({ variant }), className)}
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {icon && <div className="text-purple-500">{icon}</div>}
          </div>
          <CardDescription className={cn("text-2xl font-semibold", valueColor)}>
            {value}
          </CardDescription>
          {description && (
            <CardDescription className="text-xs mt-1">
              {description}
            </CardDescription>
          )}
        </CardHeader>
        
        {chartData && (
          <CardContent className="p-0 h-16 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="timestamp" 
                  hide 
                />
                <YAxis hide domain={['auto', 'auto']} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg backdrop-blur-md bg-black/70 p-2 shadow-lg border border-purple-500/20 text-xs">
                          <p className="label">{`${payload[0].payload.timestamp}`}</p>
                          <p className="text-purple-400">{`Value: ${payload[0].value}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone"
                  dataKey="value"
                  stroke={lineColor}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: lineColor, stroke: 'rgba(255, 255, 255, 0.2)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        )}
        
        {action && (
          <CardFooter className="pt-2 pb-0 px-6">
            {action}
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default StatCard;
