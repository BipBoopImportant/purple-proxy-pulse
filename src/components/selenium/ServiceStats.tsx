
import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { getServiceStats, getChartData } from "@/lib/api";
import StatCard from "@/components/ui/stat-card";
import Section from "@/components/ui/section";

const ServiceStats: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ["serviceStats", "selenium"],
    queryFn: () => getServiceStats("selenium"),
    refetchInterval: 5000,
  });
  
  const cpuData = useQuery({
    queryKey: ["chartData", "selenium", "cpu"],
    queryFn: () => getChartData(24, 100, 20),
    refetchInterval: 60000,
  });
  
  const memoryData = useQuery({
    queryKey: ["chartData", "selenium", "memory"],
    queryFn: () => getChartData(24, 2048, 512),
    refetchInterval: 60000,
  });

  return (
    <Section title="Service Statistics" description="Real-time Selenium service metrics">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="CPU Usage"
          value={`${stats?.cpuUsage.toFixed(1)}%`}
          chartData={cpuData.data}
        />
        <StatCard
          title="Memory Usage"
          value={`${stats?.memoryUsage.toFixed(0)} MB`}
          chartData={memoryData.data}
        />
        <StatCard
          title="Active Sessions"
          value={stats?.activeConnections.toString() || "0"}
          chartData={getChartData(20, 10, 0)}
        />
        <StatCard
          title="Success Rate"
          value={`${stats?.successRate.toFixed(2)}%`}
          chartData={getChartData(20, 100, 80)}
        />
      </div>
    </Section>
  );
};

export default ServiceStats;
