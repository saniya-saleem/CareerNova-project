export default function Dashboard() {
  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      {/* header */}
      <h1 className="text-3xl font-bold mb-6">Welcome back 👋</h1>

      {/* stats */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Resumes analyzed</p>
          <h2 className="text-2xl font-bold">12</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Mock interviews</p>
          <h2 className="text-2xl font-bold">5</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-500">Avg score</p>
          <h2 className="text-2xl font-bold">82%</h2>
        </div>
      </div>

      {/* feature cards */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-indigo-100 p-6 rounded-xl">
          <h3 className="font-bold mb-2">Resume Analyzer</h3>
          <p>Upload resume & get AI score</p>
        </div>

        <div className="bg-purple-100 p-6 rounded-xl">
          <h3 className="font-bold mb-2">Mock Interview</h3>
          <p>Practice AI interview</p>
        </div>

        <div className="bg-pink-100 p-6 rounded-xl">
          <h3 className="font-bold mb-2">Analytics</h3>
          <p>View performance insights</p>
        </div>
      </div>

    </div>
  );
}