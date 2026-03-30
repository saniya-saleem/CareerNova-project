export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r min-h-screen p-5">

      <h2 className="text-xl font-bold mb-6 text-indigo-600">
        CareerNova
      </h2>

      <nav className="space-y-3 text-sm">

        <p className="text-gray-500">CV Scoring</p>
        <p className="hover:text-indigo-600 cursor-pointer">AI Resume Builder</p>
        <p className="hover:text-indigo-600 cursor-pointer">Job Matching</p>
        <p className="hover:text-indigo-600 cursor-pointer">Cover Letter</p>

        <hr />

        <p className="hover:text-indigo-600 cursor-pointer">Dashboard</p>
        <p className="hover:text-indigo-600 cursor-pointer">Results</p>

      </nav>
    </div>
  );
}