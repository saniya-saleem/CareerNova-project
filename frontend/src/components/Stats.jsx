export default function Stats() {
  return (
    <section className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

       
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-xl border shadow-xl text-center">
          <p className="text-indigo-600 text-4xl font-black mb-1">98%</p>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
            Success Rate
          </p>
        </div>

        
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-xl border shadow-xl text-center">
          <p className="text-indigo-600 text-4xl font-black mb-1">500k+</p>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
            Resumes Analyzed
          </p>
        </div>

        
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-xl border shadow-xl text-center">
          <p className="text-indigo-600 text-4xl font-black mb-1">1M+</p>
          <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">
            Mock Interviews
          </p>
        </div>

      </div>
    </section>
  );
}