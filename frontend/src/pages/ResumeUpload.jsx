import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a resume");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/api/resume/upload/",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);
      setResult(response.data);
      toast.success("Resume uploaded successfully 🚀");
    } catch (error) {
      console.log(error.response?.data);
      toast.error(
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
    } else {
      toast.error("Only PDF files are accepted");
    }
  };

  const scoreColor =
    result?.ats_score >= 80
      ? "text-emerald-600"
      : result?.ats_score >= 60
      ? "text-amber-500"
      : "text-red-500";

  const scoreBarColor =
    result?.ats_score >= 80
      ? "from-emerald-400 to-teal-500"
      : result?.ats_score >= 60
      ? "from-amber-400 to-orange-400"
      : "from-red-400 to-rose-500";

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            ATS RESUME ANALYZER
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Resume Upload
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Upload your resume and get an instant ATS score with skill analysis and improvement suggestions.
          </p>
        </div>

        
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
            Upload Your Resume
          </h2>

         
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("resumeInput").click()}
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 mb-5 ${
              dragOver
                ? "border-indigo-400 bg-indigo-50"
                : file
                ? "border-emerald-300 bg-emerald-50"
                : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/50"
            }`}
          >
            <input
              id="resumeInput"
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file ? (
              <>
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 fill-emerald-500" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM9 17l-3-3 1.41-1.41L9 14.17l5.59-5.58L16 10l-7 7z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-emerald-700">{file.name}</p>
                <p className="text-xs text-emerald-500 mt-1">
                  {(file.size / 1024).toFixed(1)} KB · PDF
                </p>
                <button
                  onClick={(e) => { e.stopPropagation(); setFile(null); setResult(null); }}
                  className="mt-3 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Remove file
                </button>
              </>
            ) : (
              <>
                <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-3">
                  <svg className="w-7 h-7 fill-indigo-500" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM12 12l4 4h-3v4h-2v-4H8l4-4z" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  Drag & drop your resume here
                </p>
                <p className="text-xs text-gray-400 mt-1">or click to browse · PDF only</p>
              </>
            )}
          </div>

         
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Analyzing Resume...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Analyze Resume
              </>
            )}
          </button>
        </div>

        
        {result && (
          <div className="flex flex-col gap-4">

            
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">ATS Score</h3>
                  <p className="text-xs text-gray-400 mt-0.5">How well your resume passes ATS filters</p>
                </div>
                <span className={`text-4xl font-extrabold ${scoreColor}`}>
                  {result.ats_score}%
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-3 bg-gradient-to-r ${scoreBarColor} rounded-full transition-all duration-700`}
                  style={{ width: `${result.ats_score}%` }}
                />
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-400">0%</span>
                <span className={`text-xs font-semibold ${scoreColor}`}>
                  {result.ats_score >= 80 ? "Excellent" : result.ats_score >= 60 ? "Good" : "Needs Work"}
                </span>
                <span className="text-xs text-gray-400">100%</span>
              </div>
            </div>

           
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              
              {result.skills_found?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 fill-emerald-500" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800">Skills Found</h4>
                    <span className="ml-auto text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {result.skills_found.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.skills_found.map((skill, i) => (
                      <span key={i} className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              
              {result.missing_skills?.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 bg-red-100 rounded-lg flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 fill-red-500" viewBox="0 0 24 24">
                        <path d="M19 13H5v-2h14v2z" />
                      </svg>
                    </div>
                    <h4 className="text-sm font-bold text-gray-800">Missing Skills</h4>
                    <span className="ml-auto text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                      {result.missing_skills.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.map((skill, i) => (
                      <span key={i} className="text-xs font-medium text-red-600 bg-red-50 border border-red-100 px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            
            {result.suggestions?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 fill-indigo-500" viewBox="0 0 24 24">
                      <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7zm3 18H9v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1z" />
                    </svg>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">Improvement Suggestions</h4>
                </div>
                <div className="space-y-3">
                  {result.suggestions.map((s, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-indigo-600">{i + 1}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
    </>
  );
  
}