import DashboardImg from "../assets/Dashboard.png";

export default function Hero() {
  return (
    <section className="relative pt-20 pb-16 px-6 overflow-hidden hero-gradient">

      
      <div className="blob top-[-100px] left-[-100px]" />
      <div className="blob bottom-[10%] right-[-100px]" />

      <div className="max-w-5xl mx-auto text-center">

        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-8">
          <span className="h-2 w-2 bg-indigo-600 rounded-full animate-ping"></span>
          New: AI Mock Interview 2.0
        </div>

        
        <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
          Master Your Career with <br />
          <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            AI-Powered Intelligence
          </span>
        </h1>

        
        <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Optimize your resume for ATS and ace your next interview with
          real-time AI feedback and performance metrics.
        </p>

        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-full shadow hover:-translate-y-1 transition">
            Get Started Free
          </button>

          <button className="px-10 py-4 bg-white border rounded-full font-bold">
            ▶ See how it works
          </button>
        </div>

        
        <div className="relative max-w-4xl mx-auto rounded-xl overflow-hidden shadow-2xl border bg-gray-100">
          <img
            src={DashboardImg}
            alt="dashboard"
            className="w-full object-cover"
          />
        </div>

      </div>
    </section>
  );
}