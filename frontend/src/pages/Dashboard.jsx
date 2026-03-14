import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  return (
    <div className="p-10 bg-gray-50 min-h-screen">

      
      <h1 className="text-3xl font-bold mb-6">Welcome back </h1>

      
      <div className="grid grid-cols-3 gap-6 mb-10">

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-500">Resumes analyzed</p>
          <h2 className="text-2xl font-bold">12</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-500">Mock interviews</p>
          <h2 className="text-2xl font-bold">5</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:shadow-md transition">
          <p className="text-gray-500">Avg score</p>
          <h2 className="text-2xl font-bold">82%</h2>
        </div>

      </div>

      
      <div className="grid grid-cols-3 gap-6">

        
        <div
          onClick={() => navigate("/resume-upload")}
          className="bg-indigo-100 p-6 rounded-xl cursor-pointer hover:scale-105 hover:shadow transition"
        >
          <h3 className="font-bold mb-2 text-lg">Resume Analyzer</h3>
          <p className="text-gray-700">
            Upload resume & get AI score
          </p>
        </div>

        
        <div
          onClick={() => navigate("/mock-interview")}
          className="bg-purple-100 p-6 rounded-xl cursor-pointer hover:scale-105 hover:shadow transition"
        >
          <h3 className="font-bold mb-2 text-lg">Mock Interview</h3>
          <p className="text-gray-700">
            Practice AI interview
          </p>
        </div>

        
        <div
          onClick={() => navigate("/analytics")}
          className="bg-pink-100 p-6 rounded-xl cursor-pointer hover:scale-105 hover:shadow transition"
        >
          <h3 className="font-bold mb-2 text-lg">Analytics</h3>
          <p className="text-gray-700">
            View performance insights
          </p>
        </div>

      </div>

    </div>
  );
}