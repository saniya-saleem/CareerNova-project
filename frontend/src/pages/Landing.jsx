import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import { motion } from "framer-motion";
import { CheckCircle2, Bot, Target, ShieldCheck } from "lucide-react";

export default function Landing() {

  const features = [
    {
      icon: <Target className="w-6 h-6 text-primary-600" />,
      title: "ATS Optimization",
      desc: "Instantly score your resume against leading Applicant Tracking Systems. Get actionable feedback to improve readability and keyword match."
    },
    {
      icon: <Bot className="w-6 h-6 text-primary-600" />,
      title: "AI Mock Interviews",
      desc: "Practice with an AI trained on thousands of technical and behavioral interviews. Receive real-time performance metrics."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary-600" />,
      title: "Secure & Private",
      desc: "Your data is strictly confidential. We employ enterprise-grade encryption to ensure your career progression remains entirely private."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)]">
      <Navbar />
      <Hero />
      <Stats />

      {/* Features Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--text-main)] mb-4 tracking-tight">
              Powerful tools to land your dream job
            </h2>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              We leverage advanced LLMs and standardized recruitment rubrics to dramatically improve your application funnel.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[var(--bg-surface)] p-8 rounded-3xl border border-[var(--border-main)] shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-6 border border-primary-100 dark:bg-primary-500/10 dark:border-primary-500/20">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-3">{feat.title}</h3>
                <p className="text-[var(--text-muted)] leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-6 bg-[var(--bg-surface)] border-t border-[var(--border-main)] text-center relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e6/Graph-paper.svg')] opacity-5 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-primary-600 rounded-[3rem] p-12 md:p-20 shadow-2xl shadow-primary-500/20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to accelerate your career?
            </h2>
            <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join thousands of professionals who have optimized their resumes and aced their interviews using CareerNova.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="/register" 
                className="px-8 py-4 bg-white text-primary-600 font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg"
              >
                Create Free Account
              </a>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-primary-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Cancel anytime
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-[var(--border-main)] bg-[var(--bg-main)] text-center text-[var(--text-muted)]">
        <p>© {new Date().getFullYear()} CareerNova Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}