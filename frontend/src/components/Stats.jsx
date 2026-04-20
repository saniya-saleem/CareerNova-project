import { motion } from "framer-motion";

export default function Stats() {
  const stats = [
    { value: "98%", label: "Success Rate" },
    { value: "500k+", label: "Resumes Analyzed" },
    { value: "1M+", label: "Mock Interviews" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <section className="max-w-7xl mx-auto px-6 -mt-16 md:-mt-24 relative z-20 mb-20">
      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, idx) => (
          <motion.div 
            key={idx}
            variants={item}
            className="bg-[var(--bg-surface)]/80 backdrop-blur-xl p-8 rounded-2xl border border-[var(--border-main)] shadow-xl shadow-gray-200/50 dark:shadow-none text-center transform transition-transform duration-300 hover:-translate-y-1"
          >
            <p className="text-primary-600 dark:text-primary-400 text-4xl md:text-5xl font-black mb-2 tracking-tight">
              {stat.value}
            </p>
            <p className="text-[var(--text-muted)] font-bold uppercase text-xs tracking-[0.2em]">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}