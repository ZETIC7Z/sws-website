import { motion } from "framer-motion";

const stats = [
  { label: "Server Status", value: "Online", isStatus: true, online: true },
  { label: "Total Online", value: "1,247", isStatus: false },
  { label: "Peak Today", value: "2,891", isStatus: false },
  { label: "Registered", value: "45,672", isStatus: false },
];

const ServerStatus = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
    {stats.map((stat, i) => (
      <motion.div
        key={stat.label}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: i * 0.1 }}
        className="glass ornate-border rounded-lg p-4 md:p-5 text-center"
      >
        <p className="text-[10px] md:text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
          {stat.label}
        </p>
        {stat.isStatus ? (
          <div className="flex items-center justify-center gap-2">
            <span className={`w-3 h-3 rounded-full ${stat.online ? "bg-success animate-pulse-glow" : "bg-accent"}`} />
            <span className={`font-heading text-lg md:text-xl font-bold ${stat.online ? "text-success" : "text-accent"}`}>
              {stat.value}
            </span>
          </div>
        ) : (
          <p className="font-mono text-xl md:text-2xl font-bold text-primary text-glow-gold">
            {stat.value}
          </p>
        )}
      </motion.div>
    ))}
  </div>
);

export default ServerStatus;
