
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Globe, 
  Chrome, 
  Brain, 
  Share2, 
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Dashboard", icon: BarChart3 },
  { path: "/proxy", label: "Proxy Service", icon: Globe },
  { path: "/selenium", label: "Selenium", icon: Chrome },
  { path: "/ai", label: "AI Model", icon: Brain },
  { path: "/cors", label: "CORS Proxy", icon: Share2 },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-purple-900/50 backdrop-blur-sm md:hidden glass-morphism"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
      
      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 glass-morphism border-r border-purple-500/20",
          "w-64 md:w-72 transform transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0 md:w-20"
        )}
        initial={false}
      >
        <div className="flex flex-col h-full py-6">
          {/* Logo */}
          <div className="px-6 mb-8">
            <motion.h1 
              className={cn(
                "font-semibold text-xl flex items-center",
                !isOpen && "md:justify-center"
              )}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
            >
              <span className="text-gradient">Proxy</span>
              <span className={cn("ml-2 transition-opacity", !isOpen && "md:hidden")}>Dashboard</span>
            </motion.h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-3 rounded-md transition-all duration-200 group",
                          isActive ? "bg-purple-500/10 text-purple-400" : "text-muted-foreground hover:bg-purple-500/5 hover:text-foreground"
                        )
                      }
                    >
                      <item.icon size={20} className={isActive ? "text-purple-400" : "text-muted-foreground group-hover:text-foreground"} />
                      <span className={cn("ml-3 transition-opacity", !isOpen && "md:hidden")}>{item.label}</span>
                      {isActive && (
                        <motion.div
                          className="absolute left-0 w-1 h-8 bg-purple-500 rounded-r-full"
                          layoutId="sidebar-indicator"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="px-6 mt-auto">
            <div className={cn(
              "text-xs text-muted-foreground",
              !isOpen && "md:text-center"
            )}>
              <p className={cn(!isOpen && "md:hidden")}>
                System Status: <span className="text-green-400">Online</span>
              </p>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mx-auto mt-2 md:block hidden"></div>
            </div>
          </div>
        </div>
      </motion.aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
