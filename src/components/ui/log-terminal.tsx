
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type LogEntry = {
  id: string;
  timestamp: Date;
  level: "info" | "warning" | "error" | "success";
  service: string;
  message: string;
};

interface LogTerminalProps {
  logs: LogEntry[];
  title?: string;
  height?: string;
  serviceTabs?: string[];
  className?: string;
}

const LogTerminal = ({
  logs,
  title = "System Logs",
  height = "h-[400px]",
  serviceTabs,
  className,
}: LogTerminalProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  // Auto-scroll to bottom when new logs come in
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = activeTab === "all" 
    ? logs 
    : logs.filter(log => log.service.toLowerCase() === activeTab.toLowerCase());

  return (
    <div className={cn("rounded-lg overflow-hidden glass-morphism border border-purple-900/30", className)}>
      <div className="flex items-center justify-between p-3 border-b border-purple-900/30 bg-black/20">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <h3 className="ml-2 font-mono text-sm font-medium">{title}</h3>
        </div>
      </div>
      
      {serviceTabs && (
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <div className="px-3 pt-2 bg-black/30">
            <TabsList className="bg-purple-950/30">
              <TabsTrigger value="all">All</TabsTrigger>
              {serviceTabs.map(service => (
                <TabsTrigger key={service} value={service.toLowerCase()}>
                  {service}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      )}
      
      <ScrollArea className={cn("terminal bg-black/50 font-mono text-sm", height)} ref={scrollRef}>
        <AnimatePresence initial={false}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                className={cn("log-entry mb-1.5", log.level)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-purple-400">
                  [{log.timestamp.toISOString().replace('T', ' ').substr(0, 19)}]
                </span>
                <span className="text-blue-300"> [{log.service}]</span>
                <span className="ml-2">{log.message}</span>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No logs available.
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
};

export default LogTerminal;
